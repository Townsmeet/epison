import type { H3Event } from 'h3'
import { getRouterParam, createError } from 'h3'
import { eq } from 'drizzle-orm'
import { db } from '../../../utils/drizzle'
import { member, memberHistory } from '../../../db/schema'
import type { ApiResponse } from '../../../../types/api'
import { sendEmail } from '../../../utils/email'

export default defineEventHandler(
  async (event: H3Event): Promise<ApiResponse<{ sent: boolean }>> => {
    try {
      const memberId = getRouterParam(event, 'id')
      if (!memberId) {
        throw createError({ statusCode: 400, statusMessage: 'Member ID is required' })
      }

      const existing = await db.select().from(member).where(eq(member.id, memberId)).limit(1)
      if (!existing.length) {
        throw createError({ statusCode: 404, statusMessage: 'Member not found' })
      }

      const m = existing[0]

      const subject = 'EPISON Membership Renewal Reminder'
      const expiryText = m.expiryDate ? ` which expires on ${m.expiryDate}` : ''
      const htmlContent = `
      <!doctype html>
      <html>
        <body style="font-family: Arial, sans-serif; line-height:1.6; color:#111;">
          <h2>Membership Renewal Reminder</h2>
          <p>Dear ${m.nameFirst} ${m.nameFamily},</p>
          <p>This is a friendly reminder about your EPISON membership${expiryText}. To remain in good standing and retain access to member benefits, please renew your membership.</p>
          <p>You can renew from your dashboard or contact the EPISON Secretariat for assistance.</p>
          <p>Thank you,<br/>EPISON Secretariat</p>
        </body>
      </html>
    `

      await sendEmail({ to: m.email, subject, htmlContent })

      // Log activity/history
      await db.insert(memberHistory).values({
        id: `history_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`,
        memberId: m.id,
        action: 'Renewal reminder email sent',
        type: 'reminder',
        notes: `Reminder sent to ${m.email}`,
      })

      return { success: true, data: { sent: true }, message: 'Reminder email sent' }
    } catch (error: unknown) {
      console.error('Error sending reminder:', error)
      if (typeof error === 'object' && error && 'statusCode' in error)
        throw error as unknown as Error
      return { success: false, error: 'Failed to send reminder email' }
    }
  }
)
