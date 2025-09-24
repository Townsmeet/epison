import { eq } from 'drizzle-orm'
import { getRouterParam, createError } from 'h3'
import { db } from '../../../../../utils/drizzle'
import { isH3Error } from '../../../../../utils/errors'
import { event, eventSponsor } from '../../../../../db/schema'
import { createEventSponsorSchema } from '../../../../../validators/event'
import { validateBody } from '../../../../../validators'

export default defineEventHandler(async eventHandler => {
  // TODO: Add authentication check

  const eventId = getRouterParam(eventHandler, 'id')
  if (!eventId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Event ID is required',
    })
  }

  const body = await validateBody(eventHandler, createEventSponsorSchema, 'Invalid sponsor data')

  try {
    // Verify event exists
    const eventExists = await db
      .select({ id: event.id })
      .from(event)
      .where(eq(event.id, eventId))
      .limit(1)

    if (!eventExists.length) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Event not found',
      })
    }

    // Generate sponsor ID
    const sponsorId = crypto.randomUUID()

    // Create sponsor
    const sponsorData = {
      id: sponsorId,
      eventId,
      name: body.name,
      tier: body.tier,
      logoUrl: body.logoUrl,
      website: body.website,
      createdAt: new Date(),
    }

    await db.insert(eventSponsor).values(sponsorData)

    // Return created sponsor
    const createdSponsor = await db
      .select()
      .from(eventSponsor)
      .where(eq(eventSponsor.id, sponsorId))
      .limit(1)

    return createdSponsor[0]
  } catch (error: unknown) {
    if (isH3Error(error)) throw error
    console.error('Error creating sponsor:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create sponsor',
    })
  }
})
