import { getRouterParam, createError } from 'h3'
import { z } from 'zod'
import { db } from '../../../../utils/drizzle'
import { eventRegistration } from '../../../../db/schema'
import { eq } from 'drizzle-orm'
import { requireAuthUser } from '../../../../utils/auth-helpers'

const bodySchema = z.object({
  paymentStatus: z.enum(['Pending', 'Paid', 'Cancelled', 'Refunded']),
})

export default defineEventHandler(async eventHandler => {
  // Auth
  requireAuthUser(eventHandler)

  const id = getRouterParam(eventHandler, 'id')
  if (!id) throw createError({ statusCode: 400, statusMessage: 'Registration ID is required' })

  const body = await readValidatedBody(eventHandler, input => bodySchema.parse(input))

  try {
    // ensure exists
    const existing = await db
      .select()
      .from(eventRegistration)
      .where(eq(eventRegistration.id, id))
      .limit(1)
    if (!existing.length) {
      throw createError({ statusCode: 404, statusMessage: 'Registration not found' })
    }

    const now = new Date()
    const set: Partial<typeof eventRegistration.$inferInsert> = {
      paymentStatus: body.paymentStatus,
    }
    if (body.paymentStatus === 'Paid') set.paidAt = now
    if (body.paymentStatus === 'Refunded') set.refundedAt = now

    await db.update(eventRegistration).set(set).where(eq(eventRegistration.id, id))

    const [updated] = await db
      .select()
      .from(eventRegistration)
      .where(eq(eventRegistration.id, id))
      .limit(1)

    return { success: true, data: updated }
  } catch (err) {
    if (typeof err === 'object' && err && 'statusCode' in err) throw err
    throw createError({ statusCode: 500, statusMessage: 'Failed to update registration status' })
  }
})
