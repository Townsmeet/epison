import { eq } from 'drizzle-orm'
import { getRouterParam, createError } from 'h3'
import { db } from '../../../../utils/drizzle'
import { eventRegistration } from '../../../../db/schema'
import { validateBody } from '../../../../validators'
import { z } from 'zod'
import { addActivity } from '../../../../utils/activity'

const updateRegistrationStatusSchema = z.object({
  paymentStatus: z.enum(['Pending', 'Paid', 'Cancelled', 'Refunded']),
  notes: z.string().max(1000).optional(),
})

export default defineEventHandler(async eventHandler => {
  // TODO: Add authentication check

  const registrationId = getRouterParam(eventHandler, 'registrationId')
  if (!registrationId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Registration ID is required',
    })
  }

  const body = await validateBody(
    eventHandler,
    updateRegistrationStatusSchema,
    'Invalid status update data'
  )

  try {
    // Check if registration exists
    const existingRegistration = await db
      .select()
      .from(eventRegistration)
      .where(eq(eventRegistration.id, registrationId))
      .limit(1)

    if (!existingRegistration.length) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Registration not found',
      })
    }

    // Prepare update data with proper typing
    const updateData: Partial<typeof eventRegistration.$inferInsert> = {
      paymentStatus: body.paymentStatus,
      notes: body.notes,
    }

    // Set timestamp based on status change
    if (body.paymentStatus === 'Paid' && existingRegistration[0].paymentStatus !== 'Paid') {
      updateData.paidAt = new Date()
    }
    if (body.paymentStatus === 'Refunded' && existingRegistration[0].paymentStatus !== 'Refunded') {
      updateData.refundedAt = new Date()
    }

    // Update registration
    await db
      .update(eventRegistration)
      .set(updateData)
      .where(eq(eventRegistration.id, registrationId))

    // Activity log
    await addActivity({
      type: 'Payment',
      title: 'Registration payment status updated',
      description: `${existingRegistration[0].attendeeName} → ${body.paymentStatus}`,
      entityType: 'registration',
      entityId: registrationId,
      metadata: { previous: existingRegistration[0].paymentStatus, next: body.paymentStatus },
    })

    // Return updated registration
    const updatedRegistration = await db
      .select()
      .from(eventRegistration)
      .where(eq(eventRegistration.id, registrationId))
      .limit(1)

    return updatedRegistration[0]
  } catch (error: unknown) {
    if (typeof error === 'object' && error && 'statusCode' in error) {
      throw error
    }
    console.error('Error updating registration status:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to update registration status',
    })
  }
})
