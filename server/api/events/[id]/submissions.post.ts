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

    // Validate subtheme if provided
    if (body.subtheme) {
      const eventSubthemes = eventData.subthemes
        ? eventData.subthemes.split(',').map(s => s.trim())
        : []
      if (eventSubthemes.length > 0 && !eventSubthemes.includes(body.subtheme)) {
        throw createError({
          statusCode: 400,
          statusMessage:
            'Invalid subtheme selected. Please choose from the available subthemes for this event.',
        })
      }
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
      subtheme: body.subtheme,
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
      metadata: { submissionId, category: body.category, subtheme: body.subtheme },
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
