import type { H3Event } from 'h3'
import { getRouterParam, createError } from 'h3'
import { eq } from 'drizzle-orm'
import { db } from '../../../../../utils/drizzle'
import { isH3Error } from '../../../../../utils/errors'
import { event, ticketCategory } from '../../../../../db/schema'
import { createTicketCategorySchema } from '../../../../../validators/event'
import { addActivity } from '../../../../../utils/activity'
import { validateBody } from '../../../../../validators'
import { requireAuthUser } from '../../../../../utils/auth-helpers'

export default defineEventHandler(async (eventHandler: H3Event) => {
  // Auth
  requireAuthUser(eventHandler)

  const eventId = getRouterParam(eventHandler, 'id')
  if (!eventId) {
    throw createError({ statusCode: 400, statusMessage: 'Event ID is required' })
  }

  const body = await validateBody(eventHandler, createTicketCategorySchema, 'Invalid category data')

  try {
    // Verify event exists
    const eventExists = await db
      .select({ id: event.id })
      .from(event)
      .where(eq(event.id, eventId))
      .limit(1)
    if (!eventExists.length) {
      throw createError({ statusCode: 404, statusMessage: 'Event not found' })
    }

    // Generate category ID
    const categoryId = crypto.randomUUID()

    // Create category data
    const categoryData = {
      id: categoryId,
      eventId,
      name: body.name,
      description: body.description || null,
      displayOrder: body.displayOrder,
    }

    await db.insert(ticketCategory).values(categoryData)

    // Activity log
    await addActivity({
      type: 'Event',
      title: 'Ticket category created',
      description: `Category "${body.name}" created for event`,
      entityType: 'event',
      entityId: eventId,
      metadata: { categoryName: body.name },
    })

    // Return created category
    const createdCategory = await db
      .select()
      .from(ticketCategory)
      .where(eq(ticketCategory.id, categoryId))
      .limit(1)

    return createdCategory[0]
  } catch (error: unknown) {
    if (isH3Error(error)) throw error

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create ticket category',
    })
  }
})
