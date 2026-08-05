import UserTransformer from '#transformers/user_transformer'
import type { HttpContext } from '@adonisjs/core/http'

export default class DashboardController {
  public async dashboard({ auth, serialize, response }: HttpContext) {
    const user = auth.user!

    let profile: any = null
    if (user.accountType === 'individual') {
      profile = await user.related('individualProfile').query().first()
    } else if (user.accountType === 'business') {
      profile = await user.related('businessProfile').query().first()
    }
    if (!profile) {
      return response.badRequest({ message: 'User profile not found.' })
    }

    // 1. Transform the authenticated user instance
    const transformedUser = await serialize(UserTransformer.transform(user))

    // 2. Return payload with complianceStep included
    return response.ok({
      ...transformedUser,
      profile: profile ?? null,
      complianceStep: profile.complianceStep ?? null,
    })
  }
}
