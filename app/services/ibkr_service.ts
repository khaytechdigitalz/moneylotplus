import env from '#start/env'
import app from '@adonisjs/core/services/app'
import { readFile } from 'node:fs/promises'
import { constants, createPrivateKey, sign as cryptoSign, type KeyObject } from 'node:crypto'

export interface IbkrAccessTokenResponse {
  access_token: string
  token_type?: string
  expires_in: number
  scope?: string
}

/**
 * The SSO endpoint also returns an `access_token`, but this is the IBKR
 * gateway/SSO session token, not the OAuth client-credentials token above.
 */
export interface IbkrSsoTokenResponse {
  access_token: string
  token_type?: string
  expires_in?: number
  [key: string]: unknown
}

export interface IbkrSsoSessionInput {
  /** The actual IBKR username/credential assigned to the customer. */
  credential: string
  /** Public egress IP address from which this server calls IBKR. */
  ip: string
}

export interface IbkrSsoBrowserSessionInput {
  /** The IBKR username assigned to this customer. */
  credential: string

  /** The actual customer's public IP address. */
  ip: string
}

export interface IbkrSsoBrowserSessionResponse {
  url: string
  [key: string]: unknown
}

export default class IbkrService {
  private readonly clientId = env.get('IBKR_CLIENT_ID', '')
  private readonly keyId = env.get('IBKR_KEY_ID', '')
  private readonly privateKeyPath = env.get('IBKR_PRIVATE_KEY_PATH', 'storage/keys/ibkr_private_key.pem')

  /**
   * IBKR has separate OAuth and API gateway hosts. Configure both for the
   * selected environment; do not reuse the old `/v1/api` URL here.
   * Examples of production hosts are documented by IBKR. QA host values
   * should be the exact hosts supplied for your advisor's QA registration.
   */
  private readonly oauthBaseUrl = env.get('IBKR_OAUTH_BASE_URL', '')
  private readonly gatewayBaseUrl = env.get('IBKR_GATEWAY_BASE_URL', '')

  private readonly defaultScope = env.get(
    'IBKR_OAUTH_SCOPE',
    'accounts.read accounts.write sso-sessions.write sso-browser-sessions.write'
  )

  /**
   * Load the registered RSA private key from the PEM file.
   * The file must be outside public/ and readable only by the app process.
   */
  private async getPrivateKey(): Promise<KeyObject> {
    const pemPath = app.makePath(this.privateKeyPath)

    let pem: Buffer
    try {
      pem = await readFile(pemPath)
    } catch (error) {
      const reason = error instanceof Error ? error.message : 'Unknown file error'
      throw new Error(`Unable to read IBKR private PEM file at ${pemPath}: ${reason}`)
    }

    let privateKey: KeyObject
    try {
      privateKey = createPrivateKey(pem)
    } catch (error) {
      const reason = error instanceof Error ? error.message : 'Invalid PEM'
      throw new Error(`IBKR PEM could not be parsed. Check the PEM format/passphrase: ${reason}`)
    }

    if (privateKey.asymmetricKeyType !== 'rsa') {
      throw new Error('IBKR signing key must be an RSA private key.')
    }

    const modulusLength = privateKey.asymmetricKeyDetails?.modulusLength ?? 0
    if (modulusLength < 3072) {
      throw new Error(`IBKR RSA key must be at least 3072 bits. Detected ${modulusLength} bits.`)
    }

    return privateKey
  }

  private assertConfiguration(requireGateway = false): void {
    if (!this.clientId) throw new Error('IBKR_CLIENT_ID is not configured.')
    if (!this.keyId) throw new Error('IBKR_KEY_ID is not configured.')
    if (!this.oauthBaseUrl) throw new Error('IBKR_OAUTH_BASE_URL is not configured.')
    if (requireGateway && !this.gatewayBaseUrl) {
      throw new Error('IBKR_GATEWAY_BASE_URL is not configured.')
    }
  }

  private base64Url(value: string | Buffer): string {
    return Buffer.from(value).toString('base64url')
  }

  /**
   * Sign a compact JWT using RS256 and the registered IBKR PEM key.
   */
  private async signAssertion(claims: Record<string, unknown>): Promise<string> {
    const privateKey = await this.getPrivateKey()

    const header = {
      alg: 'RS256',
      typ: 'JWT',
      kid: this.keyId,
    }

    const encodedHeader = this.base64Url(JSON.stringify(header))
    const encodedClaims = this.base64Url(JSON.stringify(claims))
    const signingInput = `${encodedHeader}.${encodedClaims}`

    const signature = cryptoSign(
      'RSA-SHA256',
      Buffer.from(signingInput, 'utf8'),
      {
        key: privateKey,
        padding: constants.RSA_PKCS1_PADDING,
      }
    )

    return `${signingInput}.${this.base64Url(signature)}`
  }

  /**
   * STEP 1: Generate an OAuth 2.0 access token.
   *
   * IBKR flow: private_key_jwt + client_credentials.
   * There is no authorization-code redirect and no client_secret.
   */
  public async generateAccessToken(scope = this.defaultScope): Promise<IbkrAccessTokenResponse> {
    this.assertConfiguration()

    const now = Math.floor(Date.now() / 1000)
    const clientAssertion = await this.signAssertion({
      iss: this.clientId,
      sub: this.clientId,
      aud: '/token',
      exp: now + 20,
      iat: now - 10,
    })

    const endpoint = `${this.oauthBaseUrl.replace(/\/$/, '')}/api/v1/token`
    const body = new URLSearchParams({
      client_assertion_type: 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer',
      client_assertion: clientAssertion,
      grant_type: 'client_credentials',
      scope,
    })

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
      },
      body,
      signal: AbortSignal.timeout(30_000),
    })

    const responseText = await response.text()
    let data: unknown
    try {
      data = responseText ? JSON.parse(responseText) : {}
    } catch {
      data = { raw_response: responseText }
    }

    if (!response.ok) {
      throw new Error(
        `IBKR OAuth access-token request failed (${response.status}): ${JSON.stringify(data)}`
      )
    }

    const token = data as Partial<IbkrAccessTokenResponse>
    if (!token.access_token || typeof token.expires_in !== 'number') {
      throw new Error(`IBKR returned an unexpected access-token response: ${JSON.stringify(data)}`)
    }

    return token as IbkrAccessTokenResponse
  }

  /**
   * STEP 2: Exchange the OAuth access token for an IBKR SSO/gateway token.
   *
   * The request body is the raw compact JWT (not JSON and not form data).
   * The OAuth access token is sent in the Authorization Bearer header.
   */
  public async exchangeAccessTokenForSsoToken(
    accessToken: string,
    input: IbkrSsoSessionInput
  ): Promise<IbkrSsoTokenResponse> {
    this.assertConfiguration(true)

    if (!accessToken?.trim()) throw new Error('An OAuth access token is required.')
    if (!input.credential?.trim()) throw new Error('The IBKR username/credential is required for SSO.')
    if (!input.ip?.trim()) throw new Error('The server public egress IP address is required for SSO.')

    const now = Math.floor(Date.now() / 1000)
    const ssoAssertion = await this.signAssertion({
      ip: input.ip.trim(),
      credential: input.credential.trim(),
      iss: this.clientId,
      exp: now + 86400,
      iat: now,
    })

    const endpoint = `${this.gatewayBaseUrl.replace(/\/$/, '')}/api/v1/sso-sessions`
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/jwt',
        Accept: 'application/json',
      },
      body: ssoAssertion,
      signal: AbortSignal.timeout(30_000),
    })

    const responseText = await response.text()
    let data: unknown
    try {
      data = responseText ? JSON.parse(responseText) : {}
    } catch {
      data = { raw_response: responseText }
    }

    if (!response.ok) {
      throw new Error(
        `IBKR SSO token exchange failed (${response.status}): ${JSON.stringify(data)}`
      )
    }

    const token = data as Partial<IbkrSsoTokenResponse>
    if (!token.access_token) {
      throw new Error(`IBKR SSO response did not contain access_token: ${JSON.stringify(data)}`)
    }

    return token as IbkrSsoTokenResponse
  }

  /**
   * Convenience method: obtain the OAuth token and immediately create SSO.
   * Returns both tokens separately so they are not confused or interchanged.
   */
  public async generateTokens(input: IbkrSsoSessionInput, scope = this.defaultScope) {
    const oauthToken = await this.generateAccessToken(scope)
    const ssoToken = await this.exchangeAccessTokenForSsoToken(
      oauthToken.access_token,
      input
    )

    return {
      oauth: oauthToken,
      sso: ssoToken,
    }
  }

  /**
   * Make an authenticated Account Management API request.
   * Account Management calls use the OAuth access token, not the SSO token.
   */
  private async accountManagementRequest<T>(
    path: string,
    accessToken: string,
    options: { method?: 'GET' | 'POST'; body?: unknown } = {}
  ): Promise<T> {
    this.assertConfiguration(true)
    if (!accessToken?.trim()) throw new Error('An IBKR OAuth access token is required.')

    const endpoint = `${this.gatewayBaseUrl.replace(/\/$/, '')}/gw/api/v1/${path.replace(/^\//, '')}`
    const headers: Record<string, string> = {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/json',
    }

    const init: RequestInit = {
      method: options.method ?? 'GET',
      headers,
      signal: AbortSignal.timeout(120_000),
    }

    if (options.body !== undefined) {
      headers['Content-Type'] = 'application/json'
      init.body = JSON.stringify(options.body)
    }

    const response = await fetch(endpoint, init)
    const responseText = await response.text()
    let data: unknown
    try {
      data = responseText ? JSON.parse(responseText) : {}
    } catch {
      data = { raw_response: responseText }
    }

    if (!response.ok) {
      throw new Error(
        `IBKR Account Management request failed (${response.status}) ${options.method ?? 'GET'} ${path}: ${JSON.stringify(data)}`
      )
    }

    return data as T
  }

  /**
   * Create a Hybrid account using the same signed-JWT request format as the
   * previously tested PHP implementation.
   *
   * IMPORTANT: IBKR expects the compact signed JWT as the raw HTTP body with
   * Content-Type: application/jwt. Do not JSON.stringify the application.
   * The OAuth access token is sent separately as a Bearer token.
   */
  public async createAccount(
    accessToken: string,
    payload: { application: Record<string, unknown> }
  ): Promise<unknown> {
    this.assertConfiguration(true)

    if (!accessToken?.trim()) {
      throw new Error('An IBKR OAuth access token is required.')
    }
    if (!payload?.application || typeof payload.application !== 'object') {
      throw new Error('Create-account payload must contain an application object.')
    }

    // Match the working PHP claims exactly: iss, sub and application.
    // The tested PHP flow omitted iat/exp unless explicitly enabled.
    const signedApplication = await this.signAssertion({
      iss: this.clientId,
      sub: this.clientId,
      application: payload.application,
    })

    const endpoint = `${this.gatewayBaseUrl.replace(/\/$/, '')}/gw/api/v1/accounts`
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/jwt',
        Accept: 'application/json',
      },
      body: signedApplication,
      signal: AbortSignal.timeout(120_000),
    })

    const responseText = await response.text()
    let data: unknown
    try {
      data = responseText ? JSON.parse(responseText) : {}
    } catch {
      data = { raw_response: responseText }
    }

    if (!response.ok) {
      throw new Error(
        `IBKR account creation failed (${response.status}): ${JSON.stringify(data)}`
      )
    }

    return data
  }

  /** Retrieve status for one IBKR account. */
  public async getAccountStatus(accessToken: string, accountId: string) {
    if (!accountId?.trim()) throw new Error('IBKR account ID is required.')
    return this.accountManagementRequest(
      `accounts/${encodeURIComponent(accountId.trim())}/status`,
      accessToken
    )
  }

  /** Retrieve registration tasks. Defaults to pending tasks required for approval. */
  public async getAccountTasks(
    accessToken: string,
    accountId: string,
    type: 'pending' | 'registration' = 'pending'
  ) {
    if (!accountId?.trim()) throw new Error('IBKR account ID is required.')
    const query = new URLSearchParams({ type })
    return this.accountManagementRequest(
      `accounts/${encodeURIComponent(accountId.trim())}/tasks?${query.toString()}`,
      accessToken
    )
  }


  /** Retrieve account information and registration details from IBKR. */
  public async getAccountDetails(
    accessToken: string,
    accountId: string
  ) {
    const cleanAccountId = String(accountId ?? '').trim()

    if (!cleanAccountId) {
      throw new Error('IBKR account ID is required.')
    }

    if (cleanAccountId.length > 64 || /[/\\\s]/.test(cleanAccountId)) {
      throw new Error('Invalid IBKR account ID.')
    }

    return this.accountManagementRequest(
      `accounts/${encodeURIComponent(cleanAccountId)}/details`,
      accessToken,
      {
        method: 'GET',
      }
    )
  }



/** Retrieve KYC verification details for an IBKR account. */
public async getAccountKyc(
  accessToken: string,
  accountId: string
) {
  const cleanAccountId = String(accountId ?? '').trim()

  if (!cleanAccountId) {
    throw new Error('IBKR account ID is required.')
  }

  if (cleanAccountId.length > 64 || /[/\\\s]/.test(cleanAccountId)) {
    throw new Error('Invalid IBKR account ID.')
  }

  return this.accountManagementRequest(
    `accounts/${encodeURIComponent(cleanAccountId)}/kyc`,
    accessToken,
    {
      method: 'GET',
    }
  )
}


/**
 * Create an IBKR Client Portal browser SSO session.
 *
 * This is specifically for redirecting Hybrid account applicants
 * to the IBKR Client Portal to complete outstanding registration tasks.
 */
public async createSsoBrowserSession(
  accessToken: string,
  input: IbkrSsoBrowserSessionInput
): Promise<IbkrSsoBrowserSessionResponse> {
  this.assertConfiguration(true)

  const credential = String(input.credential ?? '').trim()
  const ip = String(input.ip ?? '').trim()

  if (!accessToken?.trim()) {
    throw new Error('An IBKR OAuth access token is required.')
  }

  if (!credential) {
    throw new Error('The customer\'s IBKR username is required.')
  }

  if (!ip) {
    throw new Error('The customer\'s public IP address is required.')
  }

  // IBKR Client Portal browser SSO endpoint.
  // Notice that this is /api/v1, NOT /gw/api/v1.
  const endpoint = `${this.gatewayBaseUrl.replace(/\/$/, '')}/api/v1/sso-browser-sessions`

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      credential,
      ip,
    }),
    signal: AbortSignal.timeout(30_000),
  })

  const responseText = await response.text()

  let data: unknown

  try {
    data = responseText ? JSON.parse(responseText) : {}
  } catch {
    data = { raw_response: responseText }
  }

  if (!response.ok) {
    throw new Error(
      `IBKR browser SSO request failed (${response.status}): ${JSON.stringify(data)}`
    )
  }

  const result = data as Partial<IbkrSsoBrowserSessionResponse>

  if (!result.url || typeof result.url !== 'string') {
    throw new Error(
      `IBKR browser SSO response did not contain a valid URL: ${JSON.stringify(data)}`
    )
  }

  // Never redirect a customer to a non-HTTPS URL.
  let parsedUrl: URL

  try {
    parsedUrl = new URL(result.url)
  } catch {
    throw new Error('IBKR returned an invalid browser SSO URL.')
  }

  if (parsedUrl.protocol !== 'https:') {
    throw new Error('IBKR returned an insecure browser SSO URL.')
  }

  return result as IbkrSsoBrowserSessionResponse
}




}
