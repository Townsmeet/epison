import type { H3Event } from 'h3'
import { count, eq, gte } from 'drizzle-orm'
import { db } from '../../utils/drizzle'
import { member } from '../../db/schema'
import type { ApiResponse } from '../../../types/api'
import type { MemberStats } from '../../../types/members'
import { validateQuery } from '../../validators'
import { memberStatsQuerySchema } from '../../validators/member'

export default defineEventHandler(async (event: H3Event): Promise<ApiResponse<MemberStats>> => {
  try {
    const _query = validateQuery(event, memberStatsQuerySchema, 'Invalid stats query parameters')
    // Get total count
    const totalResult = await db.select({ count: count() }).from(member)

    const total = totalResult[0]?.count || 0

    // Get counts by status
    const statusCounts = await db
      .select({
        status: member.status,
        count: count(),
      })
      .from(member)
      .groupBy(member.status)

    const byStatus: Record<string, number> = {}
    statusCounts.forEach(item => {
      const key = item.status ?? 'unknown'
      byStatus[key] = item.count
    })

    // Get counts by membership type
    const typeCounts = await db
      .select({
        type: member.membershipType,
        count: count(),
      })
      .from(member)
      .groupBy(member.membershipType)

    const byType: Record<string, number> = {}
    typeCounts.forEach(item => {
      const key = item.type ?? 'unknown'
      byType[key] = item.count
    })

    // Get recent joins (last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const recentJoinsResult = await db
      .select({ count: count() })
      .from(member)
      .where(gte(member.createdAt, thirtyDaysAgo))

    const recentJoins = recentJoinsResult[0]?.count || 0

    // Get expiring this month
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)

    // We need to filter by expiry date manually since it's stored as text
    const activeMembers = await db
      .select({ expiryDate: member.expiryDate })
      .from(member)
      .where(eq(member.status, 'active'))

    const expiringThisMonth = activeMembers.filter(m => {
      if (!m.expiryDate) return false
      const expiryDate = new Date(m.expiryDate)
      return expiryDate >= startOfMonth && expiryDate <= endOfMonth
    }).length

    const stats: MemberStats = {
      total,
      byStatus,
      byType,
      recentJoins,
      expiringThisMonth,
    }

    return {
      success: true,
      data: stats,
    }
  } catch (error) {
    console.error('Error fetching member stats:', error)
    return {
      success: false,
      error: 'Failed to fetch member statistics',
    }
  }
})
