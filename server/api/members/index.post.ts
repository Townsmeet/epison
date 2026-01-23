import type { H3Event } from 'h3'
import { createError } from 'h3'
import { eq } from 'drizzle-orm'
import { db } from '../../utils/drizzle'
import { member, memberExpertise, memberPublication, memberHistory } from '../../db/schema'
import type { ApiResponse } from '../../../types/api'
import type { CreateMemberRequest, MemberDetail } from '../../../types/members'
import { validateBody } from '../../validators'
import { createMemberSchema } from '../../validators/member'
import { addActivity } from '../../utils/activity'
import { sendMembershipApplicationEmail } from '../../utils/event-email'

export default defineEventHandler(async (event: H3Event): Promise<ApiResponse<MemberDetail>> => {
  try {
    const body = (await validateBody(
      event,
      createMemberSchema,
      'Invalid member data'
    )) as CreateMemberRequest

    // Debug log the incoming request body
    console.log('Incoming member creation request with body:', JSON.stringify(body, null, 2))

    // Check if email already exists
    const existingMember = await db
      .select({ id: member.id })
      .from(member)
      .where(eq(member.email, body.email))
      .limit(1)

    if (existingMember.length > 0) {
      throw createError({
        statusCode: 409,
        statusMessage: 'A member with this email already exists',
      })
    }

    // Generate member ID
    const memberId = `member_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // Set default dates - Calendar-based expiry (December 31st of current year)
    const now = new Date()
    const joinedDate = now.toISOString().split('T')[0]
    const currentYear = now.getFullYear()
    const expiryDate = `${currentYear}-12-31`

    // Insert member
    await db.insert(member).values({
      id: memberId,
      // Personal Information
      title: body.title,
      nameFamily: body.nameFamily,
      nameMiddle: body.nameMiddle,
      nameFirst: body.nameFirst,
      sex: body.sex,
      dob: body.dob,
      address: body.address,
      telephone: body.telephone,
      fax: body.fax,
      email: body.email,
      avatar: body.avatar,

      // Employment & Education
      position: body.position,
      employer: body.employer,
      department: body.department,
      qualifications: body.qualifications,
      experience: body.experience,

      // Languages
      motherTongue: body.motherTongue,
      otherLanguagesJson: body.otherLanguages ? JSON.stringify(body.otherLanguages) : null,
      otherLanguageText: body.otherLanguageText,

      // Areas of Expertise
      expertiseDescription: body.expertiseDescription,
      expertiseOther: body.expertiseOther,

      // Employment Classification
      agency: body.agency,
      typeOfWork: body.typeOfWork,
      typeOfWorkOther: body.typeOfWorkOther,
      retiredSince: body.retiredSince,

      // Membership Details
      membershipType: body.membershipType,
      status: 'pending', // Default status for new members
      joinedDate,
      expiryDate,
      fees: body.fees,
      paymentReference: body.paymentReference,
    })

    // Insert expertise areas if provided
    if (body.expertise && body.expertise.length > 0) {
      const expertiseInserts = body.expertise.map(label => ({
        id: `expertise_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        memberId,
        label,
      }))

      await db.insert(memberExpertise).values(expertiseInserts)
    }

    // Insert publications if provided
    if (body.publications && body.publications.length > 0) {
      const pubInserts = body.publications.map(filename => ({
        id: `pub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        memberId,
        filename,
      }))
      await db.insert(memberPublication).values(pubInserts)
    }

    // Create initial history entry
    await db.insert(memberHistory).values({
      id: `history_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      memberId,
      action: 'Member account created',
      type: 'creation',
      notes: 'Initial member registration',
    })

    // Fetch the created member with all related data
    const createdMember = await db.select().from(member).where(eq(member.id, memberId)).limit(1)

    const expertiseResult = await db
      .select({ label: memberExpertise.label })
      .from(memberExpertise)
      .where(eq(memberExpertise.memberId, memberId))

    const memberData = createdMember[0]

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
      publications: body.publications ?? [],

      // Timestamps
      createdAt: memberData.createdAt.toISOString(),
      updatedAt: memberData.updatedAt.toISOString(),
    }

    // Activity log
    await addActivity({
      type: 'Membership',
      title: 'New member created',
      description: `${memberData.nameFirst} ${memberData.nameFamily} joined`,
      entityType: 'member',
      entityId: memberId,
      metadata: { email: memberData.email, membershipType: memberData.membershipType },
    })

    // Send confirmation email (non-blocking failure but awaited to ensure completion)
    try {
      await sendMembershipApplicationEmail({
        member: memberDetail,
      })
    } catch (error) {
      console.error('Failed to send membership application email:', error)
    }

    return {
      success: true,
      data: memberDetail,
      message: 'Member created successfully',
    }
  } catch (error: unknown) {
    console.error('Error creating member:', error)
    if (typeof error === 'object' && error && 'statusCode' in error) throw error as unknown as Error

    return {
      success: false,
      error: 'Failed to create member',
    }
  }
})
