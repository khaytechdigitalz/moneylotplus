/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'
import { controllers } from '#generated/controllers'
const VerifyEmailController = () => import('#controllers/verify_emails_controller')
const MfaController = () => import('#controllers/mfas_controller')
const DashboardController = () => import('#controllers/dashboards_controller')
const PersonalComplianceController = () => import('#controllers/personal_compliance_controller')
const RegulatedBusinessComplianceController = () => import('#controllers/regulatedbusiness_compliance_controller')
const IbkrConnectController = () => import('#controllers/ibkr_connect_controller')
const ComplianceController = () => import('#controllers/compliance_controller')
const SumsubWebhookController = () => import('#controllers/sumsub_webhook_controller')

router.get('/', () => {
  return { hello: 'world' }
})


router
  .group(() => {
    router.post('/webhooks/sumsub', [SumsubWebhookController, 'handleWebhook'])
  })
  .prefix('/api')

router
  .group(() => {

    router
      .group(() => {
        router.post('signup', [controllers.NewAccount, 'signup'])

        // VALIDATE BUSINESS NUMMBER
        router.post('validate-housenumber', [controllers.NewAccount, 'housenumber'])
        router.post('validate-firmreference', [controllers.NewAccount, 'firmreference'])

        router.post('login', [controllers.AccessTokens, 'store'])
        router.post('login/verify-2fa', [controllers.AccessTokens, 'verifyTwoFactor'])

        //FORGOT PASSWORD
        router.post('forgot-password/send-otp', [controllers.ForgotPasswords, 'sendOtp'])
        router.post('forgot-password/resend-otp', [controllers.ForgotPasswords, 'resendOtp'])
        router.post('forgot-password/verify-otp', [controllers.ForgotPasswords, 'verifyOtp'])
        router.post('forgot-password/reset', [controllers.ForgotPasswords, 'resetPassword'])

        router.get('verify-email/:id', [VerifyEmailController, 'verify'])
          .as('verify_email')
          .use(({ request, response }, next) => {
            // Enforce that the incoming URL signature is cryptographically valid
            if (!request.hasValidSignature()) {
              return response.badRequest({ message: 'The verification link is invalid or has expired.' })
            }
            return next()
          })

      })
      .prefix('auth')
      .as('auth')

    router
      .group(() => {

        // ==========================================
        // 1. Basic Auth Routes (No 2FA Enforced Yet)
        // ==========================================
        router.group(() => {
          router.post('mfa/setup', [MfaController, 'setup'])
          router.post('mfa/verify', [MfaController, 'verifyAndEnable'])

          router.post('logout', [controllers.AccessTokens, 'destroy'])
        })

        // ==========================================
        // 2. High-Security Routes (2FA Strictly Required)
        // ==========================================
        router.group(() => {
          //Compliance Dependencies
          router.get('compliance/sumsub_token', [ComplianceController, 'getSumSubToken'])
          router.get('compliance/sumsub_status', [ComplianceController, 'getStepThreeStatus'])
          router.get('compliance/knowledge_assessment', [ComplianceController, 'getKAQuestion'])

          // Personal Compliance Steps
          router.post('compliance/personal/step_one', [PersonalComplianceController, 'submitStepOne']).use(middleware.individual()) 
          router.post('compliance/personal/step_two', [PersonalComplianceController, 'submitStepTwo']).use(middleware.individual()) 
          router.post('compliance/personal/step_four', [PersonalComplianceController, 'submitStepFour']).use(middleware.individual()) 

          // Regulated Business Compliance Steps
          router.post('compliance/regulated_business/step_one', [RegulatedBusinessComplianceController, 'submitStepOne'])
            .use([middleware.business(), middleware.regulatedbusiness()])

          router.post('compliance/regulated_business/step_two', [RegulatedBusinessComplianceController, 'submitStepTwo'])
            .use([middleware.business(), middleware.regulatedbusiness()])

          router.post('compliance/regulated_business/step_four', [RegulatedBusinessComplianceController, 'submitStepFour'])
            .use([middleware.business(), middleware.regulatedbusiness()])

          // Dashboard
          router.get('dashboard', [DashboardController, 'dashboard'])

          //IBKR Functions
          // OAuth Routes
          router.get('ibkr/connect', [IbkrConnectController, 'initiateAuth'])
          router.get('ibkr/callback', [IbkrConnectController, 'handleCallback'])
          // Flex Web Service Manual Linking Route
          router.post('ibkr/link-flex', [IbkrConnectController, 'linkFlexService'])


        }).use(middleware.mfa()) // Enforces 2FA only on these specific endpoints

      })
      .prefix('account')
      .use(middleware.auth()) // Every route inside /account still requires being logged in
  })
  .prefix('/api/v1')