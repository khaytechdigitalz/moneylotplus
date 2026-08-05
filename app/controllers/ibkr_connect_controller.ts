import type { HttpContext } from '@adonisjs/core/http'
import IbkrService from '#services/ibkr_service'
import UserIbkrAccount from '#models/user_ibkr_account'
import { DateTime } from 'luxon'
import vine from '@vinejs/vine'

const linkFlexValidator = vine.compile(
  vine.object({
    flexToken: vine.string().trim(),
    flexQueryId: vine.string().trim(),
    accountNumber: vine.string().trim().optional(),
  })
)

export default class IbkrConnectController {
  private ibkrService = new IbkrService()

  /**
   * 1. Initiate OAuth flow by returning the IBKR login URL
   */
  public async initiateAuth({ auth, response }: HttpContext) {
    const user = auth.user!
    const statePayload = Buffer.from(JSON.stringify({ userId: user.id, timestamp: Date.now() })).toString('base64')
    
    const authUrl = this.ibkrService.getAuthorizationUrl(statePayload)

    return response.ok({
      success: true,
      authUrl,
    })
  }

  /**
   * 2. OAuth Callback Route (Redirect target from IBKR)
   */
  public async handleCallback({ request, response }: HttpContext) {
    const { code, state, error } = request.qs()

    if (error) {
      return response.badRequest({ errors: [{ message: `IBKR authorization failed: ${error}` }] })
    }

    if (!code || !state) {
      return response.badRequest({ errors: [{ message: 'Missing required OAuth code or state parameter.' }] })
    }

    // Decode state to get user context
    const decodedState = JSON.parse(Buffer.from(state, 'base64').toString('ascii'))
    const userId = decodedState.userId

    try {
      // Exchange code for tokens
      const tokenData = await this.ibkrService.exchangeCodeForToken(code)

      // Fetch user's primary account number from IBKR
      const accounts = await this.ibkrService.getAccountOverview(tokenData.access_token)
      const primaryAccount = Array.isArray(accounts) ? accounts[0]?.accountId : null

      // Store credentials in database
      await UserIbkrAccount.updateOrCreate(
        { userId },
        {
          accountNumber: primaryAccount,
          connectionType: 'oauth',
          accessToken: tokenData.access_token,
          refreshToken: tokenData.refresh_token,
          tokenExpiresAt: DateTime.now().plus({ seconds: tokenData.expires_in || 3600 }),
          status: 'connected',
        }
      )

      return response.ok({
        success: true,
        message: 'Interactive Brokers account linked successfully.',
        accountNumber: primaryAccount,
      })
    } catch (err: any) {
      return response.internalServerError({
        errors: [{ message: 'Failed to complete IBKR OAuth linking.', error: err.message }],
      })
    }
  }

  /**
   * 3. Alternative/Complementary: Connect via Flex Web Service Credentials
   */
  public async linkFlexService({ auth, request, response }: HttpContext) {
    const user = auth.user!
    const payload = await request.validateUsing(linkFlexValidator)

    const ibkrAccount = await UserIbkrAccount.updateOrCreate(
      { userId: user.id },
      {
        accountNumber: payload.accountNumber || null,
        connectionType: 'oauth',
        flexToken: payload.flexToken,
        flexQueryId: payload.flexQueryId,
        status: 'connected',
      }
    )

    return response.ok({
      success: true,
      message: 'IBKR Flex Query credentials saved successfully.',
      data: ibkrAccount,
    })
  }
}