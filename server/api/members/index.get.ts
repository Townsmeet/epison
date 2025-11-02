import type { H3Event } from 'h3'
// removed unused getQuery import
import { eq, like, or, and, asc, desc, count, isNull, isNotNull } from 'drizzle-orm'
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
      // Accept only 'membershipType' (ignore 'type', always use same for both client and server)
      const membershipType =
        typeof query.membershipType === 'string' && query.membershipType.trim() !== ''
          ? query.membershipType
          : undefined
      const geoPoliticalZone =
        typeof query.geopoliticalZone === 'string' && query.geopoliticalZone.trim() !== ''
          ? query.geopoliticalZone
          : undefined
      const sortBy = (query as Record<string, unknown>)?.['sortBy']
        ? String((query as Record<string, unknown>)['sortBy'])
        : 'nameFirst'
      const sortOrder = (query as Record<string, unknown>)?.['sortOrder']
        ? String((query as Record<string, unknown>)['sortOrder'])
        : 'asc'
      const paymentStatus = (query as Record<string, unknown>)?.['paymentStatus']
        ? String((query as Record<string, unknown>)['paymentStatus'])
        : ''

      // Build where conditions
      const conditions = []

      if (search) {
        conditions.push(
          or(
            like(member.nameFirst, `%${search}%`),
            like(member.nameFamily, `%${search}%`),
            like(member.email, `%${search}%`),
            like(member.geopoliticalZone, `%${search}%`),
            like(member.membershipType, `%${search}%`)
          )
        )
      }

      if (status) {
        conditions.push(eq(member.status, status))
      }

      if (membershipType) {
        conditions.push(eq(member.membershipType, membershipType))
      }

      if (geoPoliticalZone) {
        conditions.push(eq(member.geopoliticalZone, geoPoliticalZone))
      }

      if (paymentStatus) {
        if (paymentStatus === 'paid') {
          conditions.push(isNotNull(member.paymentReference))
        } else if (paymentStatus === 'unpaid') {
          conditions.push(isNull(member.paymentReference))
        }
      }
      // Debug log (remove after confirming fix)
      console.log('SQL Filter Conditions:', JSON.stringify(conditions))
      console.log('Query values:', {
        search,
        status,
        membershipType,
        geoPoliticalZone,
        paymentStatus,
      })

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
          paymentReference: member.paymentReference,
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
        paymentReference: r.paymentReference ?? undefined,
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
