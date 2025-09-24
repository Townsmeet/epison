import { eq } from 'drizzle-orm'
import { getRouterParam, createError } from 'h3'
import { db } from '../../../../../utils/drizzle'
import { isH3Error } from '../../../../../utils/errors'
import { eventCommitteeMember } from '../../../../../db/schema'
import { requireAuthUser } from '../../../../../utils/auth-helpers'

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

  try {
    const committee = await db
      .select()
      .from(eventCommitteeMember)
      .where(eq(eventCommitteeMember.eventId, eventId))
      .orderBy(eventCommitteeMember.createdAt)

    return { data: committee }
  } catch (error: unknown) {
    if (isH3Error(error)) throw error
    console.error('Error fetching committee members:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch committee members',
    })
  }
})
