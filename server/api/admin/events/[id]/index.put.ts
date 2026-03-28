import { eq } from 'drizzle-orm'
import { getRouterParam, createError } from 'h3'
import { db } from '../../../../utils/drizzle'
import { isH3Error } from '../../../../utils/errors'
import { event, member } from '../../../../db/schema'
import { updateEventSchema } from '../../../../validators/event'
import { addActivity } from '../../../../utils/activity'
import { requireAuthUser } from '../../../../utils/auth-helpers'
import { validateBody } from '../../../../validators'
import { sendNewEventNotificationToMembers } from '../../../../utils/event-email'

export default defineEventHandler(async eventHandler => {
  const auth = requireAuthUser(eventHandler)
  // Auth check done above

  const eventId = getRouterParam(eventHandler, 'id')
  if (!eventId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Event ID is required',
    })
  }

  const body = await validateBody(eventHandler, updateEventSchema, 'Invalid event data')

  try {
    // Check if event exists
    const existingEvent = await db.select().from(event).where(eq(event.id, eventId)).limit(1)

    if (!existingEvent.length) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Event not found',
      })
    }

    // Update event
    const { subthemes, submissionDates, ...rest } = body

    const updateData: Partial<typeof event.$inferInsert> = {
      ...rest,
      theme: body.theme,
      subthemes: subthemes ? subthemes.join(',') : null,
      submissionGuidelines: body.submissionGuidelines ?? null,
      submissionDatesJson: submissionDates ? JSON.stringify(submissionDates) : null,
      updatedAt: new Date(),
    }

    // Trigger notifications if status changes to published and not already sent
    if (body.status === 'published' && !existingEvent[0].notificationSent) {
      try {
        const activeMembers = await db
          .select({ email: member.email })
          .from(member)
          .where(eq(member.status, 'active'))

        const filteredEmails = activeMembers
          .map(m => m.email)
          .filter(email => !email.toLowerCase().endsWith('@epison.ng'))

        if (filteredEmails.length > 0) {
          const config = useRuntimeConfig()
          const eventUrl = `${config.public.siteUrl}/events/${existingEvent[0].slug}`

          sendNewEventNotificationToMembers({
            eventTitle: body.title || existingEvent[0].title,
            eventDate: body.startDate || existingEvent[0].startDate,
            eventLocation: body.location || existingEvent[0].location,
            eventDescription: body.description || existingEvent[0].description,
            eventUrl,
            memberEmails: filteredEmails,
          }).catch(err => {
            console.error('[Notification] Background event update notification failed:', err)
          })

          updateData.notificationSent = true
        }
      } catch (err) {
        console.error('[Notification] Failed to initiate event update notifications:', err)
      }
    }

    await db.update(event).set(updateData).where(eq(event.id, eventId))

    await addActivity({
      type: 'Event',
      title: 'Event updated',
      description: `${existingEvent[0].title} updated`,
      actorId: auth.userId,
      entityType: 'event',
      entityId: eventId,
      metadata: updateData,
    })

    // Return updated event
    const updatedEvent = await db.select().from(event).where(eq(event.id, eventId)).limit(1)

    return updatedEvent[0]
  } catch (error: unknown) {
    if (isH3Error(error)) throw error
    console.error('Error updating event:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to update event',
    })
  }
})
