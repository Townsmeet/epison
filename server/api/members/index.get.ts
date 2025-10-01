import type { H3Event } from 'h3'
// removed unused getQuery import
import { eq, like, or, and, asc, desc, count } from 'drizzle-orm'
import { db } from '../../utils/drizzle'
import { member } from '../../db/schema'
import type { PaginatedResponse } from '../../../types/api'
import type { MemberListItem, MemberListQuery } from '../../../types/members'
import { validateQuery } from '../../validators'
import { memberListQuerySchema } from '../../validators/member'

export default defineEventHandler(
  async (event: H3Event): Promise<PaginatedResponse<MemberListItem>> => {
    try {
      const query = validateQuery(
        event,
        memberListQuerySchema,
        'Invalid member list query'
      ) as MemberListQuery

      // Parse query parameters with defaults
      const page = query.page ?? 1
      const limit = query.limit ?? 10
      const search = (query.search || '').trim()
      const status = query.status || ''
      // Accept both `type` and `membershipType` for backward compatibility with client
      // Validator currently defines `membershipType`, while clients may send `type`.
      const type = (query as Record<string, unknown>)?.['type']
        ? String((query as Record<string, unknown>)['type'])
        : (query as Record<string, unknown>)?.['membershipType']
          ? String((query as Record<string, unknown>)['membershipType'])
          : ''
      const sortBy = (query as Record<string, unknown>)?.['sortBy']
        ? String((query as Record<string, unknown>)['sortBy'])
        : 'nameFirst'
      const sortOrder = (query as Record<string, unknown>)?.['sortOrder']
        ? String((query as Record<string, unknown>)['sortOrder'])
        : 'asc'

      // Build where conditions
      const conditions = []

      if (search) {
        conditions.push(
          or(
            like(member.nameFirst, `%${search}%`),
            like(member.nameFamily, `%${search}%`),
            like(member.email, `%${search}%`)
          )
        )
      }

      if (status) {
        conditions.push(eq(member.status, status))
      }

      if (type) {
        conditions.push(eq(member.membershipType, type))
      }

      // Build order by clause
      const orderByMap = {
        name: member.nameFirst,
        nameFirst: member.nameFirst,
        joinedDate: member.joinedDate,
        expiryDate: member.expiryDate,
        status: member.status,
      } as const
      const orderByColumn = orderByMap[sortBy as keyof typeof orderByMap] || member.nameFirst

      const orderBy = sortOrder === 'desc' ? desc(orderByColumn) : asc(orderByColumn)

      // Get total count
      const totalResult = await db
        .select({ count: count() })
        .from(member)
        .where(conditions.length > 0 ? and(...conditions) : undefined)

      const total = totalResult[0]?.count || 0
      const totalPages = Math.ceil(total / limit)
      const offset = (page - 1) * limit

      // Get paginated results
      const rows = await db
        .select({
          id: member.id,
          nameFirst: member.nameFirst,
          nameFamily: member.nameFamily,
          email: member.email,
          membershipType: member.membershipType,
          status: member.status,
          joinedDate: member.joinedDate,
          expiryDate: member.expiryDate,
          fees: member.fees,
          avatar: member.avatar,
        })
        .from(member)
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .orderBy(orderBy)
        .limit(limit)
        .offset(offset)

      const members: MemberListItem[] = rows.map(r => ({
        id: r.id,
        nameFirst: r.nameFirst,
        nameFamily: r.nameFamily,
        email: r.email,
        membershipType: r.membershipType ?? '',
        status: r.status ?? 'pending',
        joinedDate: r.joinedDate ?? '',
        expiryDate: r.expiryDate ?? '',
        fees: r.fees ?? 0,
        avatar: r.avatar ?? undefined,
      }))

      return {
        success: true,
        data: members,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      }
    } catch (error) {
      console.error('Error fetching members:', error)
      return {
        success: false,
        data: [],
        pagination: {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 0,
          hasNext: false,
          hasPrev: false,
        },
        error: 'Failed to fetch members',
      }
    }
  }
)
