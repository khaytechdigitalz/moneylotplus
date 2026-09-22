import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'admin_auth.login': { paramsTuple?: []; params?: {} }
    'admin_auth.verify_two_factor': { paramsTuple?: []; params?: {} }
    'admin_auth.send_forgot_otp': { paramsTuple?: []; params?: {} }
    'admin_auth.resend_forgot_otp': { paramsTuple?: []; params?: {} }
    'admin_auth.verify_forgot_otp': { paramsTuple?: []; params?: {} }
    'admin_auth.reset_password': { paramsTuple?: []; params?: {} }
    'admin_invitation.get_invite_details': { paramsTuple: [ParamValue]; params: {'token': ParamValue} }
    'admin_invitation.accept_invite': { paramsTuple?: []; params?: {} }
    'admin_invitation.verify_otp': { paramsTuple?: []; params?: {} }
    'admin_auth.me': { paramsTuple?: []; params?: {} }
    'admin_auth.logout': { paramsTuple?: []; params?: {} }
    'admin_compliance.index': { paramsTuple?: []; params?: {} }
    'admin_compliance.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin_compliance.get_eligibility_and_services': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin_compliance.get_identity_verification': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin_compliance.get_settlement_account': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin_compliance.approve': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin_compliance.reject': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin_compliance.request_document': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'audit_logs.index': { paramsTuple?: []; params?: {} }
    'audit_logs.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'team_management.list_teams': { paramsTuple?: []; params?: {} }
    'team_management.list_members': { paramsTuple?: []; params?: {} }
    'team_management.create_team': { paramsTuple?: []; params?: {} }
    'team_management.show_team': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'team_management.update_team': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'team_management.invite': { paramsTuple?: []; params?: {} }
    'role_management.list_permissions': { paramsTuple?: []; params?: {} }
    'role_management.list_roles': { paramsTuple?: []; params?: {} }
    'role_management.create_role': { paramsTuple?: []; params?: {} }
    'role_management.show_role': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'role_management.update_role': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'role_management.toggle_status': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin_profile.show': { paramsTuple?: []; params?: {} }
    'admin_profile.update_profile': { paramsTuple?: []; params?: {} }
    'admin_profile.update_password': { paramsTuple?: []; params?: {} }
    'sumsub_webhook.handle_webhook': { paramsTuple?: []; params?: {} }
    'auth.new_account.signup': { paramsTuple?: []; params?: {} }
    'auth.new_account.resend_email_otp': { paramsTuple?: []; params?: {} }
    'auth.new_account.change_email': { paramsTuple?: []; params?: {} }
    'auth.new_account.housenumber': { paramsTuple?: []; params?: {} }
    'auth.new_account.firmreference': { paramsTuple?: []; params?: {} }
    'auth.access_tokens.store': { paramsTuple?: []; params?: {} }
    'auth.access_tokens.verify_two_factor': { paramsTuple?: []; params?: {} }
    'auth.forgot_passwords.send_otp': { paramsTuple?: []; params?: {} }
    'auth.forgot_passwords.resend_otp': { paramsTuple?: []; params?: {} }
    'auth.forgot_passwords.verify_otp': { paramsTuple?: []; params?: {} }
    'auth.forgot_passwords.reset_password': { paramsTuple?: []; params?: {} }
    'auth.verify_email': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'mfa.setup': { paramsTuple?: []; params?: {} }
    'mfa.verify_and_enable': { paramsTuple?: []; params?: {} }
    'access_tokens.destroy': { paramsTuple?: []; params?: {} }
    'compliance.get_sum_sub_token': { paramsTuple?: []; params?: {} }
    'compliance.get_step_three_status': { paramsTuple?: []; params?: {} }
    'compliance.get_ka_question': { paramsTuple?: []; params?: {} }
    'personal_compliance.submit_step_one': { paramsTuple?: []; params?: {} }
    'personal_compliance.submit_step_two': { paramsTuple?: []; params?: {} }
    'personal_compliance.submit_step_four': { paramsTuple?: []; params?: {} }
    'personal_compliance.submit_step_acknowledgement': { paramsTuple?: []; params?: {} }
    'regulated_business_compliance.submit_step_one': { paramsTuple?: []; params?: {} }
    'regulated_business_compliance.submit_step_two': { paramsTuple?: []; params?: {} }
    'regulated_business_compliance.submit_step_four': { paramsTuple?: []; params?: {} }
    'dashboard.dashboard': { paramsTuple?: []; params?: {} }
    'ibkr_connect.initiate_auth': { paramsTuple?: []; params?: {} }
    'ibkr_connect.handle_callback': { paramsTuple?: []; params?: {} }
    'ibkr_connect.link_flex_service': { paramsTuple?: []; params?: {} }
  }
  POST: {
    'admin_auth.login': { paramsTuple?: []; params?: {} }
    'admin_auth.verify_two_factor': { paramsTuple?: []; params?: {} }
    'admin_auth.send_forgot_otp': { paramsTuple?: []; params?: {} }
    'admin_auth.resend_forgot_otp': { paramsTuple?: []; params?: {} }
    'admin_auth.verify_forgot_otp': { paramsTuple?: []; params?: {} }
    'admin_auth.reset_password': { paramsTuple?: []; params?: {} }
    'admin_invitation.accept_invite': { paramsTuple?: []; params?: {} }
    'admin_invitation.verify_otp': { paramsTuple?: []; params?: {} }
    'admin_auth.logout': { paramsTuple?: []; params?: {} }
    'admin_compliance.reject': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin_compliance.request_document': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'team_management.create_team': { paramsTuple?: []; params?: {} }
    'team_management.update_team': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'team_management.invite': { paramsTuple?: []; params?: {} }
    'role_management.create_role': { paramsTuple?: []; params?: {} }
    'role_management.update_role': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'role_management.toggle_status': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'sumsub_webhook.handle_webhook': { paramsTuple?: []; params?: {} }
    'auth.new_account.signup': { paramsTuple?: []; params?: {} }
    'auth.new_account.resend_email_otp': { paramsTuple?: []; params?: {} }
    'auth.new_account.change_email': { paramsTuple?: []; params?: {} }
    'auth.new_account.housenumber': { paramsTuple?: []; params?: {} }
    'auth.new_account.firmreference': { paramsTuple?: []; params?: {} }
    'auth.access_tokens.store': { paramsTuple?: []; params?: {} }
    'auth.access_tokens.verify_two_factor': { paramsTuple?: []; params?: {} }
    'auth.forgot_passwords.send_otp': { paramsTuple?: []; params?: {} }
    'auth.forgot_passwords.resend_otp': { paramsTuple?: []; params?: {} }
    'auth.forgot_passwords.verify_otp': { paramsTuple?: []; params?: {} }
    'auth.forgot_passwords.reset_password': { paramsTuple?: []; params?: {} }
    'mfa.setup': { paramsTuple?: []; params?: {} }
    'mfa.verify_and_enable': { paramsTuple?: []; params?: {} }
    'access_tokens.destroy': { paramsTuple?: []; params?: {} }
    'personal_compliance.submit_step_one': { paramsTuple?: []; params?: {} }
    'personal_compliance.submit_step_two': { paramsTuple?: []; params?: {} }
    'personal_compliance.submit_step_four': { paramsTuple?: []; params?: {} }
    'personal_compliance.submit_step_acknowledgement': { paramsTuple?: []; params?: {} }
    'regulated_business_compliance.submit_step_one': { paramsTuple?: []; params?: {} }
    'regulated_business_compliance.submit_step_two': { paramsTuple?: []; params?: {} }
    'regulated_business_compliance.submit_step_four': { paramsTuple?: []; params?: {} }
    'ibkr_connect.link_flex_service': { paramsTuple?: []; params?: {} }
  }
  GET: {
    'admin_invitation.get_invite_details': { paramsTuple: [ParamValue]; params: {'token': ParamValue} }
    'admin_auth.me': { paramsTuple?: []; params?: {} }
    'admin_compliance.index': { paramsTuple?: []; params?: {} }
    'admin_compliance.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin_compliance.get_eligibility_and_services': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin_compliance.get_identity_verification': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin_compliance.get_settlement_account': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin_compliance.approve': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'audit_logs.index': { paramsTuple?: []; params?: {} }
    'audit_logs.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'team_management.list_teams': { paramsTuple?: []; params?: {} }
    'team_management.list_members': { paramsTuple?: []; params?: {} }
    'team_management.show_team': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'role_management.list_permissions': { paramsTuple?: []; params?: {} }
    'role_management.list_roles': { paramsTuple?: []; params?: {} }
    'role_management.show_role': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin_profile.show': { paramsTuple?: []; params?: {} }
    'auth.verify_email': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'compliance.get_sum_sub_token': { paramsTuple?: []; params?: {} }
    'compliance.get_step_three_status': { paramsTuple?: []; params?: {} }
    'compliance.get_ka_question': { paramsTuple?: []; params?: {} }
    'dashboard.dashboard': { paramsTuple?: []; params?: {} }
    'ibkr_connect.initiate_auth': { paramsTuple?: []; params?: {} }
    'ibkr_connect.handle_callback': { paramsTuple?: []; params?: {} }
  }
  HEAD: {
    'admin_invitation.get_invite_details': { paramsTuple: [ParamValue]; params: {'token': ParamValue} }
    'admin_auth.me': { paramsTuple?: []; params?: {} }
    'admin_compliance.index': { paramsTuple?: []; params?: {} }
    'admin_compliance.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin_compliance.get_eligibility_and_services': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin_compliance.get_identity_verification': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin_compliance.get_settlement_account': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin_compliance.approve': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'audit_logs.index': { paramsTuple?: []; params?: {} }
    'audit_logs.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'team_management.list_teams': { paramsTuple?: []; params?: {} }
    'team_management.list_members': { paramsTuple?: []; params?: {} }
    'team_management.show_team': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'role_management.list_permissions': { paramsTuple?: []; params?: {} }
    'role_management.list_roles': { paramsTuple?: []; params?: {} }
    'role_management.show_role': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin_profile.show': { paramsTuple?: []; params?: {} }
    'auth.verify_email': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'compliance.get_sum_sub_token': { paramsTuple?: []; params?: {} }
    'compliance.get_step_three_status': { paramsTuple?: []; params?: {} }
    'compliance.get_ka_question': { paramsTuple?: []; params?: {} }
    'dashboard.dashboard': { paramsTuple?: []; params?: {} }
    'ibkr_connect.initiate_auth': { paramsTuple?: []; params?: {} }
    'ibkr_connect.handle_callback': { paramsTuple?: []; params?: {} }
  }
  PUT: {
    'admin_profile.update_profile': { paramsTuple?: []; params?: {} }
    'admin_profile.update_password': { paramsTuple?: []; params?: {} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}