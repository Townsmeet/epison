import { eq } from 'drizzle-orm'
import { getRouterParam, createError } from 'h3'
import { db } from '../../../../utils/drizzle'
import { isH3Error } from '../../../../utils/errors'
import { abstractSubmission } from '../../../../db/schema'
import { requireAuthUser } from '../../../../utils/auth-helpers'
import { addActivity } from '../../../../utils/activity'

export default defineEventHandler(async eventHandler => {
  // Auth check
  requireAuthUser(eventHandler)

  const submissionId = getRouterParam(eventHandler, 'submissionId')
  if (!submissionId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Submission ID is required',
    })
  }

  try {
    // Check if submission exists and get its details for activity log
    const existingSubmission = await db
      .select()
      .from(abstractSubmission)
      .where(eq(abstractSubmission.id, submissionId))
      .limit(1)

    if (!existingSubmission.length) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Submission not found',
      })
    }

    const submission = existingSubmission[0]

    // Delete submission
    await db.delete(abstractSubmission).where(eq(abstractSubmission.id, submissionId))

    // Activity log
    await addActivity({
      type: 'Event',
      title: 'Submission deleted',
      description: `Submission "${submission.title}" was deleted`,
      entityType: 'submission',
      entityId: submissionId,
      metadata: { eventId: submission.eventId },
    })

    return {
      success: true,
      message: 'Submission deleted successfully',
    }
  } catch (error: unknown) {
    if (isH3Error(error)) throw error
    console.error('Error deleting submission:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to delete submission',
    })
  }
})
