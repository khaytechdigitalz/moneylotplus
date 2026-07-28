import type { HttpContext } from '@adonisjs/core/http'
import crypto from 'node:crypto'
import env from '#start/env'
import { SumsubService } from '#services/sumsub_service'

export default class SumsubWebhookController {  /**
   * Handles incoming webhooks from Sumsub
   */
  async handleWebhook({ request, response }: HttpContext) {
    const secretKey = env.get('SUMSUB_SECRET_KEY')
    const signature = request.header('x-payload-digest')
    const algorithm = request.header('x-payload-digest-alg') || 'HMAC_SHA256'

    // Retrieve raw request body for HMAC check
    const rawBody = request.raw() || JSON.stringify(request.body())

    // 1. Validate HMAC Signature
    if (signature) {
      const computedSignature = crypto
        .createHmac(algorithm.toLowerCase().replace('-', ''), secretKey)
        .update(rawBody)
        .digest('hex')

      if (computedSignature !== signature) {
        return response.unauthorized({ error: 'Invalid webhook signature' })
      }
    }

    // 2. Process payload asynchronously in service
    const payload = request.body()
    await SumsubService.handleWebhook(payload)

    // 3. Always respond to Sumsub with 200 OK fast
    return response.ok({ received: true })
  }
}