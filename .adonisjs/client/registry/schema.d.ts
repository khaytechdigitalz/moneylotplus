/* eslint-disable prettier/prettier */
/// <reference path="../manifest.d.ts" />

import type { ExtractBody, ExtractErrorResponse, ExtractQuery, ExtractQueryForGet, ExtractResponse } from '@tuyau/core/types'
import type { InferInput, SimpleError } from '@vinejs/vine/types'

export type ParamValue = string | number | bigint | boolean

export interface Registry {
  'admin_auth.login': {
    methods: ["POST"]
    pattern: '/api/v1/admin/auth/login'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/admin_auth_controller').default['login']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/admin_auth_controller').default['login']>>>
    }
  }
  'admin_auth.verify_two_factor': {
    methods: ["POST"]
    pattern: '/api/v1/admin/auth/login/verify-2fa'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/admin_auth_controller').default['verifyTwoFactor']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/admin_auth_controller').default['verifyTwoFactor']>>>
    }
  }
  'admin_auth.send_forgot_otp': {
    methods: ["POST"]
    pattern: '/api/v1/admin/auth/forgot-password/send-otp'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/admin_auth_controller').default['sendForgotOtp']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/admin_auth_controller').default['sendForgotOtp']>>>
    }
  }
  'admin_auth.resend_forgot_otp': {
    methods: ["POST"]
    pattern: '/api/v1/admin/auth/forgot-password/resend-otp'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/admin_auth_controller').default['resendForgotOtp']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/admin_auth_controller').default['resendForgotOtp']>>>
    }
  }
  'admin_auth.verify_forgot_otp': {
    methods: ["POST"]
    pattern: '/api/v1/admin/auth/forgot-password/verify-otp'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/admin_auth_controller').default['verifyForgotOtp']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/admin_auth_controller').default['verifyForgotOtp']>>>
    }
  }
  'admin_auth.reset_password': {
    methods: ["POST"]
    pattern: '/api/v1/admin/auth/forgot-password/reset'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/admin_auth_controller').default['resetPassword']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/admin_auth_controller').default['resetPassword']>>>
    }
  }
  'admin_invitation.get_invite_details': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/admin/invite/details/:token'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { token: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/admin_invitation_controller').default['getInviteDetails']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/admin_invitation_controller').default['getInviteDetails']>>>
    }
  }
  'admin_invitation.accept_invite': {
    methods: ["POST"]
    pattern: '/api/v1/admin/invite/accept-invite'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/admin_onboarding_validator').acceptInviteValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/admin_onboarding_validator').acceptInviteValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/admin_invitation_controller').default['acceptInvite']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/admin_invitation_controller').default['acceptInvite']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin_invitation.verify_otp': {
    methods: ["POST"]
    pattern: '/api/v1/admin/invite/verify-otp'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/admin_onboarding_validator').verifyOtpValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/admin_onboarding_validator').verifyOtpValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/admin_invitation_controller').default['verifyOtp']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/admin_invitation_controller').default['verifyOtp']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin_auth.me': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/admin/me'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/admin_auth_controller').default['me']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/admin_auth_controller').default['me']>>>
    }
  }
  'admin_auth.logout': {
    methods: ["POST"]
    pattern: '/api/v1/admin/logout'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/admin_auth_controller').default['logout']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/admin_auth_controller').default['logout']>>>
    }
  }
  'admin_compliance.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/admin/compliance/dashboard'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/admin_compliance_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/admin_compliance_controller').default['index']>>>
    }
  }
  'admin_compliance.show': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/admin/compliance/account-info/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/admin_compliance_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/admin_compliance_controller').default['show']>>>
    }
  }
  'admin_compliance.get_eligibility_and_services': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/admin/compliance/eligibility/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/admin_compliance_controller').default['getEligibilityAndServices']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/admin_compliance_controller').default['getEligibilityAndServices']>>>
    }
  }
  'admin_compliance.get_identity_verification': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/admin/compliance/identity/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/admin_compliance_controller').default['getIdentityVerification']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/admin_compliance_controller').default['getIdentityVerification']>>>
    }
  }
  'admin_compliance.get_settlement_account': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/admin/compliance/settlement/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/admin_compliance_controller').default['getSettlementAccount']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/admin_compliance_controller').default['getSettlementAccount']>>>
    }
  }
  'admin_compliance.approve': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/admin/compliance/approve/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/admin_compliance_controller').default['approve']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/admin_compliance_controller').default['approve']>>>
    }
  }
  'admin_compliance.reject': {
    methods: ["POST"]
    pattern: '/api/v1/admin/compliance/reject/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/admin_compliance_controller').default['reject']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/admin_compliance_controller').default['reject']>>>
    }
  }
  'admin_compliance.request_document': {
    methods: ["POST"]
    pattern: '/api/v1/admin/compliance/request-document/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/admin_compliance_controller').default['requestDocument']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/admin_compliance_controller').default['requestDocument']>>>
    }
  }
  'audit_logs.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/admin/audit-logs'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/audit_logs_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/audit_logs_controller').default['index']>>>
    }
  }
  'audit_logs.show': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/admin/audit-logs/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/audit_logs_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/audit_logs_controller').default['show']>>>
    }
  }
  'team_management.list_teams': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/admin/team'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/team_management_controller').default['listTeams']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/team_management_controller').default['listTeams']>>>
    }
  }
  'team_management.list_members': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/admin/team/members'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/team_management_controller').default['listMembers']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/team_management_controller').default['listMembers']>>>
    }
  }
  'team_management.create_team': {
    methods: ["POST"]
    pattern: '/api/v1/admin/team/create'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/team_management_validator').createTeamValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/team_management_validator').createTeamValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/team_management_controller').default['createTeam']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/team_management_controller').default['createTeam']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'team_management.show_team': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/admin/team/details/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/team_management_controller').default['showTeam']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/team_management_controller').default['showTeam']>>>
    }
  }
  'team_management.update_team': {
    methods: ["POST"]
    pattern: '/api/v1/admin/team/update/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/team_management_validator').updateTeamValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/team_management_validator').updateTeamValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/team_management_controller').default['updateTeam']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/team_management_controller').default['updateTeam']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'team_management.invite': {
    methods: ["POST"]
    pattern: '/api/v1/admin/team/invite'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/admin_management_validator').inviteAdminValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/admin_management_validator').inviteAdminValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/team_management_controller').default['invite']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/team_management_controller').default['invite']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'role_management.list_permissions': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/admin/roles/permissions'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
  'role_management.list_roles': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/admin/roles/list'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
  'role_management.create_role': {
    methods: ["POST"]
    pattern: '/api/v1/admin/roles/create'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
  'role_management.show_role': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/admin/roles/details/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
  'role_management.update_role': {
    methods: ["POST"]
    pattern: '/api/v1/admin/roles/update/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
  'role_management.toggle_status': {
    methods: ["POST"]
    pattern: '/api/v1/admin/roles/toggle-status/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
  'admin_profile.show': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/admin/profile'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/admin_profile_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/admin_profile_controller').default['show']>>>
    }
  }
  'admin_profile.update_profile': {
    methods: ["PUT"]
    pattern: '/api/v1/admin/profile'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/admin_profile_validator').updateProfileValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/admin_profile_validator').updateProfileValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/admin_profile_controller').default['updateProfile']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/admin_profile_controller').default['updateProfile']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin_profile.update_password': {
    methods: ["PUT"]
    pattern: '/api/v1/admin/profile/password'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/admin_profile_validator').updatePasswordValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/admin_profile_validator').updatePasswordValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/admin_profile_controller').default['updatePassword']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/admin_profile_controller').default['updatePassword']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
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
  'auth.new_account.resend_email_otp': {
    methods: ["POST"]
    pattern: '/api/v1/auth/resend/register-otp'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/user').resendEmailOtpValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/user').resendEmailOtpValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/new_account_controller').default['resendEmailOtp']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/new_account_controller').default['resendEmailOtp']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'auth.new_account.change_email': {
    methods: ["POST"]
    pattern: '/api/v1/auth/change/register-email'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/user').changeEmailValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/user').changeEmailValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/new_account_controller').default['changeEmail']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/new_account_controller').default['changeEmail']>>> | { status: 422; response: { errors: SimpleError[] } }
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
  'compliance.get_step_three_status': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/account/compliance/sumsub_status'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/compliance_controller').default['getStepThreeStatus']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/compliance_controller').default['getStepThreeStatus']>>>
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
  'personal_compliance.submit_step_one': {
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
  'personal_compliance.submit_step_four': {
    methods: ["POST"]
    pattern: '/api/v1/account/compliance/personal/step_four'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/compliance_validator').complianceStepFourValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/compliance_validator').complianceStepFourValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/personal_compliance_controller').default['submitStepFour']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/personal_compliance_controller').default['submitStepFour']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'personal_compliance.submit_step_acknowledgement': {
    methods: ["POST"]
    pattern: '/api/v1/account/compliance/personal/acknowledgement'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/personal_compliance_controller').default['submitStepAcknowledgement']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/personal_compliance_controller').default['submitStepAcknowledgement']>>>
    }
  }
  'regulated_business_compliance.submit_step_one': {
    methods: ["POST"]
    pattern: '/api/v1/account/compliance/regulated_business/step_one'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/compliance_validator').complianceBusinessStepOneValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/compliance_validator').complianceBusinessStepOneValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/regulatedbusiness_compliance_controller').default['submitStepOne']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/regulatedbusiness_compliance_controller').default['submitStepOne']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'regulated_business_compliance.submit_step_two': {
    methods: ["POST"]
    pattern: '/api/v1/account/compliance/regulated_business/step_two'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/compliance_validator').complianceStepTwoBusinessValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/compliance_validator').complianceStepTwoBusinessValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/regulatedbusiness_compliance_controller').default['submitStepTwo']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/regulatedbusiness_compliance_controller').default['submitStepTwo']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'regulated_business_compliance.submit_step_four': {
    methods: ["POST"]
    pattern: '/api/v1/account/compliance/regulated_business/step_four'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/compliance_validator').complianceStepFourValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/compliance_validator').complianceStepFourValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/regulatedbusiness_compliance_controller').default['submitStepFour']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/regulatedbusiness_compliance_controller').default['submitStepFour']>>> | { status: 422; response: { errors: SimpleError[] } }
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
  'ibkr_connect.initiate_auth': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/account/ibkr/connect'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/ibkr_connect_controller').default['initiateAuth']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/ibkr_connect_controller').default['initiateAuth']>>>
    }
  }
  'ibkr_connect.handle_callback': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/account/ibkr/callback'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/ibkr_connect_controller').default['handleCallback']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/ibkr_connect_controller').default['handleCallback']>>>
    }
  }
  'ibkr_connect.link_flex_service': {
    methods: ["POST"]
    pattern: '/api/v1/account/ibkr/link-flex'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/ibkr_connect_controller').default['linkFlexService']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/ibkr_connect_controller').default['linkFlexService']>>>
    }
  }
}
