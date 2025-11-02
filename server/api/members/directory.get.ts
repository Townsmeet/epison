import { like, or, eq, desc, asc, sql, and } from 'drizzle-orm'
import { db } from '../../utils/drizzle'
import { member } from '../../db/schema'
import { z } from 'zod'

// Query schema for directory
const directoryQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().optional(),
  geopoliticalZone: z
    .enum([
      'South South',
      'South West',
      'South East',
      'North Central',
      'North West',
      'North East',
      'Not Applicable',
    ])
    .optional(),
  membershipType: z.string().optional(),
  sortBy: z.enum(['name', 'joinedDate']).default('name'),
  sortOrder: z.enum(['asc', 'desc']).default('asc'),
})

export default defineEventHandler(async event => {
  try {
    // Parse and validate query parameters
    const query = await getValidatedQuery(event, directoryQuerySchema.parse)

    const { page, limit, search, geopoliticalZone, membershipType, sortBy, sortOrder } = query
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
          like(member.employer, `%${search}%`),
          like(member.geopoliticalZone, `%${search}%`),
          like(member.membershipType, `%${search}%`)
        )!
      )
    }

    if (geopoliticalZone) {
      conditions.push(eq(member.geopoliticalZone, geopoliticalZone))
    }

    if (membershipType) {
      conditions.push(eq(member.membershipType, membershipType))
    }

    // Determine sort column
    const sortColumn = sortBy === 'joinedDate' ? member.joinedDate : member.nameFamily
    const sortFn = sortOrder === 'desc' ? desc : asc

    // Debug logs
    console.log('Directory API QUERY:', {
      page,
      limit,
      search,
      geopoliticalZone,
      membershipType,
      sortBy,
      sortOrder,
    })
    console.log('Directory API CONDITIONS:', conditions)
    console.log('Directory API OFFSET:', offset)

    // Get total count
    const [countResult] = await db
      .select({ count: sql<number>`count(*)`.as('count') })
      .from(member)
      .where(conditions.length > 0 ? and(...conditions) : undefined)

    const total = countResult?.count || 0

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
        geopoliticalZone: member.geopoliticalZone,
        membershipType: member.membershipType,
        joinedDate: member.joinedDate,
      })
      .from(member)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(sortFn(sortColumn))
      .limit(limit)
      .offset(offset)

    // Format the response to ensure avatar URLs are properly constructed
    const formattedMembers = members.map(m => ({
      ...m,
      // If avatar is a path (not a full URL), construct the full URL
      avatar: m.avatar
        ? m.avatar.startsWith('http')
          ? m.avatar
          : `${process.env.STORAGE_BASE_URL || ''}${m.avatar}`
        : null,
    }))

    return {
      success: true,
      data: formattedMembers,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    }
  } catch (error) {
    console.error('Error fetching member directory:', error)
    const errorMessage = import.meta.dev
      ? `Failed to fetch member directory: ${error instanceof Error ? error.message : String(error)}`
      : 'Failed to fetch member directory. Please try again later.'

    return {
      success: false,
      error: errorMessage,
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
