import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const AdminAuthController = () => import('#controllers/admin/admin_auth_controller')
const AdminComplianceController = () => import('#controllers/admin/admin_compliance_controller')
const TeamManagementController = () => import('#controllers/admin/team_management_controller')
const AdminInvitationController = () => import('#controllers/admin/admin_invitation_controller')
const AdminProfileController = () => import('#controllers/admin/admin_profile_controller')
const AuditLogsController = () => import('#controllers/admin/audit_logs_controller')
import RoleManagementController from '#controllers/admin/role_management_controller'

export function adminRoutes() {
  router
    .group(() => {
      // ==========================================
      // Public Admin Auth Routes
      // ==========================================
      router
        .group(() => {
          // Authentication
          router.post('login', [AdminAuthController, 'login'])
          router.post('login/verify-2fa', [AdminAuthController, 'verifyTwoFactor'])

          // Forgot Password Flow
          router.post('forgot-password/send-otp', [AdminAuthController, 'sendForgotOtp'])
          router.post('forgot-password/resend-otp', [AdminAuthController, 'resendForgotOtp'])
          router.post('forgot-password/verify-otp', [AdminAuthController, 'verifyForgotOtp'])
          router.post('forgot-password/reset', [AdminAuthController, 'resetPassword'])
        })
        .prefix('auth')

      // ==========================================
      // Admin Invite Public Routes
      // ==========================================
      router
        .group(() => {
          router.get('details/:token', [AdminInvitationController, 'getInviteDetails'])
          router.post('accept-invite', [AdminInvitationController, 'acceptInvite'])
          router.post('verify-otp', [AdminInvitationController, 'verifyOtp'])
        })
        .prefix('invite')

      // ==========================================
      // Protected Admin Routes
      // ==========================================
      router
        .group(() => {
          router.get('me', [AdminAuthController, 'me'])
          router.post('logout', [AdminAuthController, 'logout'])

          // Compliance Management / Dashboard
          router.get('compliance/dashboard', [AdminComplianceController, 'index'])
          router.get('compliance/account-info/:id', [AdminComplianceController, 'show'])
          router.get('compliance/eligibility/:id', [
            AdminComplianceController,
            'getEligibilityAndServices',
          ])
          router.get('compliance/identity/:id', [
            AdminComplianceController,
            'getIdentityVerification',
          ])
          router.get('compliance/settlement/:id', [
            AdminComplianceController,
            'getSettlementAccount',
          ])
          router.get('compliance/approve/:id', [AdminComplianceController, 'approve'])
          router.post('compliance/reject/:id', [AdminComplianceController, 'reject'])
          router.post('compliance/request-document/:id', [
            AdminComplianceController,
            'requestDocument',
          ])

          // Audit Log Routes:
          router.get('audit-logs', [AuditLogsController, 'index'])
          router.get('audit-logs/:id', [AuditLogsController, 'show'])

          // Team Management Routes:
          router.get('team', [TeamManagementController, 'listTeams'])
          router.get('team/members', [TeamManagementController, 'listMembers'])
          router.post('team/create', [TeamManagementController, 'createTeam'])
          router.get('team/details/:id', [TeamManagementController, 'showTeam'])
          router.post('team/update/:id', [TeamManagementController, 'updateTeam'])
          router.post('team/invite', [TeamManagementController, 'invite'])

          // Role & Permissions Management Routes
          router.get('roles/permissions', [RoleManagementController, 'listPermissions'])
          router.get('roles/list', [RoleManagementController, 'listRoles'])
          router.post('roles/create', [RoleManagementController, 'createRole'])
          router.get('roles/details/:id', [RoleManagementController, 'showRole'])
          router.post('roles/update/:id', [RoleManagementController, 'updateRole'])
          router.post('roles/toggle-status/:id', [RoleManagementController, 'toggleStatus'])

          // Profile settings management
          router.get('profile', [AdminProfileController, 'show'])
          router.put('profile', [AdminProfileController, 'updateProfile'])
          router.put('profile/password', [AdminProfileController, 'updatePassword'])
           
        })
        .use([middleware.auth(), middleware.admin()])
    })
    .prefix('/api/v1/admin')
}
