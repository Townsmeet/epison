import { eq } from 'drizzle-orm'
import { getRouterParam, createError } from 'h3'
import { db } from '../../../../utils/drizzle'
import { isH3Error } from '../../../../utils/errors'
import { abstractSubmission } from '../../../../db/schema'
import { requireAuthUser } from '../../../../utils/auth-helpers'

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
    const submission = await db
      .select()
      .from(abstractSubmission)
      .where(eq(abstractSubmission.id, submissionId))
      .limit(1)

    if (!submission.length) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Submission not found',
      })
    }

    const sub = submission[0]

    // Parse JSON fields for response
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
      subtheme: sub.subtheme,
      notes: sub.notes,
      submissionDate: sub.submissionDate.toISOString(),
      status: sub.status,
      reviewerComments: sub.reviewerComments,
    }

    return {
      success: true,
      data: parsedSubmission,
    }
  } catch (error: unknown) {
    if (isH3Error(error)) throw error
    console.error('Error fetching submission:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch submission',
    })
  }
})
