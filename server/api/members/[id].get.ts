import type { H3Event } from 'h3'
import { createError } from 'h3'
import { eq } from 'drizzle-orm'
import { db } from '../../utils/drizzle'
import { member, memberExpertise, memberPublication } from '../../db/schema'
import type { ApiResponse } from '../../../types/api'
import type { MemberDetail } from '../../../types/members'
import { validateParams } from '../../validators'
import { memberIdParamSchema } from '../../validators/member'

export default defineEventHandler(async (event: H3Event): Promise<ApiResponse<MemberDetail>> => {
  try {
    const params = validateParams(event, memberIdParamSchema, 'Invalid member ID')
    const memberId = params.id

    // Get member data
    const memberResult = await db.select().from(member).where(eq(member.id, memberId)).limit(1)

    if (!memberResult.length) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Member not found',
      })
    }

    const memberData = memberResult[0]

    // Get member expertise
    const expertiseResult = await db
      .select({ label: memberExpertise.label })
      .from(memberExpertise)
      .where(eq(memberExpertise.memberId, memberId))

    // Get member publications
    const publicationsResult = await db
      .select({ filename: memberPublication.filename })
      .from(memberPublication)
      .where(eq(memberPublication.memberId, memberId))

    // Parse other languages JSON
    let otherLanguages: string[] = []
    if (memberData.otherLanguagesJson) {
      try {
        otherLanguages = JSON.parse(memberData.otherLanguagesJson)
      } catch (error) {
        console.warn('Failed to parse otherLanguagesJson:', error)
        otherLanguages = []
      }
    }

    // Construct response
    const memberDetail: MemberDetail = {
      id: memberData.id,
      // Personal Information
      title: memberData.title ?? undefined,
      nameFamily: memberData.nameFamily,
      nameMiddle: memberData.nameMiddle ?? undefined,
      nameFirst: memberData.nameFirst,
      sex: memberData.sex ?? undefined,
      dob: memberData.dob ?? undefined,
      address: memberData.address ?? undefined,
      telephone: memberData.telephone ?? undefined,
      fax: memberData.fax ?? undefined,
      email: memberData.email,
      avatar: memberData.avatar ?? undefined,

      // Employment & Education
      position: memberData.position ?? undefined,
      employer: memberData.employer ?? undefined,
      department: memberData.department ?? undefined,
      qualifications: memberData.qualifications ?? undefined,
      experience: memberData.experience ?? undefined,

      // Languages
      motherTongue: memberData.motherTongue ?? undefined,
      otherLanguages,
      otherLanguageText: memberData.otherLanguageText ?? undefined,

      // Areas of Expertise
      expertiseDescription: memberData.expertiseDescription ?? undefined,
      expertise: expertiseResult.map(e => e.label),
      expertiseOther: memberData.expertiseOther ?? undefined,

      // Employment Classification
      agency: memberData.agency ?? undefined,
      typeOfWork: memberData.typeOfWork ?? undefined,
      typeOfWorkOther: memberData.typeOfWorkOther ?? undefined,
      retiredSince: memberData.retiredSince ?? undefined,

      // Membership Details
      membershipType: memberData.membershipType ?? '',
      status: memberData.status ?? 'pending',
      joinedDate: memberData.joinedDate ?? '',
      expiryDate: memberData.expiryDate ?? '',
      fees: memberData.fees ?? 0,
      paymentReference: memberData.paymentReference ?? undefined,

      // Related data
      publications: publicationsResult.map(p => p.filename),

      // Timestamps
      createdAt: memberData.createdAt.toISOString(),
      updatedAt: memberData.updatedAt.toISOString(),
    }

    return {
      success: true,
      data: memberDetail,
    }
  } catch (error: unknown) {
    console.error('Error fetching member:', error)

    if (typeof error === 'object' && error && 'statusCode' in error) throw error as unknown as Error

    return {
      success: false,
      error: 'Failed to fetch member details',
    }
  }
})
