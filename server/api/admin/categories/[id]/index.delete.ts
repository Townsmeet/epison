import type { H3Event } from 'h3'
import { getRouterParam, createError } from 'h3'
import { eq } from 'drizzle-orm'
import { db } from '../../../../utils/drizzle'
import { isH3Error } from '../../../../utils/errors'
import { ticketCategory, eventTicket } from '../../../../db/schema'
import { requireAuthUser } from '../../../../utils/auth-helpers'
import { addActivity } from '../../../../utils/activity'

export default defineEventHandler(async (eventHandler: H3Event) => {
  // Auth
  requireAuthUser(eventHandler)

  const categoryId = getRouterParam(eventHandler, 'id')
  if (!categoryId) {
    throw createError({ statusCode: 400, statusMessage: 'Category ID is required' })
  }

  try {
    const existingCategory = await db
      .select()
      .from(ticketCategory)
      .where(eq(ticketCategory.id, categoryId))
      .limit(1)

    if (!existingCategory.length) {
      throw createError({ statusCode: 404, statusMessage: 'Category not found' })
    }

    const category = existingCategory[0]

    // Move tickets in this category to uncategorized (set categoryId to null)
    await db
      .update(eventTicket)
      .set({ categoryId: null, updatedAt: new Date() })
      .where(eq(eventTicket.categoryId, categoryId))

    // Delete category
    await db.delete(ticketCategory).where(eq(ticketCategory.id, categoryId))

    // Activity log
    await addActivity({
      type: 'Event',
      title: 'Ticket category deleted',
      description: `Category "${category.name}" deleted, tickets moved to uncategorized`,
      entityType: 'event',
      entityId: category.eventId,
      metadata: { categoryName: category.name },
    })

    return {
      success: true,
      message: 'Category deleted successfully',
    }
  } catch (error: unknown) {
    if (isH3Error(error)) throw error

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to delete category',
    })
  }
})
