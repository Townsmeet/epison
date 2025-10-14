import { eq } from 'drizzle-orm'
import { getRouterParam, createError } from 'h3'
import { db } from '../../../../utils/drizzle'
import { isH3Error } from '../../../../utils/errors'
import { abstractSubmission } from '../../../../db/schema'
import { requireAuthUser } from '../../../../utils/auth-helpers'
import { updateSubmissionSchema } from '../../../../validators/event'
import { validateBody } from '../../../../validators'
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

  const body = await validateBody(eventHandler, updateSubmissionSchema, 'Invalid submission data')

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

    const oldSubmission = existingSubmission[0]

    // Update submission
    const updateData: {
      title?: string
      abstract?: string
      authorsJson?: string
      correspondingAuthorName?: string
      correspondingAuthorEmail?: string
      correspondingAuthorAffiliation?: string
      correspondingAuthorPhone?: string
      keywordsJson?: string
      category?: string
      notes?: string
      status?: string
      reviewerComments?: string
    } = {
      title: body.title,
      abstract: body.abstract,
      authorsJson: JSON.stringify(body.authors),
      correspondingAuthorName: body.correspondingAuthor.name,
      correspondingAuthorEmail: body.correspondingAuthor.email,
      correspondingAuthorAffiliation: body.correspondingAuthor.affiliation,
      correspondingAuthorPhone: body.correspondingAuthor.phone,
      keywordsJson: JSON.stringify(body.keywords),
      category: body.category,
      notes: body.notes,
    }

    // Only update status and reviewer comments if provided
    if (body.status) {
      updateData.status = body.status
    }
    if (body.reviewerComments !== undefined) {
      updateData.reviewerComments = body.reviewerComments
    }

    await db
      .update(abstractSubmission)
      .set(updateData)
      .where(eq(abstractSubmission.id, submissionId))

    // Activity log
    await addActivity({
      type: 'Event',
      title: 'Submission updated',
      description: `Submission "${body.title}" was updated`,
      entityType: 'submission',
      entityId: submissionId,
      metadata: { oldStatus: oldSubmission.status, newStatus: body.status },
    })

    // Return updated submission
    const updatedSubmission = await db
      .select()
      .from(abstractSubmission)
      .where(eq(abstractSubmission.id, submissionId))
      .limit(1)

    const sub = updatedSubmission[0]

    const parsedSubmission = {
      id: sub.id,
      eventId: sub.eventId,
      title: sub.title,
      abstract: sub.abstract,
      authors: JSON.parse(sub.authorsJson),
      correspondingAuthor: {
        name: sub.correspondingAuthorName,
        email: sub.correspondingAuthorEmail,
        affiliation: sub.correspondingAuthorAffiliation,
        phone: sub.correspondingAuthorPhone,
      },
      keywords: JSON.parse(sub.keywordsJson),
      category: sub.category,
      notes: sub.notes,
      submissionDate: sub.submissionDate.toISOString(),
      status: sub.status,
      reviewerComments: sub.reviewerComments,
    }

    return {
      success: true,
      data: parsedSubmission,
      message: 'Submission updated successfully',
    }
  } catch (error: unknown) {
    if (isH3Error(error)) throw error
    console.error('Error updating submission:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to update submission',
    })
  }
})
