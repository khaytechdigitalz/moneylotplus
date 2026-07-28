/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
  sumsubWebhook: {
    handleWebhook: typeof routes['sumsub_webhook.handle_webhook']
  }
  auth: {
    newAccount: {
      signup: typeof routes['auth.new_account.signup']
      housenumber: typeof routes['auth.new_account.housenumber']
      firmreference: typeof routes['auth.new_account.firmreference']
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
    getKaQuestion: typeof routes['compliance.get_ka_question']
    personal: {
      stepOne: typeof routes['compliance.personal.step_one']
    }
  }
  personalCompliance: {
    submitStepTwo: typeof routes['personal_compliance.submit_step_two']
    showStepThree: typeof routes['personal_compliance.show_step_three']
  }
  dashboard: {
    dashboard: typeof routes['dashboard.dashboard']
  }
}
