import { eq } from 'drizzle-orm'
import { getRouterParam, createError } from 'h3'
import { db } from '../../../../utils/drizzle'
import { isH3Error } from '../../../../utils/errors'
import { eventRegistration } from '../../../../db/schema'
import { addActivity } from '../../../../utils/activity'
import { requireAuthUser } from '../../../../utils/auth-helpers'

export default defineEventHandler(async eventHandler => {
  // Auth check
  requireAuthUser(eventHandler)

  const id = getRouterParam(eventHandler, 'id')
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Registration ID is required',
    })
  }

  try {
    // Check if registration exists
    const existingRegistration = await db
      .select()
      .from(eventRegistration)
      .where(eq(eventRegistration.id, id))
      .limit(1)

    if (!existingRegistration.length) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Registration not found',
      })
    }

    const reg = existingRegistration[0]

    // Delete registration
    await db.delete(eventRegistration).where(eq(eventRegistration.id, id))

    // Activity log
    await addActivity({
      type: 'Registration',
      title: 'Registration deleted',
      description: `Registration for ${reg.attendeeName} (${reg.attendeeEmail}) was deleted`,
      entityType: 'registration',
      entityId: id,
      metadata: {
        attendeeName: reg.attendeeName,
        attendeeEmail: reg.attendeeEmail,
        eventId: reg.eventId,
      },
    })

    return {
      success: true,
      message: 'Registration deleted successfully',
    }
  } catch (error: unknown) {
    if (isH3Error(error)) throw error
    console.error('Error deleting registration:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to delete registration',
    })
  }
})
