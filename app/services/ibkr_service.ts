import env from '#start/env'

export interface IbkrTokenResponse {
  access_token: string
  refresh_token: string
  expires_in: number
  token_type?: string
}

export default class IbkrService {
  private clientId = env.get('IBKR_CLIENT_ID', '')
  private clientSecret = env.get('IBKR_CLIENT_SECRET', '')
  private redirectUri = env.get('IBKR_REDIRECT_URI', '')
  private baseUrl = env.get('IBKR_API_BASE_URL', 'https://api.ibkr.com/v1/api')

  /**
   * Construct IBKR OAuth authorization redirect URL
   */
  public getAuthorizationUrl(state: string): string {
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      scope: 'read accounts positions history',
      state: state,
    })

    return `${this.baseUrl}/oauth/authorize?${params.toString()}`
  }

  /**
   * Exchange authorization code for Access & Refresh Tokens
   */
  public async exchangeCodeForToken(code: string): Promise<IbkrTokenResponse> {
    const response = await fetch(`${this.baseUrl}/oauth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64')}`,
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: this.redirectUri,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`IBKR Token Exchange Failed: ${errorText}`)
    }

    return (await response.json()) as IbkrTokenResponse
  } 

  /**
   * Fetch Account Overview using Access Token
   */
  public async getAccountOverview(accessToken: string) {
    const response = await fetch(`${this.baseUrl}/portfolio/accounts`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error('Failed to fetch IBKR account list')
    }

    return await response.json()
  }

  /**
   * Request execution of an IBKR Flex Web Service Statement Query
   */
  public async requestFlexReport(flexToken: string, flexQueryId: string) {
    const flexUrl = `https://www.interactivebrokers.com/Universal/servlet/FlexStatementService.SendRequest?t=${flexToken}&q=${flexQueryId}&v=3`
    
    const response = await fetch(flexUrl)
    const xmlText = await response.text()
    
    // Parses reference code returned by IBKR for statement retrieval
    return xmlText
  }
}