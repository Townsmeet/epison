import type { H3Event } from 'h3'
import { getRouterParam, createError } from 'h3'
import { eq } from 'drizzle-orm'
import { db } from '../../../utils/drizzle'
import { member, memberHistory } from '../../../db/schema'
import type { ApiResponse } from '../../../../types/api'
import type { MemberActionRequest, MemberDetail } from '../../../../types/members'
import { validateBody } from '../../../validators'
import { memberActionSchema } from '../../../validators/member'
import { addActivity } from '../../../utils/activity'

export default defineEventHandler(async (event: H3Event): Promise<ApiResponse<MemberDetail>> => {
  try {
    const memberId = getRouterParam(event, 'id')
    const body = (await validateBody(
      event,
      memberActionSchema,
      'Invalid activation request'
    )) as MemberActionRequest

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

    // Check if member is already active
    if (memberData.status === 'active') {
      throw createError({
        statusCode: 400,
        statusMessage: 'Member is already active',
      })
    }

    // Update member status to active
    await db.update(member).set({ status: 'active' }).where(eq(member.id, memberId))

    // Create history entry
    await db.insert(memberHistory).values({
      id: `history_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      memberId,
      action: 'Member activated',
      type: 'status_change',
      notes: body.reason || body.notes || 'Member account activated by administrator',
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
      // Personal Information
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

      // Employment & Education
      position: updatedMemberData.position ?? undefined,
      employer: updatedMemberData.employer ?? undefined,
      department: updatedMemberData.department ?? undefined,
      qualifications: updatedMemberData.qualifications ?? undefined,
      experience: updatedMemberData.experience ?? undefined,

      // Languages
      motherTongue: updatedMemberData.motherTongue ?? undefined,
      otherLanguages,
      otherLanguageText: updatedMemberData.otherLanguageText ?? undefined,

      // Areas of Expertise
      expertiseDescription: updatedMemberData.expertiseDescription ?? undefined,
      expertise: [], // Would need separate query
      expertiseOther: updatedMemberData.expertiseOther ?? undefined,

      // Employment Classification
      agency: updatedMemberData.agency ?? undefined,
      typeOfWork: updatedMemberData.typeOfWork ?? undefined,
      typeOfWorkOther: updatedMemberData.typeOfWorkOther ?? undefined,
      retiredSince: updatedMemberData.retiredSince ?? undefined,

      // Membership Details
      membershipType: updatedMemberData.membershipType ?? '',
      status: updatedMemberData.status ?? 'pending',
      joinedDate: updatedMemberData.joinedDate ?? '',
      expiryDate: updatedMemberData.expiryDate ?? '',
      fees: updatedMemberData.fees ?? 0,
      paymentReference: updatedMemberData.paymentReference ?? undefined,

      // Related data
      publications: [], // Would need separate query

      // Timestamps
      createdAt: updatedMemberData.createdAt.toISOString(),
      updatedAt: updatedMemberData.updatedAt.toISOString(),
    }

    // Activity log
    await addActivity({
      type: 'Membership',
      title: 'Member activated',
      description: `${memberData.nameFirst} ${memberData.nameFamily} activated`,
      entityType: 'member',
      entityId: memberId,
      metadata: { email: updatedMemberData.email },
    })

    return {
      success: true,
      data: memberDetail,
      message: `Member ${memberData.nameFirst} ${memberData.nameFamily} has been activated`,
    }
  } catch (error: unknown) {
    console.error('Error activating member:', error)
    // Re-throw H3 errors
    if (typeof error === 'object' && error && 'statusCode' in error) throw error as unknown as Error

    return {
      success: false,
      error: 'Failed to activate member',
    }
  }
})
