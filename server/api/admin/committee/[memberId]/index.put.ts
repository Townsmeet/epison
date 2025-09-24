import { eq } from 'drizzle-orm'
import { getRouterParam, createError } from 'h3'
import { db } from '../../../../utils/drizzle'
import { isH3Error } from '../../../../utils/errors'
import { eventCommitteeMember } from '../../../../db/schema'
import { createEventCommitteeMemberSchema } from '../../../../validators/event'
import { validateBody } from '../../../../validators'

export default defineEventHandler(async eventHandler => {
  // TODO: Add authentication check

  const memberId = getRouterParam(eventHandler, 'memberId')
  if (!memberId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Member ID is required',
    })
  }

  const body = await validateBody(
    eventHandler,
    createEventCommitteeMemberSchema.partial(),
    'Invalid committee member data'
  )

  try {
    // Check if member exists
    const existingMember = await db
      .select()
      .from(eventCommitteeMember)
      .where(eq(eventCommitteeMember.id, memberId))
      .limit(1)

    if (!existingMember.length) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Committee member not found',
      })
    }

    // Update member
    await db.update(eventCommitteeMember).set(body).where(eq(eventCommitteeMember.id, memberId))

    // Return updated member
    const updatedMember = await db
      .select()
      .from(eventCommitteeMember)
      .where(eq(eventCommitteeMember.id, memberId))
      .limit(1)

    return updatedMember[0]
  } catch (error: unknown) {
    if (isH3Error(error)) throw error
    console.error('Error updating committee member:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to update committee member',
    })
  }
})
