import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'sumsub_webhook.handle_webhook': { paramsTuple?: []; params?: {} }
    'auth.new_account.signup': { paramsTuple?: []; params?: {} }
    'auth.new_account.resend_email_otp': { paramsTuple?: []; params?: {} }
    'auth.new_account.change_email': { paramsTuple?: []; params?: {} }
    'auth.new_account.housenumber': { paramsTuple?: []; params?: {} }
    'auth.new_account.firmreference': { paramsTuple?: []; params?: {} }
    'auth.new_account.companyidverify': { paramsTuple?: []; params?: {} }
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
    'regulated_business_compliance.submit_step_one': { paramsTuple?: []; params?: {} }
    'regulated_business_compliance.submit_step_two': { paramsTuple?: []; params?: {} }
    'regulated_business_compliance.submit_step_four': { paramsTuple?: []; params?: {} }
    'dashboard.dashboard': { paramsTuple?: []; params?: {} }
    'ibkr_connect.initiate_auth': { paramsTuple?: []; params?: {} }
    'ibkr_connect.handle_callback': { paramsTuple?: []; params?: {} }
    'ibkr_connect.link_flex_service': { paramsTuple?: []; params?: {} }
  }
  GET: {
    'auth.verify_email': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'compliance.get_sum_sub_token': { paramsTuple?: []; params?: {} }
    'compliance.get_step_three_status': { paramsTuple?: []; params?: {} }
    'compliance.get_ka_question': { paramsTuple?: []; params?: {} }
    'dashboard.dashboard': { paramsTuple?: []; params?: {} }
    'ibkr_connect.initiate_auth': { paramsTuple?: []; params?: {} }
    'ibkr_connect.handle_callback': { paramsTuple?: []; params?: {} }
  }
  HEAD: {
    'auth.verify_email': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'compliance.get_sum_sub_token': { paramsTuple?: []; params?: {} }
    'compliance.get_step_three_status': { paramsTuple?: []; params?: {} }
    'compliance.get_ka_question': { paramsTuple?: []; params?: {} }
    'dashboard.dashboard': { paramsTuple?: []; params?: {} }
    'ibkr_connect.initiate_auth': { paramsTuple?: []; params?: {} }
    'ibkr_connect.handle_callback': { paramsTuple?: []; params?: {} }
  }
  POST: {
    'sumsub_webhook.handle_webhook': { paramsTuple?: []; params?: {} }
    'auth.new_account.signup': { paramsTuple?: []; params?: {} }
    'auth.new_account.resend_email_otp': { paramsTuple?: []; params?: {} }
    'auth.new_account.change_email': { paramsTuple?: []; params?: {} }
    'auth.new_account.housenumber': { paramsTuple?: []; params?: {} }
    'auth.new_account.firmreference': { paramsTuple?: []; params?: {} }
    'auth.new_account.companyidverify': { paramsTuple?: []; params?: {} }
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
    'regulated_business_compliance.submit_step_one': { paramsTuple?: []; params?: {} }
    'regulated_business_compliance.submit_step_two': { paramsTuple?: []; params?: {} }
    'regulated_business_compliance.submit_step_four': { paramsTuple?: []; params?: {} }
    'ibkr_connect.link_flex_service': { paramsTuple?: []; params?: {} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}