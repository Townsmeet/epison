import type { H3Event } from 'h3'
import { getRouterParam, createError } from 'h3'
import { desc, eq } from 'drizzle-orm'
import { db } from '../../../utils/drizzle'
import { member, memberHistory } from '../../../db/schema'
import type { ApiResponse } from '../../../../types/api'

interface MemberHistoryItem {
  id: string
  memberId: string
  action: string
  type: string
  date: string
  notes?: string
}

export default defineEventHandler(
  async (event: H3Event): Promise<ApiResponse<MemberHistoryItem[]>> => {
    try {
      const memberId = getRouterParam(event, 'id')
      if (!memberId) {
        throw createError({ statusCode: 400, statusMessage: 'Member ID is required' })
      }

      // Ensure member exists
      const exists = await db
        .select({ id: member.id })
        .from(member)
        .where(eq(member.id, memberId))
        .limit(1)
      if (!exists.length) {
        throw createError({ statusCode: 404, statusMessage: 'Member not found' })
      }

      const rows = await db
        .select({
          id: memberHistory.id,
          memberId: memberHistory.memberId,
          action: memberHistory.action,
          type: memberHistory.type,
          date: memberHistory.date,
          notes: memberHistory.notes,
        })
        .from(memberHistory)
        .where(eq(memberHistory.memberId, memberId))
        .orderBy(desc(memberHistory.date))

      const history: MemberHistoryItem[] = rows.map(r => ({
        id: r.id,
        memberId: r.memberId,
        action: r.action,
        type: r.type,
        date: new Date(r.date).toISOString(),
        notes: r.notes ?? undefined,
      }))

      return { success: true, data: history }
    } catch (error: unknown) {
      console.error('Error fetching member history:', error)
      if (typeof error === 'object' && error && 'statusCode' in error)
        throw error as unknown as Error
      return { success: false, error: 'Failed to fetch member history' }
    }
  }
)
