import type { H3Event } from 'h3'
import { getRouterParam, createError } from 'h3'
import { eq } from 'drizzle-orm'
import { db } from '../../../../../utils/drizzle'
import { ticketCategory } from '../../../../../db/schema'
import { requireAuthUser } from '../../../../../utils/auth-helpers'

export default defineEventHandler(async (eventHandler: H3Event) => {
  // Auth
  requireAuthUser(eventHandler)

  const eventId = getRouterParam(eventHandler, 'id')
  if (!eventId) {
    throw createError({ statusCode: 400, statusMessage: 'Event ID is required' })
  }

  try {
    const categories = await db
      .select()
      .from(ticketCategory)
      .where(eq(ticketCategory.eventId, eventId))
      .orderBy(ticketCategory.displayOrder, ticketCategory.createdAt)

    // Transform data to match TypeScript interfaces
    const transformedCategories = categories.map(category => ({
      ...category,
      description: category.description || undefined,
      createdAt: category.createdAt.toISOString(),
      updatedAt: category.updatedAt.toISOString(),
    }))

    return { data: transformedCategories }
  } catch (error: unknown) {
    console.error('Error fetching ticket categories:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch ticket categories',
    })
  }
})
