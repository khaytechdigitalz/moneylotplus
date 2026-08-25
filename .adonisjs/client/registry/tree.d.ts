/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
  sumsubWebhook: {
    handleWebhook: typeof routes['sumsub_webhook.handle_webhook']
  }
  auth: {
    newAccount: {
      signup: typeof routes['auth.new_account.signup']
      resendEmailOtp: typeof routes['auth.new_account.resend_email_otp']
      changeEmail: typeof routes['auth.new_account.change_email']
      housenumber: typeof routes['auth.new_account.housenumber']
      firmreference: typeof routes['auth.new_account.firmreference']
      companyidverify: typeof routes['auth.new_account.companyidverify']
    }
    accessTokens: {
      store: typeof routes['auth.access_tokens.store']
      verifyTwoFactor: typeof routes['auth.access_tokens.verify_two_factor']
    }
    forgotPasswords: {
      sendOtp: typeof routes['auth.forgot_passwords.send_otp']
      resendOtp: typeof routes['auth.forgot_passwords.resend_otp']
      verifyOtp: typeof routes['auth.forgot_passwords.verify_otp']
      resetPassword: typeof routes['auth.forgot_passwords.reset_password']
    }
    verifyEmail: typeof routes['auth.verify_email']
  }
  mfa: {
    setup: typeof routes['mfa.setup']
    verifyAndEnable: typeof routes['mfa.verify_and_enable']
  }
  accessTokens: {
    destroy: typeof routes['access_tokens.destroy']
  }
  compliance: {
    getSumSubToken: typeof routes['compliance.get_sum_sub_token']
    getStepThreeStatus: typeof routes['compliance.get_step_three_status']
    getKaQuestion: typeof routes['compliance.get_ka_question']
  }
  personalCompliance: {
    submitStepOne: typeof routes['personal_compliance.submit_step_one']
    submitStepTwo: typeof routes['personal_compliance.submit_step_two']
    submitStepFour: typeof routes['personal_compliance.submit_step_four']
  }
  regulatedBusinessCompliance: {
    submitStepOne: typeof routes['regulated_business_compliance.submit_step_one']
    submitStepTwo: typeof routes['regulated_business_compliance.submit_step_two']
    submitStepFour: typeof routes['regulated_business_compliance.submit_step_four']
  }
  dashboard: {
    dashboard: typeof routes['dashboard.dashboard']
  }
  ibkrConnect: {
    initiateAuth: typeof routes['ibkr_connect.initiate_auth']
    handleCallback: typeof routes['ibkr_connect.handle_callback']
    linkFlexService: typeof routes['ibkr_connect.link_flex_service']
  }
}
