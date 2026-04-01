import { inArray } from 'drizzle-orm'
import { createError, readBody } from 'h3'
import { db } from '../../../utils/drizzle'
import { isH3Error } from '../../../utils/errors'
import { eventRegistration } from '../../../db/schema'
import { addActivity } from '../../../utils/activity'
import { requireAuthUser } from '../../../utils/auth-helpers'
import { z } from 'zod'

const batchDeleteSchema = z.object({
  ids: z.array(z.string().min(1)).min(1),
})

export default defineEventHandler(async eventHandler => {
  // Auth check
  requireAuthUser(eventHandler)

  const body = await readBody(eventHandler)
  const { ids } = batchDeleteSchema.parse(body)

  try {
    // Delete registrations
    await db.delete(eventRegistration).where(inArray(eventRegistration.id, ids))

    // Activity log
    await addActivity({
      type: 'Registration',
      title: 'Batch registrations deleted',
      description: `${ids.length} registrations were deleted via batch action`,
      entityType: 'registration',
      metadata: { count: ids.length, ids },
    })

    return {
      success: true,
      message: `${ids.length} registrations deleted successfully`,
    }
  } catch (error: unknown) {
    if (isH3Error(error)) throw error
    console.error('Error batch deleting registrations:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to batch delete registrations',
    })
  }
})
