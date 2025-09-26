import { eq, and } from 'drizzle-orm'
import { getRouterParam, createError } from 'h3'
import { db } from '../../../../../utils/drizzle'
import { isH3Error } from '../../../../../utils/errors'
import { eventCommitteeMember } from '../../../../../db/schema'
import { requireAuthUser } from '../../../../../utils/auth-helpers'

export default defineEventHandler(async eventHandler => {
  // Auth check
  requireAuthUser(eventHandler)

  const eventId = getRouterParam(eventHandler, 'id')
  const memberId = getRouterParam(eventHandler, 'memberId')

  if (!eventId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Event ID is required',
    })
  }

  if (!memberId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Member ID is required',
    })
  }

  try {
    // Check if committee member exists and belongs to the event
    const existingMember = await db
      .select({ id: eventCommitteeMember.id })
      .from(eventCommitteeMember)
      .where(and(eq(eventCommitteeMember.id, memberId), eq(eventCommitteeMember.eventId, eventId)))
      .limit(1)

    if (!existingMember.length) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Committee member not found',
      })
    }

    // Delete the committee member
    await db
      .delete(eventCommitteeMember)
      .where(and(eq(eventCommitteeMember.id, memberId), eq(eventCommitteeMember.eventId, eventId)))

    return { success: true, message: 'Committee member deleted successfully' }
  } catch (error: unknown) {
    if (isH3Error(error)) throw error
    console.error('Error deleting committee member:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to delete committee member',
    })
  }
})
