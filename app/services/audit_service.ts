import AuditLog from '#models/audit_log'
import type { HttpContext } from '@adonisjs/core/http'
import logger from '@adonisjs/core/services/logger'

interface AuditLogOptions {
  action: string
  entity: string
  entityId?: number | null
  oldValues?: any
  newValues?: any
}

/**
 * Log an administrative or system mutation activity
 */
export async function logAudit(ctx: HttpContext, options: AuditLogOptions): Promise<void> {
  try {
    const userId = ctx.auth?.user?.id || null
    const ipAddress = ctx.request.ip()
    const userAgent = ctx.request.header('user-agent') || null

    await AuditLog.create({
      userId,
      action: options.action,
      entity: options.entity,
      entityId: options.entityId || null,
      oldValues: options.oldValues || null,
      newValues: options.newValues || null,
      ipAddress,
      userAgent,
    })
  } catch (error: any) {
    // Log error internally so audit failure never breaks primary controller execution flow
    logger.error({ err: error, options }, 'Failed to record audit log entry.')
  }
}