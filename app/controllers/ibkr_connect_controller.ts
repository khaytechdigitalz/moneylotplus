import type { HttpContext } from '@adonisjs/core/http'
import IbkrService from '#services/ibkr_service'
import {
  createIbkrHybridAccountValidator,
} from '#validators/ibkr_hybrid_account_validator'
import { buildIbkrHybridIndividualApplication } from '#services/ibkr_hybrid_application_builder'

export default class IbkrConnectController {
  private ibkrService = new IbkrService()

  /** Generate the platform OAuth token (restrict this route to trusted admins). */
  public async generateToken({ response }: HttpContext) {
    try {
      const token = await this.ibkrService.generateAccessToken(
        'accounts.read accounts.write sso-sessions.write'
      )

      return response.ok({
        success: true,
        message: 'IBKR OAuth access token generated successfully.',
        data: token,
      })
    } catch (error) {
      return this.handleError(response, error, 'Failed to generate IBKR access token.')
    }
  }

  /** Exchange an OAuth access token for the customer's IBKR SSO session. */
  public async exchangeTokenForSso({ request, response }: HttpContext) {
    try {
      const credential = String(request.input('credential', '')).trim()
      const ip = request.ip()

      if (!credential || !ip) {
        return response.badRequest({
          success: false,
          message: 'Both IBKR credential (username) and server public IP are required.',
        })
      }

      const oauth = await this.ibkrService.generateAccessToken('sso-sessions.write')
      const sso = await this.ibkrService.exchangeAccessTokenForSsoToken(
        oauth.access_token,
        { credential, ip }
      )

      return response.ok({
        success: true,
        message: 'IBKR SSO session created successfully.',
        data: { sso, oauth_expires_in: oauth.expires_in },
      })
    } catch (error) {
      return this.handleError(response, error, 'Failed to create IBKR SSO session.')
    }
  }

  /**
   * Create a UK Individual Hybrid application from validated onboarding data.
   * The request body contains applicant/account fields, NOT a prebuilt IBKR
   * payload. The builder constructs customer, accounts, users and translation.
   */
  public async createAccount({ auth, request, response }: HttpContext) {
    // Vine validation errors are allowed to reach Adonis' validation handler
    // so the client receives a proper 422 response with field-level messages.
    const onboardingData = await request.validateUsing(createIbkrHybridAccountValidator)

    let applicationPayload
    try {
      applicationPayload = buildIbkrHybridIndividualApplication(
        onboardingData,
        String(auth.user!.id)
      )
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      return response.unprocessableEntity({ success: false, message })
    }

    try {
      const oauth = await this.ibkrService.generateAccessToken('accounts.write')
      const result = await this.ibkrService.createAccount(
        oauth.access_token,
        applicationPayload
      )

      return response.ok({
        success: true,
        message: 'IBKR Hybrid account application submitted successfully.',
        data: result,
      })
    } catch (error) {
      return this.handleError(response, error, 'IBKR account creation failed.')
    }
  }

  /** Retrieve the current status for one IBKR account. */
  public async accountStatus({ params, response }: HttpContext) {
    try {
      const accountId = String(params.accountId ?? '').trim()
      if (!accountId) {
        return response.badRequest({ success: false, message: 'IBKR account ID is required.' })
      }

      const oauth = await this.ibkrService.generateAccessToken('accounts.read')
      const result = await this.ibkrService.getAccountStatus(oauth.access_token, accountId)

      return response.ok({
        success: true,
        message: 'IBKR account status retrieved successfully.',
        data: result,
      })
    } catch (error) {
      return this.handleError(response, error, 'Failed to retrieve IBKR account status.')
    }
  }

  /** Retrieve pending tasks (or all registration tasks) for an IBKR account. */
  public async accountPendingTasks({ params, request, response }: HttpContext) {
    try {
      const accountId = String(params.accountId ?? '').trim()
      const requestedType = String(request.input('type', 'pending'))

      if (!accountId) {
        return response.badRequest({ success: false, message: 'IBKR account ID is required.' })
      }
      if (!['pending', 'registration'].includes(requestedType)) {
        return response.badRequest({
          success: false,
          message: 'Task type must be either pending or registration.',
        })
      }

      const oauth = await this.ibkrService.generateAccessToken('accounts.read')
      const result = await this.ibkrService.getAccountTasks(
        oauth.access_token,
        accountId,
        requestedType as 'pending' | 'registration'
      )

      return response.ok({
        success: true,
        message: requestedType === 'pending'
          ? 'IBKR pending registration tasks retrieved successfully.'
          : 'IBKR registration tasks retrieved successfully.',
        data: result,
      })
    } catch (error) {
      return this.handleError(response, error, 'Failed to retrieve IBKR registration tasks.')
    }
  }

  /** Retrieve registration and account details for an IBKR account. */
  public async accountDetails({ params, response }: HttpContext) {
    try {
      const accountId = String(params.accountId ?? '').trim()

      if (!accountId) {
        return response.badRequest({
          success: false,
          message: 'IBKR account ID is required.',
        })
      }

      if (accountId.length > 64 || /[/\\\s]/.test(accountId)) {
        return response.badRequest({
          success: false,
          message: 'Invalid IBKR account ID.',
        })
      }

      // Generate OAuth access token internally.
      const oauth = await this.ibkrService.generateAccessToken('accounts.read')

      // Retrieve account details from IBKR.
      const result = await this.ibkrService.getAccountDetails(
        oauth.access_token,
        accountId
      )

      return response.ok({
        success: true,
        message: 'IBKR account details retrieved successfully.',
        data: result,
      })
    } catch (error) {
      return this.handleError(
        response,
        error,
        'Failed to retrieve IBKR account details.'
      )
    }
  }



/** Retrieve KYC verification details for an IBKR account. */
public async accountKyc({ params, response }: HttpContext) {
  try {
    const accountId = String(params.accountId ?? '').trim()

    if (!accountId) {
      return response.badRequest({
        success: false,
        message: 'IBKR account ID is required.',
      })
    }

    if (accountId.length > 64 || /[/\\\s]/.test(accountId)) {
      return response.badRequest({
        success: false,
        message: 'Invalid IBKR account ID.',
      })
    }

    // Generate OAuth access token internally.
    const oauth = await this.ibkrService.generateAccessToken('accounts.read')

    // Retrieve KYC details from IBKR.
    const result = await this.ibkrService.getAccountKyc(
      oauth.access_token,
      accountId
    )

    return response.ok({
      success: true,
      message: 'IBKR KYC details retrieved successfully.',
      data: result,
    })
  } catch (error) {
    return this.handleError(
      response,
      error,
      'Failed to retrieve IBKR KYC details.'
    )
  }
}


/**
 * Continue an incomplete Hybrid IBKR registration.
 *
 * Verifies account ownership, checks the IBKR account status,
 * retrieves pending tasks and creates a Client Portal browser SSO URL.
 */
public async continueRegistration({
  auth,
  params,
  request,
  response,
}: HttpContext) {
  try {
    const accountId = String(params.accountId ?? '').trim()

    if (!accountId) {
      return response.badRequest({
        success: false,
        message: 'IBKR account ID is required.',
      })
    }

    if (accountId.length > 64 || /[/\\\s]/.test(accountId)) {
      return response.badRequest({
        success: false,
        message: 'Invalid IBKR account ID.',
      })
    }

    if (!auth.user) {
      return response.unauthorized({
        success: false,
        message: 'Authentication is required.',
      })
    }

    /**
     * IMPORTANT:
     * Replace these property names with the actual fields in your
     * User model or your IBKR account relationship.
     */
    const customer = auth.user as typeof auth.user & {
      ibkrAccountId?: string | null
      ibkrCredential?: string | null
    }

    // Verify that this IBKR account belongs to the authenticated customer.
    if (
      !customer.ibkrAccountId ||
      customer.ibkrAccountId !== accountId
    ) {
      return response.notFound({
        success: false,
        message: 'IBKR account was not found for this customer.',
      })
    }

    const credential = String(customer.ibkrCredential ?? '').trim()

    if (!credential) {
      return response.unprocessableEntity({
        success: false,
        message: 'IBKR username is not available for this account.',
      })
    }

    // 1. Retrieve the latest IBKR account status.
    const oauth = await this.ibkrService.generateAccessToken(
      'accounts.read sso-browser-sessions.write'
    )

    const statusResult = await this.ibkrService.getAccountStatus(
      oauth.access_token,
      accountId
    )

    const accountStatus = statusResult as {
      state?: string
      status?: string
      description?: string
    }

    // This endpoint is intended for incomplete applications.
    if (accountStatus.state !== 'Incomplete Application') {
      return response.conflict({
        success: false,
        message: 'This IBKR account is not currently in the Incomplete Application state.',
        data: {
          accountId,
          state: accountStatus.state ?? null,
          status: accountStatus.status ?? null,
        },
      })
    }

    // 2. Retrieve pending registration tasks.
    const pendingResult = await this.ibkrService.getAccountTasks(
      oauth.access_token,
      accountId,
      'pending'
    )

    const taskData = pendingResult as {
      pendingTasks?: Array<{
        formNumber?: number
        formName?: string
        action?: string
        state?: string
        requiredForApproval?: boolean
        onlineTask?: boolean
      }>
      empty?: boolean
    }

    const pendingTasks = taskData.pendingTasks ?? []

    // 3. Get the actual customer's IP.
    // Configure trusted proxies correctly so request.ip() resolves
    // the customer's real public IP, not your reverse proxy's IP.
    const customerIp = request.ip()

    if (!customerIp) {
      return response.unprocessableEntity({
        success: false,
        message: 'Unable to determine the customer public IP address.',
      })
    }

    // 4. Generate an IBKR Client Portal browser SSO session.
    const sso = await this.ibkrService.createSsoBrowserSession(
      oauth.access_token,
      {
        credential,
        ip: customerIp,
      }
    )

    return response.ok({
      success: true,
      message: 'IBKR registration continuation session created successfully.',
      data: {
        accountId,
        accountState: accountStatus.state,
        pendingTaskCount: pendingTasks.length,
        pendingTasks,
        redirectUrl: sso.url,
        expiresIn: 60,
        expiresInUnit: 'seconds',
      },
    })
  } catch (error) {
    return this.handleError(
      response,
      error,
      'Unable to continue IBKR account registration.'
    )
  }
}



  private handleError(
    response: HttpContext['response'],
    error: unknown,
    fallback: string
  ) {
    const message = error instanceof Error ? error.message : String(error)
    // Do not return stack traces, PEM contents, JWT assertions or bearer tokens.
    return response.badGateway({ success: false, message: fallback, error: message })
  }
}

 
