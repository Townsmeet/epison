import { and, like, desc, asc, sql, or, type SQLWrapper } from 'drizzle-orm'
import { createError } from 'h3'
import { db } from '../../../utils/drizzle'
import { activityLog } from '../../../db/schema'

export default defineEventHandler(async event => {
  try {
    // Query params: q, type, page, limit, sort
    const query = getQuery(event)
    const q = (query.q as string | undefined)?.trim()
    const type = (query.type as string | undefined)?.trim()
    const page = Math.max(parseInt((query.page as string) || '1', 10) || 1, 1)
    const limit = Math.min(Math.max(parseInt((query.limit as string) || '10', 10) || 10, 1), 100)
    const sort = ((query.sort as string) || '-createdAt').trim()

    const whereClauses: (SQLWrapper | undefined)[] = []

    if (type && type !== 'All') {
      whereClauses.push(sql`${activityLog.type} = ${type}`)
    }

    if (q) {
      const likeQ = `%${q}%`
      whereClauses.push(
        or(
          like(activityLog.title, likeQ),
          like(activityLog.description, likeQ),
          like(activityLog.entityType, likeQ),
          like(activityLog.entityId, likeQ)
        )
      )
    }

    const where = whereClauses.length ? and(...whereClauses) : undefined

    // sorting (whitelist to avoid unsafe dynamic access)
    type SortField = 'createdAt' | 'title' | 'type'
    const field: SortField = (['createdAt', 'title', 'type'] as const).includes(
      sort.replace('-', '') as SortField
    )
      ? (sort.replace('-', '') as SortField)
      : 'createdAt'
    const direction = sort.startsWith('-') ? 'desc' : 'asc'
    const orderBy =
      direction === 'desc'
        ? field === 'createdAt'
          ? desc(activityLog.createdAt)
          : field === 'title'
            ? desc(activityLog.title)
            : desc(activityLog.type)
        : field === 'createdAt'
          ? asc(activityLog.createdAt)
          : field === 'title'
            ? asc(activityLog.title)
            : asc(activityLog.type)

    const offset = (page - 1) * limit

    const listQuery = db.select().from(activityLog).orderBy(orderBy).limit(limit).offset(offset)
    const countQuery = db.select({ count: sql<number>`count(*)` }).from(activityLog)
    const [rows, [{ count }]] = await Promise.all([
      where ? listQuery.where(where) : listQuery,
      where ? countQuery.where(where) : countQuery,
    ])

    return {
      success: true,
      data: rows,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit),
        hasNext: offset + rows.length < count,
        hasPrev: page > 1,
      },
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to fetch activities'
    throw createError({ statusCode: 500, statusMessage: message })
  }
})
