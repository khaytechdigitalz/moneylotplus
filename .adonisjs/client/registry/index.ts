/* eslint-disable prettier/prettier */
import type { AdonisEndpoint } from '@tuyau/core/types'
import type { Registry } from './schema.d.ts'
import type { ApiDefinition } from './tree.d.ts'

const placeholder: any = {}

const routes = {
  'sumsub_webhook.handle_webhook': {
    methods: ["POST"],
    pattern: '/api/webhooks/sumsub',
    tokens: [{"old":"/api/webhooks/sumsub","type":0,"val":"api","end":""},{"old":"/api/webhooks/sumsub","type":0,"val":"webhooks","end":""},{"old":"/api/webhooks/sumsub","type":0,"val":"sumsub","end":""}],
    types: placeholder as Registry['sumsub_webhook.handle_webhook']['types'],
  },
  'auth.new_account.signup': {
    methods: ["POST"],
    pattern: '/api/v1/auth/signup',
    tokens: [{"old":"/api/v1/auth/signup","type":0,"val":"api","end":""},{"old":"/api/v1/auth/signup","type":0,"val":"v1","end":""},{"old":"/api/v1/auth/signup","type":0,"val":"auth","end":""},{"old":"/api/v1/auth/signup","type":0,"val":"signup","end":""}],
    types: placeholder as Registry['auth.new_account.signup']['types'],
  },
  'auth.new_account.housenumber': {
    methods: ["POST"],
    pattern: '/api/v1/auth/validate-housenumber',
    tokens: [{"old":"/api/v1/auth/validate-housenumber","type":0,"val":"api","end":""},{"old":"/api/v1/auth/validate-housenumber","type":0,"val":"v1","end":""},{"old":"/api/v1/auth/validate-housenumber","type":0,"val":"auth","end":""},{"old":"/api/v1/auth/validate-housenumber","type":0,"val":"validate-housenumber","end":""}],
    types: placeholder as Registry['auth.new_account.housenumber']['types'],
  },
  'auth.new_account.firmreference': {
    methods: ["POST"],
    pattern: '/api/v1/auth/validate-firmreference',
    tokens: [{"old":"/api/v1/auth/validate-firmreference","type":0,"val":"api","end":""},{"old":"/api/v1/auth/validate-firmreference","type":0,"val":"v1","end":""},{"old":"/api/v1/auth/validate-firmreference","type":0,"val":"auth","end":""},{"old":"/api/v1/auth/validate-firmreference","type":0,"val":"validate-firmreference","end":""}],
    types: placeholder as Registry['auth.new_account.firmreference']['types'],
  },
  'auth.access_tokens.store': {
    methods: ["POST"],
    pattern: '/api/v1/auth/login',
    tokens: [{"old":"/api/v1/auth/login","type":0,"val":"api","end":""},{"old":"/api/v1/auth/login","type":0,"val":"v1","end":""},{"old":"/api/v1/auth/login","type":0,"val":"auth","end":""},{"old":"/api/v1/auth/login","type":0,"val":"login","end":""}],
    types: placeholder as Registry['auth.access_tokens.store']['types'],
  },
  'auth.access_tokens.verify_two_factor': {
    methods: ["POST"],
    pattern: '/api/v1/auth/login/verify-2fa',
    tokens: [{"old":"/api/v1/auth/login/verify-2fa","type":0,"val":"api","end":""},{"old":"/api/v1/auth/login/verify-2fa","type":0,"val":"v1","end":""},{"old":"/api/v1/auth/login/verify-2fa","type":0,"val":"auth","end":""},{"old":"/api/v1/auth/login/verify-2fa","type":0,"val":"login","end":""},{"old":"/api/v1/auth/login/verify-2fa","type":0,"val":"verify-2fa","end":""}],
    types: placeholder as Registry['auth.access_tokens.verify_two_factor']['types'],
  },
  'auth.forgot_passwords.send_otp': {
    methods: ["POST"],
    pattern: '/api/v1/auth/forgot-password/send-otp',
    tokens: [{"old":"/api/v1/auth/forgot-password/send-otp","type":0,"val":"api","end":""},{"old":"/api/v1/auth/forgot-password/send-otp","type":0,"val":"v1","end":""},{"old":"/api/v1/auth/forgot-password/send-otp","type":0,"val":"auth","end":""},{"old":"/api/v1/auth/forgot-password/send-otp","type":0,"val":"forgot-password","end":""},{"old":"/api/v1/auth/forgot-password/send-otp","type":0,"val":"send-otp","end":""}],
    types: placeholder as Registry['auth.forgot_passwords.send_otp']['types'],
  },
  'auth.forgot_passwords.resend_otp': {
    methods: ["POST"],
    pattern: '/api/v1/auth/forgot-password/resend-otp',
    tokens: [{"old":"/api/v1/auth/forgot-password/resend-otp","type":0,"val":"api","end":""},{"old":"/api/v1/auth/forgot-password/resend-otp","type":0,"val":"v1","end":""},{"old":"/api/v1/auth/forgot-password/resend-otp","type":0,"val":"auth","end":""},{"old":"/api/v1/auth/forgot-password/resend-otp","type":0,"val":"forgot-password","end":""},{"old":"/api/v1/auth/forgot-password/resend-otp","type":0,"val":"resend-otp","end":""}],
    types: placeholder as Registry['auth.forgot_passwords.resend_otp']['types'],
  },
  'auth.forgot_passwords.verify_otp': {
    methods: ["POST"],
    pattern: '/api/v1/auth/forgot-password/verify-otp',
    tokens: [{"old":"/api/v1/auth/forgot-password/verify-otp","type":0,"val":"api","end":""},{"old":"/api/v1/auth/forgot-password/verify-otp","type":0,"val":"v1","end":""},{"old":"/api/v1/auth/forgot-password/verify-otp","type":0,"val":"auth","end":""},{"old":"/api/v1/auth/forgot-password/verify-otp","type":0,"val":"forgot-password","end":""},{"old":"/api/v1/auth/forgot-password/verify-otp","type":0,"val":"verify-otp","end":""}],
    types: placeholder as Registry['auth.forgot_passwords.verify_otp']['types'],
  },
  'auth.forgot_passwords.reset_password': {
    methods: ["POST"],
    pattern: '/api/v1/auth/forgot-password/reset',
    tokens: [{"old":"/api/v1/auth/forgot-password/reset","type":0,"val":"api","end":""},{"old":"/api/v1/auth/forgot-password/reset","type":0,"val":"v1","end":""},{"old":"/api/v1/auth/forgot-password/reset","type":0,"val":"auth","end":""},{"old":"/api/v1/auth/forgot-password/reset","type":0,"val":"forgot-password","end":""},{"old":"/api/v1/auth/forgot-password/reset","type":0,"val":"reset","end":""}],
    types: placeholder as Registry['auth.forgot_passwords.reset_password']['types'],
  },
  'auth.verify_email': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/auth/verify-email/:id',
    tokens: [{"old":"/api/v1/auth/verify-email/:id","type":0,"val":"api","end":""},{"old":"/api/v1/auth/verify-email/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/auth/verify-email/:id","type":0,"val":"auth","end":""},{"old":"/api/v1/auth/verify-email/:id","type":0,"val":"verify-email","end":""},{"old":"/api/v1/auth/verify-email/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['auth.verify_email']['types'],
  },
  'mfa.setup': {
    methods: ["POST"],
    pattern: '/api/v1/account/mfa/setup',
    tokens: [{"old":"/api/v1/account/mfa/setup","type":0,"val":"api","end":""},{"old":"/api/v1/account/mfa/setup","type":0,"val":"v1","end":""},{"old":"/api/v1/account/mfa/setup","type":0,"val":"account","end":""},{"old":"/api/v1/account/mfa/setup","type":0,"val":"mfa","end":""},{"old":"/api/v1/account/mfa/setup","type":0,"val":"setup","end":""}],
    types: placeholder as Registry['mfa.setup']['types'],
  },
  'mfa.verify_and_enable': {
    methods: ["POST"],
    pattern: '/api/v1/account/mfa/verify',
    tokens: [{"old":"/api/v1/account/mfa/verify","type":0,"val":"api","end":""},{"old":"/api/v1/account/mfa/verify","type":0,"val":"v1","end":""},{"old":"/api/v1/account/mfa/verify","type":0,"val":"account","end":""},{"old":"/api/v1/account/mfa/verify","type":0,"val":"mfa","end":""},{"old":"/api/v1/account/mfa/verify","type":0,"val":"verify","end":""}],
    types: placeholder as Registry['mfa.verify_and_enable']['types'],
  },
  'access_tokens.destroy': {
    methods: ["POST"],
    pattern: '/api/v1/account/logout',
    tokens: [{"old":"/api/v1/account/logout","type":0,"val":"api","end":""},{"old":"/api/v1/account/logout","type":0,"val":"v1","end":""},{"old":"/api/v1/account/logout","type":0,"val":"account","end":""},{"old":"/api/v1/account/logout","type":0,"val":"logout","end":""}],
    types: placeholder as Registry['access_tokens.destroy']['types'],
  },
  'compliance.get_sum_sub_token': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/account/compliance/sumsub_token',
    tokens: [{"old":"/api/v1/account/compliance/sumsub_token","type":0,"val":"api","end":""},{"old":"/api/v1/account/compliance/sumsub_token","type":0,"val":"v1","end":""},{"old":"/api/v1/account/compliance/sumsub_token","type":0,"val":"account","end":""},{"old":"/api/v1/account/compliance/sumsub_token","type":0,"val":"compliance","end":""},{"old":"/api/v1/account/compliance/sumsub_token","type":0,"val":"sumsub_token","end":""}],
    types: placeholder as Registry['compliance.get_sum_sub_token']['types'],
  },
  'compliance.get_step_three_status': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/account/compliance/sumsub_status',
    tokens: [{"old":"/api/v1/account/compliance/sumsub_status","type":0,"val":"api","end":""},{"old":"/api/v1/account/compliance/sumsub_status","type":0,"val":"v1","end":""},{"old":"/api/v1/account/compliance/sumsub_status","type":0,"val":"account","end":""},{"old":"/api/v1/account/compliance/sumsub_status","type":0,"val":"compliance","end":""},{"old":"/api/v1/account/compliance/sumsub_status","type":0,"val":"sumsub_status","end":""}],
    types: placeholder as Registry['compliance.get_step_three_status']['types'],
  },
  'compliance.get_ka_question': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/account/compliance/knowledge_assessment',
    tokens: [{"old":"/api/v1/account/compliance/knowledge_assessment","type":0,"val":"api","end":""},{"old":"/api/v1/account/compliance/knowledge_assessment","type":0,"val":"v1","end":""},{"old":"/api/v1/account/compliance/knowledge_assessment","type":0,"val":"account","end":""},{"old":"/api/v1/account/compliance/knowledge_assessment","type":0,"val":"compliance","end":""},{"old":"/api/v1/account/compliance/knowledge_assessment","type":0,"val":"knowledge_assessment","end":""}],
    types: placeholder as Registry['compliance.get_ka_question']['types'],
  },
  'personal_compliance.submit_step_one': {
    methods: ["POST"],
    pattern: '/api/v1/account/compliance/personal/step_one',
    tokens: [{"old":"/api/v1/account/compliance/personal/step_one","type":0,"val":"api","end":""},{"old":"/api/v1/account/compliance/personal/step_one","type":0,"val":"v1","end":""},{"old":"/api/v1/account/compliance/personal/step_one","type":0,"val":"account","end":""},{"old":"/api/v1/account/compliance/personal/step_one","type":0,"val":"compliance","end":""},{"old":"/api/v1/account/compliance/personal/step_one","type":0,"val":"personal","end":""},{"old":"/api/v1/account/compliance/personal/step_one","type":0,"val":"step_one","end":""}],
    types: placeholder as Registry['personal_compliance.submit_step_one']['types'],
  },
  'personal_compliance.submit_step_two': {
    methods: ["POST"],
    pattern: '/api/v1/account/compliance/personal/step_two',
    tokens: [{"old":"/api/v1/account/compliance/personal/step_two","type":0,"val":"api","end":""},{"old":"/api/v1/account/compliance/personal/step_two","type":0,"val":"v1","end":""},{"old":"/api/v1/account/compliance/personal/step_two","type":0,"val":"account","end":""},{"old":"/api/v1/account/compliance/personal/step_two","type":0,"val":"compliance","end":""},{"old":"/api/v1/account/compliance/personal/step_two","type":0,"val":"personal","end":""},{"old":"/api/v1/account/compliance/personal/step_two","type":0,"val":"step_two","end":""}],
    types: placeholder as Registry['personal_compliance.submit_step_two']['types'],
  },
  'personal_compliance.submit_step_four': {
    methods: ["POST"],
    pattern: '/api/v1/account/compliance/personal/step_four',
    tokens: [{"old":"/api/v1/account/compliance/personal/step_four","type":0,"val":"api","end":""},{"old":"/api/v1/account/compliance/personal/step_four","type":0,"val":"v1","end":""},{"old":"/api/v1/account/compliance/personal/step_four","type":0,"val":"account","end":""},{"old":"/api/v1/account/compliance/personal/step_four","type":0,"val":"compliance","end":""},{"old":"/api/v1/account/compliance/personal/step_four","type":0,"val":"personal","end":""},{"old":"/api/v1/account/compliance/personal/step_four","type":0,"val":"step_four","end":""}],
    types: placeholder as Registry['personal_compliance.submit_step_four']['types'],
  },
  'regulated_business_compliance.submit_step_one': {
    methods: ["POST"],
    pattern: '/api/v1/account/compliance/regulated_business/step_one',
    tokens: [{"old":"/api/v1/account/compliance/regulated_business/step_one","type":0,"val":"api","end":""},{"old":"/api/v1/account/compliance/regulated_business/step_one","type":0,"val":"v1","end":""},{"old":"/api/v1/account/compliance/regulated_business/step_one","type":0,"val":"account","end":""},{"old":"/api/v1/account/compliance/regulated_business/step_one","type":0,"val":"compliance","end":""},{"old":"/api/v1/account/compliance/regulated_business/step_one","type":0,"val":"regulated_business","end":""},{"old":"/api/v1/account/compliance/regulated_business/step_one","type":0,"val":"step_one","end":""}],
    types: placeholder as Registry['regulated_business_compliance.submit_step_one']['types'],
  },
  'regulated_business_compliance.submit_step_two': {
    methods: ["POST"],
    pattern: '/api/v1/account/compliance/regulated_business/step_two',
    tokens: [{"old":"/api/v1/account/compliance/regulated_business/step_two","type":0,"val":"api","end":""},{"old":"/api/v1/account/compliance/regulated_business/step_two","type":0,"val":"v1","end":""},{"old":"/api/v1/account/compliance/regulated_business/step_two","type":0,"val":"account","end":""},{"old":"/api/v1/account/compliance/regulated_business/step_two","type":0,"val":"compliance","end":""},{"old":"/api/v1/account/compliance/regulated_business/step_two","type":0,"val":"regulated_business","end":""},{"old":"/api/v1/account/compliance/regulated_business/step_two","type":0,"val":"step_two","end":""}],
    types: placeholder as Registry['regulated_business_compliance.submit_step_two']['types'],
  },
  'regulated_business_compliance.submit_step_four': {
    methods: ["POST"],
    pattern: '/api/v1/account/compliance/regulated_business/step_four',
    tokens: [{"old":"/api/v1/account/compliance/regulated_business/step_four","type":0,"val":"api","end":""},{"old":"/api/v1/account/compliance/regulated_business/step_four","type":0,"val":"v1","end":""},{"old":"/api/v1/account/compliance/regulated_business/step_four","type":0,"val":"account","end":""},{"old":"/api/v1/account/compliance/regulated_business/step_four","type":0,"val":"compliance","end":""},{"old":"/api/v1/account/compliance/regulated_business/step_four","type":0,"val":"regulated_business","end":""},{"old":"/api/v1/account/compliance/regulated_business/step_four","type":0,"val":"step_four","end":""}],
    types: placeholder as Registry['regulated_business_compliance.submit_step_four']['types'],
  },
  'dashboard.dashboard': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/account/dashboard',
    tokens: [{"old":"/api/v1/account/dashboard","type":0,"val":"api","end":""},{"old":"/api/v1/account/dashboard","type":0,"val":"v1","end":""},{"old":"/api/v1/account/dashboard","type":0,"val":"account","end":""},{"old":"/api/v1/account/dashboard","type":0,"val":"dashboard","end":""}],
    types: placeholder as Registry['dashboard.dashboard']['types'],
  },
  'ibkr_connect.initiate_auth': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/account/ibkr/connect',
    tokens: [{"old":"/api/v1/account/ibkr/connect","type":0,"val":"api","end":""},{"old":"/api/v1/account/ibkr/connect","type":0,"val":"v1","end":""},{"old":"/api/v1/account/ibkr/connect","type":0,"val":"account","end":""},{"old":"/api/v1/account/ibkr/connect","type":0,"val":"ibkr","end":""},{"old":"/api/v1/account/ibkr/connect","type":0,"val":"connect","end":""}],
    types: placeholder as Registry['ibkr_connect.initiate_auth']['types'],
  },
  'ibkr_connect.handle_callback': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/account/ibkr/callback',
    tokens: [{"old":"/api/v1/account/ibkr/callback","type":0,"val":"api","end":""},{"old":"/api/v1/account/ibkr/callback","type":0,"val":"v1","end":""},{"old":"/api/v1/account/ibkr/callback","type":0,"val":"account","end":""},{"old":"/api/v1/account/ibkr/callback","type":0,"val":"ibkr","end":""},{"old":"/api/v1/account/ibkr/callback","type":0,"val":"callback","end":""}],
    types: placeholder as Registry['ibkr_connect.handle_callback']['types'],
  },
  'ibkr_connect.link_flex_service': {
    methods: ["POST"],
    pattern: '/api/v1/account/ibkr/link-flex',
    tokens: [{"old":"/api/v1/account/ibkr/link-flex","type":0,"val":"api","end":""},{"old":"/api/v1/account/ibkr/link-flex","type":0,"val":"v1","end":""},{"old":"/api/v1/account/ibkr/link-flex","type":0,"val":"account","end":""},{"old":"/api/v1/account/ibkr/link-flex","type":0,"val":"ibkr","end":""},{"old":"/api/v1/account/ibkr/link-flex","type":0,"val":"link-flex","end":""}],
    types: placeholder as Registry['ibkr_connect.link_flex_service']['types'],
  },
} as const satisfies Record<string, AdonisEndpoint>

export { routes }

export const registry = {
  routes,
  $tree: {} as ApiDefinition,
}

declare module '@tuyau/core/types' {
  export interface UserRegistry {
    routes: typeof routes
    $tree: ApiDefinition
  }
}
