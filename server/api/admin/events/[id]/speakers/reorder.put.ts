import { eq, and } from 'drizzle-orm'
import { getRouterParam, readBody, createError } from 'h3'
import { db } from '../../../../../utils/drizzle'
import { isH3Error } from '../../../../../utils/errors'
import { eventSpeaker } from '../../../../../db/schema'
import { z } from 'zod'

const reorderSchema = z.object({
  speakerIds: z.array(z.string()),
})

export default defineEventHandler(async eventHandler => {
  // TODO: Add authentication check

  const eventId = getRouterParam(eventHandler, 'id')
  if (!eventId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Event ID is required',
    })
  }

  try {
    const body = await readBody(eventHandler)
    const { speakerIds } = reorderSchema.parse(body)

    // Update each speaker's displayOrder based on their index in the array
    await db.transaction(async tx => {
      for (let i = 0; i < speakerIds.length; i++) {
        await tx
          .update(eventSpeaker)
          .set({ displayOrder: i })
          .where(and(eq(eventSpeaker.id, speakerIds[i]), eq(eventSpeaker.eventId, eventId)))
      }
    })

    return {
      success: true,
      message: 'Speakers reordered successfully',
    }
  } catch (error: unknown) {
    if (isH3Error(error)) throw error
    if (error instanceof z.ZodError) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid input',
        data: error.errors,
      })
    }
    console.error('Error reordering event speakers:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to reorder event speakers',
    })
  }
})
