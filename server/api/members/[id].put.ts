import type { H3Event } from 'h3'
import { getRouterParam, createError } from 'h3'
import { eq } from 'drizzle-orm'
import { db } from '../../utils/drizzle'
import { member, memberExpertise, memberHistory, memberPublication } from '../../db/schema'
import type { ApiResponse } from '../../../types/api'
import type { UpdateMemberRequest, MemberDetail } from '../../../types/members'
import { validateBody } from '../../validators'
import { updateMemberSchema } from '../../validators/member'
import { addActivity } from '../../utils/activity'

export default defineEventHandler(async (event: H3Event): Promise<ApiResponse<MemberDetail>> => {
  try {
    const memberId = getRouterParam(event, 'id')
    const body = (await validateBody(
      event,
      updateMemberSchema,
      'Invalid member update data'
    )) as UpdateMemberRequest

    // Debug log the incoming request body
    console.log('Incoming member update request with body:', JSON.stringify(body, null, 2))

    if (!memberId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Member ID is required',
      })
    }

    // Check if member exists
    const existingMember = await db
      .select({ id: member.id, email: member.email })
      .from(member)
      .where(eq(member.id, memberId))
      .limit(1)

    if (!existingMember.length) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Member not found',
      })
    }

    // Check if email is being changed and if it conflicts with another member
    if (body.email && body.email !== existingMember[0].email) {
      const emailConflict = await db
        .select({ id: member.id })
        .from(member)
        .where(eq(member.email, body.email))
        .limit(1)

      if (emailConflict.length > 0) {
        throw createError({
          statusCode: 409,
          statusMessage: 'A member with this email already exists',
        })
      }
    }

    // Prepare update data (only include fields that are provided)
    const updateData: Record<string, unknown> = {}

    // Personal Information
    if (body.title !== undefined) updateData.title = body.title
    if (body.nameFamily !== undefined) updateData.nameFamily = body.nameFamily
    if (body.nameMiddle !== undefined) updateData.nameMiddle = body.nameMiddle
    if (body.nameFirst !== undefined) updateData.nameFirst = body.nameFirst
    if (body.sex !== undefined) updateData.sex = body.sex
    if (body.dob !== undefined) updateData.dob = body.dob
    if (body.address !== undefined) updateData.address = body.address
    if (body.telephone !== undefined) updateData.telephone = body.telephone
    if (body.fax !== undefined) updateData.fax = body.fax
    if (body.email !== undefined) updateData.email = body.email
    if (body.avatar !== undefined) updateData.avatar = body.avatar

    // Employment & Education
    if (body.position !== undefined) updateData.position = body.position
    if (body.employer !== undefined) updateData.employer = body.employer
    if (body.department !== undefined) updateData.department = body.department
    if (body.qualifications !== undefined) updateData.qualifications = body.qualifications
    if (body.experience !== undefined) updateData.experience = body.experience

    // Languages
    if (body.motherTongue !== undefined) updateData.motherTongue = body.motherTongue
    if (body.otherLanguages !== undefined)
      updateData.otherLanguagesJson = JSON.stringify(body.otherLanguages)
    if (body.otherLanguageText !== undefined) updateData.otherLanguageText = body.otherLanguageText

    // Areas of Expertise
    if (body.expertiseDescription !== undefined)
      updateData.expertiseDescription = body.expertiseDescription
    if (body.expertiseOther !== undefined) updateData.expertiseOther = body.expertiseOther

    // Employment Classification
    if (body.agency !== undefined) updateData.agency = body.agency
    if (body.typeOfWork !== undefined) updateData.typeOfWork = body.typeOfWork
    if (body.typeOfWorkOther !== undefined) updateData.typeOfWorkOther = body.typeOfWorkOther
    if (body.retiredSince !== undefined) updateData.retiredSince = body.retiredSince

    // Membership Details
    if (body.membershipType !== undefined) updateData.membershipType = body.membershipType
    if (body.fees !== undefined) updateData.fees = body.fees
    if (body.paymentReference !== undefined) updateData.paymentReference = body.paymentReference

    // Update member if there are changes
    if (Object.keys(updateData).length > 0) {
      await db.update(member).set(updateData).where(eq(member.id, memberId))
    }

    // Update expertise if provided
    if (body.expertise !== undefined) {
      // Delete existing expertise
      await db.delete(memberExpertise).where(eq(memberExpertise.memberId, memberId))

      // Insert new expertise
      if (body.expertise.length > 0) {
        const expertiseInserts = body.expertise.map(label => ({
          id: `expertise_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          memberId,
          label,
        }))

        await db.insert(memberExpertise).values(expertiseInserts)
      }
    }

    // If publications provided, replace existing publications
    if (body.publications !== undefined) {
      // Delete existing
      await db.delete(memberPublication).where(eq(memberPublication.memberId, memberId))

      // Insert new
      if (body.publications.length > 0) {
        const pubInserts = body.publications.map(filename => ({
          id: `pub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          memberId,
          filename,
        }))
        await db.insert(memberPublication).values(pubInserts)
      }
    }

    // Create history entry
    await db.insert(memberHistory).values({
      id: `history_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      memberId,
      action: 'Member information updated',
      type: 'update',
      notes: 'Member details were modified',
    })

    // Fetch updated member with all related data
    const updatedMember = await db.select().from(member).where(eq(member.id, memberId)).limit(1)

    const expertiseResult = await db
      .select({ label: memberExpertise.label })
      .from(memberExpertise)
      .where(eq(memberExpertise.memberId, memberId))

    const memberData = updatedMember[0]

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

    // Query publications
    const publicationsResult = await db
      .select({ filename: memberPublication.filename })
      .from(memberPublication)
      .where(eq(memberPublication.memberId, memberId))

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

    // Activity log
    await addActivity({
      type: 'Membership',
      title: 'Member updated',
      description: `${memberData.nameFirst} ${memberData.nameFamily} profile updated`,
      entityType: 'member',
      entityId: memberId,
      metadata: { updatedFields: Object.keys(updateData) },
    })

    return {
      success: true,
      data: memberDetail,
      message: 'Member updated successfully',
    }
  } catch (error: unknown) {
    console.error('Error updating member:', error)

    if (typeof error === 'object' && error && 'statusCode' in error) throw error as unknown as Error

    return {
      success: false,
      error: 'Failed to update member',
    }
  }
})
