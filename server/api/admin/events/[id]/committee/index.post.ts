import { eq } from 'drizzle-orm'
import { getRouterParam, createError } from 'h3'
import { db } from '../../../../../utils/drizzle'
import { isH3Error } from '../../../../../utils/errors'
import { event, eventCommitteeMember } from '../../../../../db/schema'
import { requireAuthUser } from '../../../../../utils/auth-helpers'
import { createEventCommitteeMemberSchema } from '../../../../../validators/event'
import { validateBody } from '../../../../../validators'

export default defineEventHandler(async eventHandler => {
  // Auth check
  requireAuthUser(eventHandler)

  const eventId = getRouterParam(eventHandler, 'id')
  if (!eventId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Event ID is required',
    })
  }

  const body = await validateBody(
    eventHandler,
    createEventCommitteeMemberSchema,
    'Invalid committee member data'
  )

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

    // Generate member ID
    const memberId = crypto.randomUUID()

    // Create committee member
    const memberData = {
      id: memberId,
      eventId,
      name: body.name,
      role: body.role,
      email: body.email,
      phone: body.phone,
      photoUrl: body.photoUrl,
      createdAt: new Date(),
    }

    await db.insert(eventCommitteeMember).values(memberData)

    // Return created member
    const createdMember = await db
      .select()
      .from(eventCommitteeMember)
      .where(eq(eventCommitteeMember.id, memberId))
      .limit(1)

    return createdMember[0]
  } catch (error: unknown) {
    if (isH3Error(error)) throw error
    console.error('Error creating committee member:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create committee member',
    })
  }
})
