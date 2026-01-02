import type { H3Event } from 'h3'
import { getRouterParam, createError } from 'h3'
import { eq } from 'drizzle-orm'
import { db } from '../../../../utils/drizzle'
import { member, memberHistory } from '../../../../db/schema'
import type { ApiResponse } from '../../../../../types/api'
import type { MemberDetail } from '../../../../../types/members'
import { validateBody } from '../../../../validators'
import { memberActionSchema } from '../../../../validators/member'
import { addActivity } from '../../../../utils/activity'
import { sendMembershipRenewalEmail } from '../../../../utils/event-email'

/**
 * Admin endpoint to renew a member's membership without payment.
 * Uses calendar-based expiry (December 31st of current year).
 */
export default defineEventHandler(async (event: H3Event): Promise<ApiResponse<MemberDetail>> => {
  try {
    const memberId = getRouterParam(event, 'id')
    const body = await validateBody(event, memberActionSchema, 'Invalid renewal request')

    if (!memberId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Member ID is required',
      })
    }

    // Check if member exists
    const existingMember = await db.select().from(member).where(eq(member.id, memberId)).limit(1)

    if (!existingMember.length) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Member not found',
      })
    }

    const memberData = existingMember[0]

    // Calendar-based expiry: always set to December 31st of the current year
    const now = new Date()
    const currentYear = now.getFullYear()
    const newExpiryDate = `${currentYear}-12-31`
    const oldExpiryDate = memberData.expiryDate || 'N/A'

    // Update member
    await db
      .update(member)
      .set({
        expiryDate: newExpiryDate,
        status: 'active', // Renewing activates the membership
      })
      .where(eq(member.id, memberId))

    // Create history entry
    await db.insert(memberHistory).values({
      id: `history_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      memberId,
      action: `Membership renewed by admin. Previous expiry: ${oldExpiryDate}. New expiry: ${newExpiryDate}`,
      type: 'renewal',
      notes: body.notes || 'Renewed via admin panel (no payment required)',
    })

    // Fetch updated member
    const updatedMember = await db.select().from(member).where(eq(member.id, memberId)).limit(1)
    const updatedMemberData = updatedMember[0]

    // Parse other languages JSON
    let otherLanguages: string[] = []
    if (updatedMemberData.otherLanguagesJson) {
      try {
        otherLanguages = JSON.parse(updatedMemberData.otherLanguagesJson)
      } catch (error) {
        console.warn('Failed to parse otherLanguagesJson:', error)
        otherLanguages = []
      }
    }

    const memberDetail: MemberDetail = {
      id: updatedMemberData.id,
      title: updatedMemberData.title ?? undefined,
      nameFamily: updatedMemberData.nameFamily,
      nameMiddle: updatedMemberData.nameMiddle ?? undefined,
      nameFirst: updatedMemberData.nameFirst,
      sex: updatedMemberData.sex ?? undefined,
      dob: updatedMemberData.dob ?? undefined,
      address: updatedMemberData.address ?? undefined,
      telephone: updatedMemberData.telephone ?? undefined,
      fax: updatedMemberData.fax ?? undefined,
      email: updatedMemberData.email,
      avatar: updatedMemberData.avatar ?? undefined,
      position: updatedMemberData.position ?? undefined,
      employer: updatedMemberData.employer ?? undefined,
      department: updatedMemberData.department ?? undefined,
      qualifications: updatedMemberData.qualifications ?? undefined,
      experience: updatedMemberData.experience ?? undefined,
      motherTongue: updatedMemberData.motherTongue ?? undefined,
      otherLanguages,
      otherLanguageText: updatedMemberData.otherLanguageText ?? undefined,
      expertiseDescription: updatedMemberData.expertiseDescription ?? undefined,
      expertise: [],
      expertiseOther: updatedMemberData.expertiseOther ?? undefined,
      agency: updatedMemberData.agency ?? undefined,
      typeOfWork: updatedMemberData.typeOfWork ?? undefined,
      typeOfWorkOther: updatedMemberData.typeOfWorkOther ?? undefined,
      retiredSince: updatedMemberData.retiredSince ?? undefined,
      membershipType: updatedMemberData.membershipType ?? '',
      status: updatedMemberData.status ?? 'pending',
      joinedDate: updatedMemberData.joinedDate ?? '',
      expiryDate: updatedMemberData.expiryDate ?? '',
      fees: updatedMemberData.fees ?? 0,
      paymentReference: updatedMemberData.paymentReference ?? undefined,
      publications: [],
      createdAt: updatedMemberData.createdAt.toISOString(),
      updatedAt: updatedMemberData.updatedAt.toISOString(),
    }

    // Activity log
    await addActivity({
      type: 'Membership',
      title: 'Membership renewed by admin',
      description: `${memberData.nameFirst} ${memberData.nameFamily} membership renewed until ${newExpiryDate}`,
      entityType: 'member',
      entityId: memberId!,
      metadata: { oldExpiryDate, newExpiryDate, renewedBy: 'admin' },
    })

    // Send renewal confirmation email
    await sendMembershipRenewalEmail({
      memberName:
        `${memberData.title || ''} ${memberData.nameFirst} ${memberData.nameFamily}`.trim(),
      memberEmail: memberData.email,
      membershipType: memberData.membershipType || 'Regular',
      memberId,
      paymentReference: 'ADMIN-RENEWAL',
      fees: 0,
      newExpiryDate,
    })

    return {
      success: true,
      data: memberDetail,
      message: `Membership renewed successfully. New expiry date: December 31, ${currentYear}`,
    }
  } catch (error: unknown) {
    console.error('Error renewing membership (admin):', error)
    if (typeof error === 'object' && error && 'statusCode' in error) throw error as unknown as Error

    return {
      success: false,
      error: 'Failed to renew membership',
    }
  }
})
