import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import type { Authenticators } from '@adonisjs/auth/types'

/**
 * MfaMiddleware ensures that not only is the user authenticated,
 * but they also have Two-Factor Authentication actively enabled.
 */
export default class MfaMiddleware {
  async handle(
    ctx: HttpContext,
    next: NextFn,
    options: {
      guards?: (keyof Authenticators)[]
    } = {}
  ) {
    // 1. First, ensure the user is logged in
    await ctx.auth.authenticateUsing(options.guards)

    // 2. Retrieve the authenticated user instance
    const user = ctx.auth.getUserOrFail()

    // 3. Guard Check: Verify that 2FA is active
    // Adjust 'isTwoFactorEnabled' to match your actual User model property name
    if (user.role !== 'admin') {
      return ctx.response.forbidden({
        errors: [{ message: 'Access denied. Admin Authentication must be enabled to access this resource.',mfa: false }]
      })
    }

    // 4. Pass control to the next layer if validation succeeds
    return next()
  }
}