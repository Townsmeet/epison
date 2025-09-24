import { eq } from 'drizzle-orm'
import { getRouterParam, createError } from 'h3'
import { db } from '../../../../utils/drizzle'
import { abstractSubmission } from '../../../../db/schema'
import { validateBody } from '../../../../validators'
import { z } from 'zod'

const updateSubmissionStatusSchema = z.object({
  status: z.enum(['pending', 'under_review', 'accepted', 'rejected', 'revision_required']),
  reviewerComments: z.string().max(2000).optional(),
})

export default defineEventHandler(async eventHandler => {
  // TODO: Add authentication check

  const submissionId = getRouterParam(eventHandler, 'submissionId')
  if (!submissionId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Submission ID is required',
    })
  }

  const body = await validateBody(
    eventHandler,
    updateSubmissionStatusSchema,
    'Invalid status update data'
  )

  try {
    // Check if submission exists
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

    // Update submission status
    await db
      .update(abstractSubmission)
      .set({
        status: body.status,
        reviewerComments: body.reviewerComments,
      })
      .where(eq(abstractSubmission.id, submissionId))

    // Return updated submission
    const updatedSubmission = await db
      .select()
      .from(abstractSubmission)
      .where(eq(abstractSubmission.id, submissionId))
      .limit(1)

    const submission = updatedSubmission[0]
    return {
      ...submission,
      authors: JSON.parse(submission.authorsJson),
      keywords: JSON.parse(submission.keywordsJson),
      correspondingAuthor: {
        name: submission.correspondingAuthorName,
        email: submission.correspondingAuthorEmail,
        affiliation: submission.correspondingAuthorAffiliation,
        phone: submission.correspondingAuthorPhone,
      },
    }
  } catch (error: unknown) {
    // Rethrow known H3 errors
    if (typeof error === 'object' && error && 'statusCode' in error) {
      throw error
    }
    console.error('Error updating submission status:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to update submission status',
    })
  }
})
