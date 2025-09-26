import { eq } from 'drizzle-orm'
import { getRouterParam, createError } from 'h3'
import { db } from '../../../utils/drizzle'
import { isH3Error } from '../../../utils/errors'
import { event, abstractSubmission } from '../../../db/schema'
import { createAbstractSubmissionSchema } from '../../../validators/event'
import { addActivity } from '../../../utils/activity'
import { validateBody } from '../../../validators'

export default defineEventHandler(async eventHandler => {
  const eventId = getRouterParam(eventHandler, 'id')
  if (!eventId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Event ID is required',
    })
  }

  const body = await validateBody(
    eventHandler,
    createAbstractSubmissionSchema,
    'Invalid submission data'
  )

  try {
    // Check if event exists and accepts submissions
    const eventResult = await db.select().from(event).where(eq(event.id, eventId)).limit(1)

    if (!eventResult.length) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Event not found',
      })
    }

    const eventData = eventResult[0]

    if (!eventData.collectsSubmissions) {
      throw createError({
        statusCode: 400,
        statusMessage: 'This event does not accept abstract submissions',
      })
    }

    // Check if event is in a state that accepts submissions
    if (!['published', 'registration_open'].includes(eventData.status)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Abstract submissions are not currently open for this event',
      })
    }

    // Generate submission ID
    const submissionId = crypto.randomUUID()

    // Create submission record
    const submissionData = {
      id: submissionId,
      eventId,
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
      status: 'pending',
      submissionDate: new Date(),
    }

    await db.insert(abstractSubmission).values(submissionData)

    // Activity log
    await addActivity({
      type: 'Event',
      title: 'Abstract submitted',
      description: `${body.correspondingAuthor.name} submitted an abstract to ${eventData.title}`,
      entityType: 'event',
      entityId: eventId,
      metadata: { submissionId, category: body.category },
    })

    return {
      id: submissionId,
      eventId,
      title: body.title,
      status: 'pending',
      submissionDate: submissionData.submissionDate.toISOString(),
      message: 'Abstract submitted successfully and is pending review',
    }
  } catch (error: unknown) {
    if (isH3Error(error)) throw error
    console.error('Error creating submission:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to submit abstract',
    })
  }
})
