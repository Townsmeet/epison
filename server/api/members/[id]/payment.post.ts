import type { H3Event } from 'h3'
import { createError, getRouterParam } from 'h3'
import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { db } from '../../../utils/drizzle'
import { member } from '../../../db/schema'
import type { ApiResponse } from '../../../../types/api'
import { validateBody } from '../../../validators'
import { addActivity } from '../../../utils/activity'

const paymentUpdateSchema = z.object({
  paymentReference: z.string().min(1, 'Payment reference is required'),
})

export default defineEventHandler(
  async (event: H3Event): Promise<ApiResponse<{ success: boolean }>> => {
    try {
      const memberId = getRouterParam(event, 'id')
      if (!memberId) {
        throw createError({ statusCode: 400, statusMessage: 'Member ID is required' })
      }

      const body = await validateBody(event, paymentUpdateSchema, 'Invalid payment data')

      // Check if member exists
      const existingMember = await db
        .select({
          id: member.id,
          nameFirst: member.nameFirst,
          nameFamily: member.nameFamily,
          email: member.email,
          membershipType: member.membershipType,
          paymentReference: member.paymentReference,
        })
        .from(member)
        .where(eq(member.id, memberId))
        .limit(1)

      if (!existingMember.length) {
        throw createError({ statusCode: 404, statusMessage: 'Member not found' })
      }

      const memberData = existingMember[0]

      // Check if payment reference already exists (prevent duplicate payments)
      if (memberData.paymentReference) {
        return {
          success: true,
          message: 'Payment already recorded for this application',
          data: { success: true },
        }
      }

      // Update member with payment reference
      await db
        .update(member)
        .set({
          paymentReference: body.paymentReference,
          updatedAt: new Date(),
        })
        .where(eq(member.id, memberId))

      // Log activity
      await addActivity({
        type: 'Payment',
        title: 'Payment received',
        description: `Payment confirmed for ${memberData.nameFirst} ${memberData.nameFamily}`,
        entityType: 'member',
        entityId: memberId,
        metadata: {
          paymentReference: body.paymentReference,
          membershipType: memberData.membershipType,
          email: memberData.email,
        },
      })

      // TODO: Send success email notification here
      // Example implementation:
      // await sendPaymentSuccessEmail(memberData.email, {
      //   name: `${memberData.nameFirst} ${memberData.nameFamily}`,
      //   paymentReference: body.paymentReference,
      //   membershipType: memberData.membershipType,
      //   message: 'Your payment has been received and your application is under review.'
      // })

      console.log(`Payment success email should be sent to: ${memberData.email}`)
      console.log(`Payment reference: ${body.paymentReference}`)
      console.log(`Member: ${memberData.nameFirst} ${memberData.nameFamily}`)

      return {
        success: true,
        message: 'Payment recorded successfully',
        data: { success: true },
      }
    } catch (error: unknown) {
      console.error('Error updating payment:', error)
      if (typeof error === 'object' && error && 'statusCode' in error) {
        throw error as unknown as Error
      }

      return {
        success: false,
        error: 'Failed to update payment information',
      }
    }
  }
)
