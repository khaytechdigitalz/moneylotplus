/* eslint-disable prettier/prettier */
import type { AdonisEndpoint } from '@tuyau/core/types'
import type { Registry } from './schema.d.ts'
import type { ApiDefinition } from './tree.d.ts'

const placeholder: any = {}

const routes = {
  'admin_auth.login': {
    methods: ["POST"],
    pattern: '/api/v1/admin/auth/login',
    tokens: [{"old":"/api/v1/admin/auth/login","type":0,"val":"api","end":""},{"old":"/api/v1/admin/auth/login","type":0,"val":"v1","end":""},{"old":"/api/v1/admin/auth/login","type":0,"val":"admin","end":""},{"old":"/api/v1/admin/auth/login","type":0,"val":"auth","end":""},{"old":"/api/v1/admin/auth/login","type":0,"val":"login","end":""}],
    types: placeholder as Registry['admin_auth.login']['types'],
  },
  'admin_auth.verify_two_factor': {
    methods: ["POST"],
    pattern: '/api/v1/admin/auth/login/verify-2fa',
    tokens: [{"old":"/api/v1/admin/auth/login/verify-2fa","type":0,"val":"api","end":""},{"old":"/api/v1/admin/auth/login/verify-2fa","type":0,"val":"v1","end":""},{"old":"/api/v1/admin/auth/login/verify-2fa","type":0,"val":"admin","end":""},{"old":"/api/v1/admin/auth/login/verify-2fa","type":0,"val":"auth","end":""},{"old":"/api/v1/admin/auth/login/verify-2fa","type":0,"val":"login","end":""},{"old":"/api/v1/admin/auth/login/verify-2fa","type":0,"val":"verify-2fa","end":""}],
    types: placeholder as Registry['admin_auth.verify_two_factor']['types'],
  },
  'admin_auth.send_forgot_otp': {
    methods: ["POST"],
    pattern: '/api/v1/admin/auth/forgot-password/send-otp',
    tokens: [{"old":"/api/v1/admin/auth/forgot-password/send-otp","type":0,"val":"api","end":""},{"old":"/api/v1/admin/auth/forgot-password/send-otp","type":0,"val":"v1","end":""},{"old":"/api/v1/admin/auth/forgot-password/send-otp","type":0,"val":"admin","end":""},{"old":"/api/v1/admin/auth/forgot-password/send-otp","type":0,"val":"auth","end":""},{"old":"/api/v1/admin/auth/forgot-password/send-otp","type":0,"val":"forgot-password","end":""},{"old":"/api/v1/admin/auth/forgot-password/send-otp","type":0,"val":"send-otp","end":""}],
    types: placeholder as Registry['admin_auth.send_forgot_otp']['types'],
  },
  'admin_auth.resend_forgot_otp': {
    methods: ["POST"],
    pattern: '/api/v1/admin/auth/forgot-password/resend-otp',
    tokens: [{"old":"/api/v1/admin/auth/forgot-password/resend-otp","type":0,"val":"api","end":""},{"old":"/api/v1/admin/auth/forgot-password/resend-otp","type":0,"val":"v1","end":""},{"old":"/api/v1/admin/auth/forgot-password/resend-otp","type":0,"val":"admin","end":""},{"old":"/api/v1/admin/auth/forgot-password/resend-otp","type":0,"val":"auth","end":""},{"old":"/api/v1/admin/auth/forgot-password/resend-otp","type":0,"val":"forgot-password","end":""},{"old":"/api/v1/admin/auth/forgot-password/resend-otp","type":0,"val":"resend-otp","end":""}],
    types: placeholder as Registry['admin_auth.resend_forgot_otp']['types'],
  },
  'admin_auth.verify_forgot_otp': {
    methods: ["POST"],
    pattern: '/api/v1/admin/auth/forgot-password/verify-otp',
    tokens: [{"old":"/api/v1/admin/auth/forgot-password/verify-otp","type":0,"val":"api","end":""},{"old":"/api/v1/admin/auth/forgot-password/verify-otp","type":0,"val":"v1","end":""},{"old":"/api/v1/admin/auth/forgot-password/verify-otp","type":0,"val":"admin","end":""},{"old":"/api/v1/admin/auth/forgot-password/verify-otp","type":0,"val":"auth","end":""},{"old":"/api/v1/admin/auth/forgot-password/verify-otp","type":0,"val":"forgot-password","end":""},{"old":"/api/v1/admin/auth/forgot-password/verify-otp","type":0,"val":"verify-otp","end":""}],
    types: placeholder as Registry['admin_auth.verify_forgot_otp']['types'],
  },
  'admin_auth.reset_password': {
    methods: ["POST"],
    pattern: '/api/v1/admin/auth/forgot-password/reset',
    tokens: [{"old":"/api/v1/admin/auth/forgot-password/reset","type":0,"val":"api","end":""},{"old":"/api/v1/admin/auth/forgot-password/reset","type":0,"val":"v1","end":""},{"old":"/api/v1/admin/auth/forgot-password/reset","type":0,"val":"admin","end":""},{"old":"/api/v1/admin/auth/forgot-password/reset","type":0,"val":"auth","end":""},{"old":"/api/v1/admin/auth/forgot-password/reset","type":0,"val":"forgot-password","end":""},{"old":"/api/v1/admin/auth/forgot-password/reset","type":0,"val":"reset","end":""}],
    types: placeholder as Registry['admin_auth.reset_password']['types'],
  },
  'admin_invitation.get_invite_details': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/admin/invite/details/:token',
    tokens: [{"old":"/api/v1/admin/invite/details/:token","type":0,"val":"api","end":""},{"old":"/api/v1/admin/invite/details/:token","type":0,"val":"v1","end":""},{"old":"/api/v1/admin/invite/details/:token","type":0,"val":"admin","end":""},{"old":"/api/v1/admin/invite/details/:token","type":0,"val":"invite","end":""},{"old":"/api/v1/admin/invite/details/:token","type":0,"val":"details","end":""},{"old":"/api/v1/admin/invite/details/:token","type":1,"val":"token","end":""}],
    types: placeholder as Registry['admin_invitation.get_invite_details']['types'],
  },
  'admin_invitation.accept_invite': {
    methods: ["POST"],
    pattern: '/api/v1/admin/invite/accept-invite',
    tokens: [{"old":"/api/v1/admin/invite/accept-invite","type":0,"val":"api","end":""},{"old":"/api/v1/admin/invite/accept-invite","type":0,"val":"v1","end":""},{"old":"/api/v1/admin/invite/accept-invite","type":0,"val":"admin","end":""},{"old":"/api/v1/admin/invite/accept-invite","type":0,"val":"invite","end":""},{"old":"/api/v1/admin/invite/accept-invite","type":0,"val":"accept-invite","end":""}],
    types: placeholder as Registry['admin_invitation.accept_invite']['types'],
  },
  'admin_invitation.verify_otp': {
    methods: ["POST"],
    pattern: '/api/v1/admin/invite/verify-otp',
    tokens: [{"old":"/api/v1/admin/invite/verify-otp","type":0,"val":"api","end":""},{"old":"/api/v1/admin/invite/verify-otp","type":0,"val":"v1","end":""},{"old":"/api/v1/admin/invite/verify-otp","type":0,"val":"admin","end":""},{"old":"/api/v1/admin/invite/verify-otp","type":0,"val":"invite","end":""},{"old":"/api/v1/admin/invite/verify-otp","type":0,"val":"verify-otp","end":""}],
    types: placeholder as Registry['admin_invitation.verify_otp']['types'],
  },
  'admin_auth.me': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/admin/me',
    tokens: [{"old":"/api/v1/admin/me","type":0,"val":"api","end":""},{"old":"/api/v1/admin/me","type":0,"val":"v1","end":""},{"old":"/api/v1/admin/me","type":0,"val":"admin","end":""},{"old":"/api/v1/admin/me","type":0,"val":"me","end":""}],
    types: placeholder as Registry['admin_auth.me']['types'],
  },
  'admin_auth.logout': {
    methods: ["POST"],
    pattern: '/api/v1/admin/logout',
    tokens: [{"old":"/api/v1/admin/logout","type":0,"val":"api","end":""},{"old":"/api/v1/admin/logout","type":0,"val":"v1","end":""},{"old":"/api/v1/admin/logout","type":0,"val":"admin","end":""},{"old":"/api/v1/admin/logout","type":0,"val":"logout","end":""}],
    types: placeholder as Registry['admin_auth.logout']['types'],
  },
  'admin_compliance.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/admin/compliance/dashboard',
    tokens: [{"old":"/api/v1/admin/compliance/dashboard","type":0,"val":"api","end":""},{"old":"/api/v1/admin/compliance/dashboard","type":0,"val":"v1","end":""},{"old":"/api/v1/admin/compliance/dashboard","type":0,"val":"admin","end":""},{"old":"/api/v1/admin/compliance/dashboard","type":0,"val":"compliance","end":""},{"old":"/api/v1/admin/compliance/dashboard","type":0,"val":"dashboard","end":""}],
    types: placeholder as Registry['admin_compliance.index']['types'],
  },
  'admin_compliance.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/admin/compliance/account-info/:id',
    tokens: [{"old":"/api/v1/admin/compliance/account-info/:id","type":0,"val":"api","end":""},{"old":"/api/v1/admin/compliance/account-info/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/admin/compliance/account-info/:id","type":0,"val":"admin","end":""},{"old":"/api/v1/admin/compliance/account-info/:id","type":0,"val":"compliance","end":""},{"old":"/api/v1/admin/compliance/account-info/:id","type":0,"val":"account-info","end":""},{"old":"/api/v1/admin/compliance/account-info/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['admin_compliance.show']['types'],
  },
  'admin_compliance.get_eligibility_and_services': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/admin/compliance/eligibility/:id',
    tokens: [{"old":"/api/v1/admin/compliance/eligibility/:id","type":0,"val":"api","end":""},{"old":"/api/v1/admin/compliance/eligibility/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/admin/compliance/eligibility/:id","type":0,"val":"admin","end":""},{"old":"/api/v1/admin/compliance/eligibility/:id","type":0,"val":"compliance","end":""},{"old":"/api/v1/admin/compliance/eligibility/:id","type":0,"val":"eligibility","end":""},{"old":"/api/v1/admin/compliance/eligibility/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['admin_compliance.get_eligibility_and_services']['types'],
  },
  'admin_compliance.get_identity_verification': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/admin/compliance/identity/:id',
    tokens: [{"old":"/api/v1/admin/compliance/identity/:id","type":0,"val":"api","end":""},{"old":"/api/v1/admin/compliance/identity/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/admin/compliance/identity/:id","type":0,"val":"admin","end":""},{"old":"/api/v1/admin/compliance/identity/:id","type":0,"val":"compliance","end":""},{"old":"/api/v1/admin/compliance/identity/:id","type":0,"val":"identity","end":""},{"old":"/api/v1/admin/compliance/identity/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['admin_compliance.get_identity_verification']['types'],
  },
  'admin_compliance.get_settlement_account': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/admin/compliance/settlement/:id',
    tokens: [{"old":"/api/v1/admin/compliance/settlement/:id","type":0,"val":"api","end":""},{"old":"/api/v1/admin/compliance/settlement/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/admin/compliance/settlement/:id","type":0,"val":"admin","end":""},{"old":"/api/v1/admin/compliance/settlement/:id","type":0,"val":"compliance","end":""},{"old":"/api/v1/admin/compliance/settlement/:id","type":0,"val":"settlement","end":""},{"old":"/api/v1/admin/compliance/settlement/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['admin_compliance.get_settlement_account']['types'],
  },
  'admin_compliance.approve': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/admin/compliance/approve/:id',
    tokens: [{"old":"/api/v1/admin/compliance/approve/:id","type":0,"val":"api","end":""},{"old":"/api/v1/admin/compliance/approve/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/admin/compliance/approve/:id","type":0,"val":"admin","end":""},{"old":"/api/v1/admin/compliance/approve/:id","type":0,"val":"compliance","end":""},{"old":"/api/v1/admin/compliance/approve/:id","type":0,"val":"approve","end":""},{"old":"/api/v1/admin/compliance/approve/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['admin_compliance.approve']['types'],
  },
  'admin_compliance.reject': {
    methods: ["POST"],
    pattern: '/api/v1/admin/compliance/reject/:id',
    tokens: [{"old":"/api/v1/admin/compliance/reject/:id","type":0,"val":"api","end":""},{"old":"/api/v1/admin/compliance/reject/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/admin/compliance/reject/:id","type":0,"val":"admin","end":""},{"old":"/api/v1/admin/compliance/reject/:id","type":0,"val":"compliance","end":""},{"old":"/api/v1/admin/compliance/reject/:id","type":0,"val":"reject","end":""},{"old":"/api/v1/admin/compliance/reject/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['admin_compliance.reject']['types'],
  },
  'admin_compliance.request_document': {
    methods: ["POST"],
    pattern: '/api/v1/admin/compliance/request-document/:id',
    tokens: [{"old":"/api/v1/admin/compliance/request-document/:id","type":0,"val":"api","end":""},{"old":"/api/v1/admin/compliance/request-document/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/admin/compliance/request-document/:id","type":0,"val":"admin","end":""},{"old":"/api/v1/admin/compliance/request-document/:id","type":0,"val":"compliance","end":""},{"old":"/api/v1/admin/compliance/request-document/:id","type":0,"val":"request-document","end":""},{"old":"/api/v1/admin/compliance/request-document/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['admin_compliance.request_document']['types'],
  },
  'audit_logs.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/admin/audit-logs',
    tokens: [{"old":"/api/v1/admin/audit-logs","type":0,"val":"api","end":""},{"old":"/api/v1/admin/audit-logs","type":0,"val":"v1","end":""},{"old":"/api/v1/admin/audit-logs","type":0,"val":"admin","end":""},{"old":"/api/v1/admin/audit-logs","type":0,"val":"audit-logs","end":""}],
    types: placeholder as Registry['audit_logs.index']['types'],
  },
  'audit_logs.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/admin/audit-logs/:id',
    tokens: [{"old":"/api/v1/admin/audit-logs/:id","type":0,"val":"api","end":""},{"old":"/api/v1/admin/audit-logs/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/admin/audit-logs/:id","type":0,"val":"admin","end":""},{"old":"/api/v1/admin/audit-logs/:id","type":0,"val":"audit-logs","end":""},{"old":"/api/v1/admin/audit-logs/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['audit_logs.show']['types'],
  },
  'team_management.list_teams': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/admin/team',
    tokens: [{"old":"/api/v1/admin/team","type":0,"val":"api","end":""},{"old":"/api/v1/admin/team","type":0,"val":"v1","end":""},{"old":"/api/v1/admin/team","type":0,"val":"admin","end":""},{"old":"/api/v1/admin/team","type":0,"val":"team","end":""}],
    types: placeholder as Registry['team_management.list_teams']['types'],
  },
  'team_management.list_members': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/admin/team/members',
    tokens: [{"old":"/api/v1/admin/team/members","type":0,"val":"api","end":""},{"old":"/api/v1/admin/team/members","type":0,"val":"v1","end":""},{"old":"/api/v1/admin/team/members","type":0,"val":"admin","end":""},{"old":"/api/v1/admin/team/members","type":0,"val":"team","end":""},{"old":"/api/v1/admin/team/members","type":0,"val":"members","end":""}],
    types: placeholder as Registry['team_management.list_members']['types'],
  },
  'team_management.create_team': {
    methods: ["POST"],
    pattern: '/api/v1/admin/team/create',
    tokens: [{"old":"/api/v1/admin/team/create","type":0,"val":"api","end":""},{"old":"/api/v1/admin/team/create","type":0,"val":"v1","end":""},{"old":"/api/v1/admin/team/create","type":0,"val":"admin","end":""},{"old":"/api/v1/admin/team/create","type":0,"val":"team","end":""},{"old":"/api/v1/admin/team/create","type":0,"val":"create","end":""}],
    types: placeholder as Registry['team_management.create_team']['types'],
  },
  'team_management.show_team': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/admin/team/details/:id',
    tokens: [{"old":"/api/v1/admin/team/details/:id","type":0,"val":"api","end":""},{"old":"/api/v1/admin/team/details/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/admin/team/details/:id","type":0,"val":"admin","end":""},{"old":"/api/v1/admin/team/details/:id","type":0,"val":"team","end":""},{"old":"/api/v1/admin/team/details/:id","type":0,"val":"details","end":""},{"old":"/api/v1/admin/team/details/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['team_management.show_team']['types'],
  },
  'team_management.update_team': {
    methods: ["POST"],
    pattern: '/api/v1/admin/team/update/:id',
    tokens: [{"old":"/api/v1/admin/team/update/:id","type":0,"val":"api","end":""},{"old":"/api/v1/admin/team/update/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/admin/team/update/:id","type":0,"val":"admin","end":""},{"old":"/api/v1/admin/team/update/:id","type":0,"val":"team","end":""},{"old":"/api/v1/admin/team/update/:id","type":0,"val":"update","end":""},{"old":"/api/v1/admin/team/update/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['team_management.update_team']['types'],
  },
  'team_management.invite': {
    methods: ["POST"],
    pattern: '/api/v1/admin/team/invite',
    tokens: [{"old":"/api/v1/admin/team/invite","type":0,"val":"api","end":""},{"old":"/api/v1/admin/team/invite","type":0,"val":"v1","end":""},{"old":"/api/v1/admin/team/invite","type":0,"val":"admin","end":""},{"old":"/api/v1/admin/team/invite","type":0,"val":"team","end":""},{"old":"/api/v1/admin/team/invite","type":0,"val":"invite","end":""}],
    types: placeholder as Registry['team_management.invite']['types'],
  },
  'role_management.list_permissions': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/admin/roles/permissions',
    tokens: [{"old":"/api/v1/admin/roles/permissions","type":0,"val":"api","end":""},{"old":"/api/v1/admin/roles/permissions","type":0,"val":"v1","end":""},{"old":"/api/v1/admin/roles/permissions","type":0,"val":"admin","end":""},{"old":"/api/v1/admin/roles/permissions","type":0,"val":"roles","end":""},{"old":"/api/v1/admin/roles/permissions","type":0,"val":"permissions","end":""}],
    types: placeholder as Registry['role_management.list_permissions']['types'],
  },
  'role_management.list_roles': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/admin/roles/list',
    tokens: [{"old":"/api/v1/admin/roles/list","type":0,"val":"api","end":""},{"old":"/api/v1/admin/roles/list","type":0,"val":"v1","end":""},{"old":"/api/v1/admin/roles/list","type":0,"val":"admin","end":""},{"old":"/api/v1/admin/roles/list","type":0,"val":"roles","end":""},{"old":"/api/v1/admin/roles/list","type":0,"val":"list","end":""}],
    types: placeholder as Registry['role_management.list_roles']['types'],
  },
  'role_management.create_role': {
    methods: ["POST"],
    pattern: '/api/v1/admin/roles/create',
    tokens: [{"old":"/api/v1/admin/roles/create","type":0,"val":"api","end":""},{"old":"/api/v1/admin/roles/create","type":0,"val":"v1","end":""},{"old":"/api/v1/admin/roles/create","type":0,"val":"admin","end":""},{"old":"/api/v1/admin/roles/create","type":0,"val":"roles","end":""},{"old":"/api/v1/admin/roles/create","type":0,"val":"create","end":""}],
    types: placeholder as Registry['role_management.create_role']['types'],
  },
  'role_management.show_role': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/admin/roles/details/:id',
    tokens: [{"old":"/api/v1/admin/roles/details/:id","type":0,"val":"api","end":""},{"old":"/api/v1/admin/roles/details/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/admin/roles/details/:id","type":0,"val":"admin","end":""},{"old":"/api/v1/admin/roles/details/:id","type":0,"val":"roles","end":""},{"old":"/api/v1/admin/roles/details/:id","type":0,"val":"details","end":""},{"old":"/api/v1/admin/roles/details/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['role_management.show_role']['types'],
  },
  'role_management.update_role': {
    methods: ["POST"],
    pattern: '/api/v1/admin/roles/update/:id',
    tokens: [{"old":"/api/v1/admin/roles/update/:id","type":0,"val":"api","end":""},{"old":"/api/v1/admin/roles/update/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/admin/roles/update/:id","type":0,"val":"admin","end":""},{"old":"/api/v1/admin/roles/update/:id","type":0,"val":"roles","end":""},{"old":"/api/v1/admin/roles/update/:id","type":0,"val":"update","end":""},{"old":"/api/v1/admin/roles/update/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['role_management.update_role']['types'],
  },
  'role_management.toggle_status': {
    methods: ["POST"],
    pattern: '/api/v1/admin/roles/toggle-status/:id',
    tokens: [{"old":"/api/v1/admin/roles/toggle-status/:id","type":0,"val":"api","end":""},{"old":"/api/v1/admin/roles/toggle-status/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/admin/roles/toggle-status/:id","type":0,"val":"admin","end":""},{"old":"/api/v1/admin/roles/toggle-status/:id","type":0,"val":"roles","end":""},{"old":"/api/v1/admin/roles/toggle-status/:id","type":0,"val":"toggle-status","end":""},{"old":"/api/v1/admin/roles/toggle-status/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['role_management.toggle_status']['types'],
  },
  'admin_profile.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/admin/profile',
    tokens: [{"old":"/api/v1/admin/profile","type":0,"val":"api","end":""},{"old":"/api/v1/admin/profile","type":0,"val":"v1","end":""},{"old":"/api/v1/admin/profile","type":0,"val":"admin","end":""},{"old":"/api/v1/admin/profile","type":0,"val":"profile","end":""}],
    types: placeholder as Registry['admin_profile.show']['types'],
  },
  'admin_profile.update_profile': {
    methods: ["PUT"],
    pattern: '/api/v1/admin/profile',
    tokens: [{"old":"/api/v1/admin/profile","type":0,"val":"api","end":""},{"old":"/api/v1/admin/profile","type":0,"val":"v1","end":""},{"old":"/api/v1/admin/profile","type":0,"val":"admin","end":""},{"old":"/api/v1/admin/profile","type":0,"val":"profile","end":""}],
    types: placeholder as Registry['admin_profile.update_profile']['types'],
  },
  'admin_profile.update_password': {
    methods: ["PUT"],
    pattern: '/api/v1/admin/profile/password',
    tokens: [{"old":"/api/v1/admin/profile/password","type":0,"val":"api","end":""},{"old":"/api/v1/admin/profile/password","type":0,"val":"v1","end":""},{"old":"/api/v1/admin/profile/password","type":0,"val":"admin","end":""},{"old":"/api/v1/admin/profile/password","type":0,"val":"profile","end":""},{"old":"/api/v1/admin/profile/password","type":0,"val":"password","end":""}],
    types: placeholder as Registry['admin_profile.update_password']['types'],
  },
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
  'auth.new_account.resend_email_otp': {
    methods: ["POST"],
    pattern: '/api/v1/auth/resend/register-otp',
    tokens: [{"old":"/api/v1/auth/resend/register-otp","type":0,"val":"api","end":""},{"old":"/api/v1/auth/resend/register-otp","type":0,"val":"v1","end":""},{"old":"/api/v1/auth/resend/register-otp","type":0,"val":"auth","end":""},{"old":"/api/v1/auth/resend/register-otp","type":0,"val":"resend","end":""},{"old":"/api/v1/auth/resend/register-otp","type":0,"val":"register-otp","end":""}],
    types: placeholder as Registry['auth.new_account.resend_email_otp']['types'],
  },
  'auth.new_account.change_email': {
    methods: ["POST"],
    pattern: '/api/v1/auth/change/register-email',
    tokens: [{"old":"/api/v1/auth/change/register-email","type":0,"val":"api","end":""},{"old":"/api/v1/auth/change/register-email","type":0,"val":"v1","end":""},{"old":"/api/v1/auth/change/register-email","type":0,"val":"auth","end":""},{"old":"/api/v1/auth/change/register-email","type":0,"val":"change","end":""},{"old":"/api/v1/auth/change/register-email","type":0,"val":"register-email","end":""}],
    types: placeholder as Registry['auth.new_account.change_email']['types'],
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
  'personal_compliance.submit_step_acknowledgement': {
    methods: ["POST"],
    pattern: '/api/v1/account/compliance/personal/acknowledgement',
    tokens: [{"old":"/api/v1/account/compliance/personal/acknowledgement","type":0,"val":"api","end":""},{"old":"/api/v1/account/compliance/personal/acknowledgement","type":0,"val":"v1","end":""},{"old":"/api/v1/account/compliance/personal/acknowledgement","type":0,"val":"account","end":""},{"old":"/api/v1/account/compliance/personal/acknowledgement","type":0,"val":"compliance","end":""},{"old":"/api/v1/account/compliance/personal/acknowledgement","type":0,"val":"personal","end":""},{"old":"/api/v1/account/compliance/personal/acknowledgement","type":0,"val":"acknowledgement","end":""}],
    types: placeholder as Registry['personal_compliance.submit_step_acknowledgement']['types'],
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
