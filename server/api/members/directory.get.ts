import { like, or, eq, desc, asc } from 'drizzle-orm'
import { db } from '../../utils/drizzle'
import { member } from '../../db/schema'
import { z } from 'zod'

// Query schema for directory
const directoryQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().optional(),
  state: z.string().optional(),
  membershipType: z.string().optional(),
  sortBy: z.enum(['name', 'joinedDate']).default('name'),
  sortOrder: z.enum(['asc', 'desc']).default('asc'),
})

export default defineEventHandler(async event => {
  try {
    // Parse and validate query parameters
    const query = await getValidatedQuery(event, directoryQuerySchema.parse)

    const { page, limit, search, state, membershipType, sortBy, sortOrder } = query
    const offset = (page - 1) * limit

    // Build where conditions - only show active members
    const conditions = [eq(member.status, 'active')]

    if (search) {
      conditions.push(
        or(
          like(member.nameFirst, `%${search}%`),
          like(member.nameFamily, `%${search}%`),
          like(member.email, `%${search}%`),
          like(member.position, `%${search}%`),
          like(member.employer, `%${search}%`)
        )!
      )
    }

    if (state) {
      conditions.push(eq(member.state, state))
    }

    if (membershipType) {
      conditions.push(eq(member.membershipType, membershipType))
    }

    // Determine sort column
    const sortColumn = sortBy === 'joinedDate' ? member.joinedDate : member.nameFamily
    const sortFn = sortOrder === 'desc' ? desc : asc

    // Get total count
    const totalResult = await db
      .select({ count: db.$count(member.id) })
      .from(member)
      .where(conditions.length > 0 ? conditions[0] : undefined)

    const total = totalResult[0]?.count || 0

    // Get members with pagination - only essential public information
    const members = await db
      .select({
        id: member.id,
        title: member.title,
        nameFirst: member.nameFirst,
        nameFamily: member.nameFamily,
        avatar: member.avatar,
        position: member.position,
        employer: member.employer,
        state: member.state,
        membershipType: member.membershipType,
        joinedDate: member.joinedDate,
      })
      .from(member)
      .where(conditions.length > 0 ? conditions[0] : undefined)
      .orderBy(sortFn(sortColumn))
      .limit(limit)
      .offset(offset)

    return {
      success: true,
      data: members,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    }
  } catch (error) {
    console.error('Error fetching member directory:', error)
    return {
      success: false,
      error: 'Failed to fetch member directory',
      data: [],
      pagination: {
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 0,
      },
    }
  }
})
