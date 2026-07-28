/* eslint-disable prettier/prettier */
/// <reference path="../manifest.d.ts" />

import type { ExtractBody, ExtractErrorResponse, ExtractQuery, ExtractQueryForGet, ExtractResponse } from '@tuyau/core/types'
import type { InferInput, SimpleError } from '@vinejs/vine/types'

export type ParamValue = string | number | bigint | boolean

export interface Registry {
  'sumsub_webhook.handle_webhook': {
    methods: ["POST"]
    pattern: '/api/webhooks/sumsub'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/sumsub_webhook_controller').default['handleWebhook']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/sumsub_webhook_controller').default['handleWebhook']>>>
    }
  }
  'auth.new_account.signup': {
    methods: ["POST"]
    pattern: '/api/v1/auth/signup'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/user').signupValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/user').signupValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/new_account_controller').default['signup']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/new_account_controller').default['signup']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'auth.new_account.housenumber': {
    methods: ["POST"]
    pattern: '/api/v1/auth/validate-housenumber'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/new_account_controller').default['housenumber']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/new_account_controller').default['housenumber']>>>
    }
  }
  'auth.new_account.firmreference': {
    methods: ["POST"]
    pattern: '/api/v1/auth/validate-firmreference'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/new_account_controller').default['firmreference']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/new_account_controller').default['firmreference']>>>
    }
  }
  'auth.access_tokens.store': {
    methods: ["POST"]
    pattern: '/api/v1/auth/login'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/user').loginValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/user').loginValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/access_tokens_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/access_tokens_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'auth.access_tokens.verify_two_factor': {
    methods: ["POST"]
    pattern: '/api/v1/auth/login/verify-2fa'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/access_tokens_controller').default['verifyTwoFactor']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/access_tokens_controller').default['verifyTwoFactor']>>>
    }
  }
  'auth.forgot_passwords.send_otp': {
    methods: ["POST"]
    pattern: '/api/v1/auth/forgot-password/send-otp'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/forgot_passwords_controller').default['sendOtp']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/forgot_passwords_controller').default['sendOtp']>>>
    }
  }
  'auth.forgot_passwords.resend_otp': {
    methods: ["POST"]
    pattern: '/api/v1/auth/forgot-password/resend-otp'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/forgot_passwords_controller').default['resendOtp']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/forgot_passwords_controller').default['resendOtp']>>>
    }
  }
  'auth.forgot_passwords.verify_otp': {
    methods: ["POST"]
    pattern: '/api/v1/auth/forgot-password/verify-otp'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/forgot_passwords_controller').default['verifyOtp']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/forgot_passwords_controller').default['verifyOtp']>>>
    }
  }
  'auth.forgot_passwords.reset_password': {
    methods: ["POST"]
    pattern: '/api/v1/auth/forgot-password/reset'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/forgot_passwords_controller').default['resetPassword']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/forgot_passwords_controller').default['resetPassword']>>>
    }
  }
  'auth.verify_email': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/auth/verify-email/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/verify_emails_controller').default['verify']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/verify_emails_controller').default['verify']>>>
    }
  }
  'mfa.setup': {
    methods: ["POST"]
    pattern: '/api/v1/account/mfa/setup'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/mfas_controller').default['setup']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/mfas_controller').default['setup']>>>
    }
  }
  'mfa.verify_and_enable': {
    methods: ["POST"]
    pattern: '/api/v1/account/mfa/verify'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/mfas_controller').default['verifyAndEnable']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/mfas_controller').default['verifyAndEnable']>>>
    }
  }
  'access_tokens.destroy': {
    methods: ["POST"]
    pattern: '/api/v1/account/logout'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/access_tokens_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/access_tokens_controller').default['destroy']>>>
    }
  }
  'compliance.get_sum_sub_token': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/account/compliance/sumsub_token'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/compliance_controller').default['getSumSubToken']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/compliance_controller').default['getSumSubToken']>>>
    }
  }
  'compliance.get_ka_question': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/account/compliance/knowledge_assessment'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/compliance_controller').default['getKAQuestion']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/compliance_controller').default['getKAQuestion']>>>
    }
  }
  'compliance.personal.step_one': {
    methods: ["POST"]
    pattern: '/api/v1/account/compliance/personal/step_one'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/compliance_validator').complianceStepOneValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/compliance_validator').complianceStepOneValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/personal_compliance_controller').default['submitStepOne']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/personal_compliance_controller').default['submitStepOne']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'personal_compliance.submit_step_two': {
    methods: ["POST"]
    pattern: '/api/v1/account/compliance/personal/step_two'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/compliance_validator').complianceStepTwoIndividualValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/compliance_validator').complianceStepTwoIndividualValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/personal_compliance_controller').default['submitStepTwo']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/personal_compliance_controller').default['submitStepTwo']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'personal_compliance.show_step_three': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/account/compliance/personal/step_three'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/personal_compliance_controller').default['showStepThree']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/personal_compliance_controller').default['showStepThree']>>>
    }
  }
  'dashboard.dashboard': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/account/dashboard'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/dashboards_controller').default['dashboard']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/dashboards_controller').default['dashboard']>>>
    }
  }
}
