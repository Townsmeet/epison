import type { H3Event } from 'h3'
import { createError } from 'h3'
import { eq } from 'drizzle-orm'
import { db } from '../../utils/drizzle'
import { member, memberExpertise, memberPublication, memberHistory } from '../../db/schema'
import type { ApiResponse } from '../../../types/api'
import { validateParams } from '../../validators'
import { memberIdParamSchema } from '../../validators/member'
import { addActivity } from '../../utils/activity'

export default defineEventHandler(async (event: H3Event): Promise<ApiResponse> => {
  const params = validateParams(event, memberIdParamSchema, 'Invalid member ID')
  const memberId = params.id
  try {
    // Check if member exists
    const existingMember = await db
      .select({ id: member.id, nameFirst: member.nameFirst, nameFamily: member.nameFamily })
      .from(member)
      .where(eq(member.id, memberId))
      .limit(1)

    if (!existingMember.length) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Member not found',
      })
    }

    const memberData = existingMember[0]

    // Delete member (cascade will handle related records due to foreign key constraints)
    // But we'll explicitly delete related records for clarity and to ensure clean deletion

    // Delete member expertise
    await db.delete(memberExpertise).where(eq(memberExpertise.memberId, memberId))

    // Delete member publications
    await db.delete(memberPublication).where(eq(memberPublication.memberId, memberId))

    // Delete member history
    await db.delete(memberHistory).where(eq(memberHistory.memberId, memberId))

    // Finally, delete the member
    await db.delete(member).where(eq(member.id, memberId))

    // Activity log
    await addActivity({
      type: 'Membership',
      title: 'Member deleted',
      description: `${memberData.nameFirst} ${memberData.nameFamily} deleted`,
      entityType: 'member',
      entityId: memberId,
    })

    return {
      success: true,
      message: `Member ${memberData.nameFirst} ${memberData.nameFamily} has been permanently deleted`,
    }
  } catch (error: unknown) {
    console.error('Error deleting member:', error)
    return {
      success: false,
      error: 'Failed to delete member',
    }
  }
})
