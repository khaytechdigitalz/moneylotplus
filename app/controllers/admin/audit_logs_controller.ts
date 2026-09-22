import type { HttpContext } from '@adonisjs/core/http'
import AuditLog from '#models/audit_log'
import logger from '@adonisjs/core/services/logger'

export default class AuditLogsController {
  /**
   * List all audit logs with pagination, filtering, and search capabilities
   */
  async index({ request, response }: HttpContext) {
    try {
      const page = request.input('page', 1)
      const limit = request.input('limit', 20)
      const userId = request.input('userId')
      const action = request.input('action')
      const entity = request.input('entity')
      const entityId = request.input('entityId')
      const startDate = request.input('startDate') // Format: YYYY-MM-DD
      const endDate = request.input('endDate')     // Format: YYYY-MM-DD
      const search = request.input('search')       // Search action, IP, or email

      const query = AuditLog.query()
        .preload('user', (userQuery) => {
          userQuery.select(['id', 'email', 'role']).preload('adminProfile', (profileQuery) => {
            profileQuery.select(['firstName', 'lastName', 'avatar'])
          })
        })
        .orderBy('createdAt', 'desc')

      // Filter by performing user ID
      if (userId) {
        query.where('userId', userId)
      }

      // Filter by specific action (e.g. 'INVITE_ADMIN_USER', 'UPDATE_TEAM')
      if (action) {
        query.where('action', action)
      }

      // Filter by entity type (e.g. 'users', 'teams')
      if (entity) {
        query.where('entity', entity)
      }

      // Filter by specific target entity ID
      if (entityId) {
        query.where('entityId', entityId)
      }

      // Filter by date range
      if (startDate) {
        query.where('createdAt', '>=', `${startDate} 00:00:00`)
      }
      if (endDate) {
        query.where('createdAt', '<=', `${endDate} 23:59:59`)
      }

      // General search across action, IP, or user email
      if (search) {
        query.where((builder) => {
          builder
            .whereILike('action', `%${search}%`)
            .orWhereILike('ipAddress', `%${search}%`)
            .orWhereHas('user', (userQuery) => {
              userQuery.whereILike('email', `%${search}%`)
            })
        })
      }

      const logs = await query.paginate(page, limit)

      return response.ok({
        success: true,
        data: logs.all().map((log) => ({
          id: log.id,
          action: log.action,
          entity: log.entity,
          entityId: log.entityId,
          ipAddress: log.ipAddress,
          userAgent: log.userAgent,
          actor: log.user
            ? {
                id: log.user.id,
                email: log.user.email,
                role: log.user.role,
                name: log.user.adminProfile
                  ? `${log.user.adminProfile.firstName || ''} ${log.user.adminProfile.lastName || ''}`.trim()
                  : null,
                avatar: log.user.adminProfile?.avatar || null,
              }
            : null,
          oldValues: log.oldValues,
          newValues: log.newValues,
          createdAt: log.createdAt ? log.createdAt.toISO() : null,
        })),
        meta: logs.getMeta(),
      })
    } catch (error: any) {
      logger.error({ err: error }, `Failed to fetch audit logs: ${error?.message || error}`)

      return response.internalServerError({
        errors: [{ message: 'Failed to retrieve audit logs. Please try again.' }],
      })
    }
  }

  /**
   * Fetch a single audit log entry by ID
   */
  async show({ params, response }: HttpContext) {
    const { id } = params

    try {
      const log = await AuditLog.query()
        .where('id', id)
        .preload('user', (userQuery) => {
          userQuery.select(['id', 'email', 'role']).preload('adminProfile', (profileQuery) => {
            profileQuery.select(['firstName', 'lastName', 'avatar', 'phone'])
          })
        })
        .first()

      if (!log) {
        return response.notFound({
          errors: [{ message: 'Audit log entry not found.' }],
        })
      }

      return response.ok({
        success: true,
        data: {
          id: log.id,
          action: log.action,
          entity: log.entity,
          entityId: log.entityId,
          ipAddress: log.ipAddress,
          userAgent: log.userAgent,
          actor: log.user
            ? {
                id: log.user.id,
                email: log.user.email,
                role: log.user.role,
                name: log.user.adminProfile
                  ? `${log.user.adminProfile.firstName || ''} ${log.user.adminProfile.lastName || ''}`.trim()
                  : null,
                phone: log.user.adminProfile?.phone || null,
                avatar: log.user.adminProfile?.avatar || null,
              }
            : null,
          oldValues: log.oldValues,
          newValues: log.newValues,
          createdAt: log.createdAt ? log.createdAt.toISO() : null,
        },
      })
    } catch (error: any) {
      logger.error({ err: error, id }, `Failed to fetch audit log detail: ${error?.message || error}`)

      return response.internalServerError({
        errors: [{ message: 'Failed to retrieve audit log detail. Please try again.' }],
      })
    }
  }
}