/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
  adminAuth: {
    login: typeof routes['admin_auth.login']
    verifyTwoFactor: typeof routes['admin_auth.verify_two_factor']
    sendForgotOtp: typeof routes['admin_auth.send_forgot_otp']
    resendForgotOtp: typeof routes['admin_auth.resend_forgot_otp']
    verifyForgotOtp: typeof routes['admin_auth.verify_forgot_otp']
    resetPassword: typeof routes['admin_auth.reset_password']
    me: typeof routes['admin_auth.me']
    logout: typeof routes['admin_auth.logout']
  }
  adminInvitation: {
    getInviteDetails: typeof routes['admin_invitation.get_invite_details']
    acceptInvite: typeof routes['admin_invitation.accept_invite']
    verifyOtp: typeof routes['admin_invitation.verify_otp']
  }
  adminCompliance: {
    index: typeof routes['admin_compliance.index']
    show: typeof routes['admin_compliance.show']
    getEligibilityAndServices: typeof routes['admin_compliance.get_eligibility_and_services']
    getIdentityVerification: typeof routes['admin_compliance.get_identity_verification']
    getSettlementAccount: typeof routes['admin_compliance.get_settlement_account']
    sendComplianceOtp: typeof routes['admin_compliance.send_compliance_otp']
    approve: typeof routes['admin_compliance.approve']
    reject: typeof routes['admin_compliance.reject']
    requestDocument: typeof routes['admin_compliance.request_document']
  }
  auditLogs: {
    index: typeof routes['audit_logs.index']
    show: typeof routes['audit_logs.show']
  }
  teamManagement: {
    listTeams: typeof routes['team_management.list_teams']
    listMembers: typeof routes['team_management.list_members']
    showTeamMember: typeof routes['team_management.show_team_member']
    activateTeamMember: typeof routes['team_management.activate_team_member']
    dectivateTeamMember: typeof routes['team_management.dectivate_team_member']
    createTeam: typeof routes['team_management.create_team']
    showTeam: typeof routes['team_management.show_team']
    activateTeam: typeof routes['team_management.activate_team']
    deactivateTeam: typeof routes['team_management.deactivate_team']
    updateTeam: typeof routes['team_management.update_team']
    invite: typeof routes['team_management.invite']
  }
  roleManagement: {
    listPermissions: typeof routes['role_management.list_permissions']
    listRoles: typeof routes['role_management.list_roles']
    createRole: typeof routes['role_management.create_role']
    showRole: typeof routes['role_management.show_role']
    updateRole: typeof routes['role_management.update_role']
    toggleStatus: typeof routes['role_management.toggle_status']
  }
  adminProfile: {
    show: typeof routes['admin_profile.show']
    updateProfile: typeof routes['admin_profile.update_profile']
    updatePassword: typeof routes['admin_profile.update_password']
  }
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
    submitStepAcknowledgement: typeof routes['personal_compliance.submit_step_acknowledgement']
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
