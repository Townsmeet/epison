import { eq } from 'drizzle-orm'
import { createError } from 'h3'
import { db } from '../../../utils/drizzle'
import { isH3Error } from '../../../utils/errors'
import { event } from '../../../db/schema'
import { requireAuthUser } from '../../../utils/auth-helpers'
import { createEventSchema } from '../../../validators/event'
import { validateBody } from '../../../validators'

export default defineEventHandler(async eventHandler => {
  // Auth check
  requireAuthUser(eventHandler)

  const body = await validateBody(eventHandler, createEventSchema, 'Invalid event data')

  try {
    // Check if slug is unique
    const existingEvent = await db
      .select({ id: event.id })
      .from(event)
      .where(eq(event.slug, body.slug))
      .limit(1)

    if (existingEvent.length > 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Event slug already exists',
      })
    }

    // Generate event ID
    const eventId = crypto.randomUUID()

    // Create event
    const eventData = {
      id: eventId,
      slug: body.slug,
      title: body.title,
      type: body.type,
      status: body.status || 'draft',
      startDate: body.startDate,
      endDate: body.endDate,
      location: body.location,
      capacity: body.capacity,
      description: body.description,
      bannerUrl: body.bannerUrl,
      membersOnly: body.membersOnly || false,
      collectsSubmissions: body.collectsSubmissions || false,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    await db.insert(event).values(eventData)

    // Return created event
    const createdEvent = await db.select().from(event).where(eq(event.id, eventId)).limit(1)

    return createdEvent[0]
  } catch (error: unknown) {
    if (isH3Error(error)) throw error
    console.error('Error creating event:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create event',
    })
  }
})
