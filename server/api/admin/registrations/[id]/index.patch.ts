import { eq } from 'drizzle-orm'
import { getRouterParam, createError } from 'h3'
import { db } from '../../../../utils/drizzle'
import { eventRegistration } from '../../../../db/schema'
import { validateBody } from '../../../../validators'
import { z } from 'zod'
import { addActivity } from '../../../../utils/activity'
import { requireAuthUser } from '../../../../utils/auth-helpers'

const updateRegistrationSchema = z.object({
  attendeeName: z.string().min(1, 'Name is required'),
  attendeeEmail: z.string().email('Invalid email address'),
  attendeePhone: z.string().optional().nullable(),
  attendeeOrg: z.string().optional().nullable(),
  category: z.string().optional().nullable(),
  paymentStatus: z.enum(['Pending', 'Paid', 'Cancelled', 'Refunded']).optional(),
  paymentProvider: z.string().optional().nullable(),
  reference: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  unitPrice: z.number().nonnegative().optional(),
})

export default defineEventHandler(async eventHandler => {
  // Auth check
  requireAuthUser(eventHandler)

  const id = getRouterParam(eventHandler, 'id')
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Registration ID is required',
    })
  }

  const body = await validateBody(
    eventHandler,
    updateRegistrationSchema,
    'Invalid registration update data'
  )

  try {
    // Check if registration exists
    const existing = await db
      .select()
      .from(eventRegistration)
      .where(eq(eventRegistration.id, id))
      .limit(1)

    if (!existing.length) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Registration not found',
      })
    }

    const reg = existing[0]

    // Prepare update data
    const updateData: Partial<typeof eventRegistration.$inferInsert> = {
      attendeeName: body.attendeeName,
      attendeeEmail: body.attendeeEmail,
      attendeePhone: body.attendeePhone ?? null,
      attendeeOrg: body.attendeeOrg ?? null,
      category: body.category ?? null,
      paymentProvider: body.paymentProvider ?? null,
      reference: body.reference ?? null,
      notes: body.notes ?? null,
    }

    if (body.paymentStatus) {
      updateData.paymentStatus = body.paymentStatus
      if (body.paymentStatus === 'Paid' && reg.paymentStatus !== 'Paid') {
        updateData.paidAt = new Date()
      }
      if (body.paymentStatus === 'Refunded' && reg.paymentStatus !== 'Refunded') {
        updateData.refundedAt = new Date()
      }
    }

    if (body.unitPrice !== undefined) {
      // unitPrice is stored in kobo, convert Naira from UI to kobo
      const priceInKobo = Math.round(body.unitPrice * 100)
      updateData.unitPrice = priceInKobo
      updateData.totalAmount = priceInKobo * reg.quantity
    }

    // Update registration
    await db.update(eventRegistration).set(updateData).where(eq(eventRegistration.id, id))

    // Activity log
    await addActivity({
      type: 'Registration',
      title: 'Registration updated',
      description: `Updated registration for ${body.attendeeName}`,
      entityType: 'registration',
      entityId: id,
    })

    // Return updated registration
    const updated = await db
      .select()
      .from(eventRegistration)
      .where(eq(eventRegistration.id, id))
      .limit(1)

    return {
      success: true,
      data: updated[0],
    }
  } catch (error: unknown) {
    if (typeof error === 'object' && error && 'statusCode' in error) {
      throw error
    }
    console.error('Error updating registration:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to update registration',
    })
  }
})
