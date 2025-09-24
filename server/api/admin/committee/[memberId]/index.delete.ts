import { eq } from 'drizzle-orm'
import { getRouterParam, createError } from 'h3'
import { db } from '../../../../utils/drizzle'
import { isH3Error } from '../../../../utils/errors'
import { eventCommitteeMember } from '../../../../db/schema'

export default defineEventHandler(async eventHandler => {
  // TODO: Add authentication check

  const memberId = getRouterParam(eventHandler, 'memberId')
  if (!memberId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Member ID is required',
    })
  }

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

    // Delete member
    await db.delete(eventCommitteeMember).where(eq(eventCommitteeMember.id, memberId))

    return {
      success: true,
      message: 'Committee member deleted successfully',
    }
  } catch (error: unknown) {
    if (isH3Error(error)) throw error
    console.error('Error deleting committee member:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to delete committee member',
    })
  }
})
