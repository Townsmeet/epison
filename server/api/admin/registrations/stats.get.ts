import { sql } from 'drizzle-orm'
import { createError } from 'h3'
import { db } from '../../../utils/drizzle'
import { eventRegistration } from '../../../db/schema'
import { requireAuthUser } from '../../../utils/auth-helpers'
import type { ApiResponse } from '../../../../types/api'

interface RegistrationStats {
  total: number
  paid: number
  pending: number
  cancelled: number
  refunded: number
}

export default defineEventHandler(async (event): Promise<ApiResponse<RegistrationStats>> => {
  // Auth check
  requireAuthUser(event)

  try {
    // Get total count
    const totalResult = await db.select({ count: sql<number>`count(*)` }).from(eventRegistration)

    const total = totalResult[0]?.count || 0

    // Get counts by payment status
    const statusCounts = await db
      .select({
        status: eventRegistration.paymentStatus,
        count: sql<number>`count(*)`,
      })
      .from(eventRegistration)
      .groupBy(eventRegistration.paymentStatus)

    // Map status counts
    const stats: RegistrationStats = {
      total,
      paid: 0,
      pending: 0,
      cancelled: 0,
      refunded: 0,
    }

    statusCounts.forEach(row => {
      const status = row.status?.toLowerCase()
      const count = Number(row.count) || 0

      if (status === 'paid') stats.paid = count
      else if (status === 'pending') stats.pending = count
      else if (status === 'cancelled') stats.cancelled = count
      else if (status === 'refunded') stats.refunded = count
    })

    return {
      success: true,
      data: stats,
    }
  } catch (error: unknown) {
    console.error('Error fetching registration stats:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch registration stats',
    })
  }
})
