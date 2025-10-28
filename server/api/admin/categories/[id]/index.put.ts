import type { H3Event } from 'h3'
import { getRouterParam, createError } from 'h3'
import { eq } from 'drizzle-orm'
import { db } from '../../../../utils/drizzle'
import { isH3Error } from '../../../../utils/errors'
import { ticketCategory } from '../../../../db/schema'
import { createTicketCategorySchema } from '../../../../validators/event'
import { validateBody } from '../../../../validators'
import { requireAuthUser } from '../../../../utils/auth-helpers'

export default defineEventHandler(async (eventHandler: H3Event) => {
  // Auth
  requireAuthUser(eventHandler)

  const categoryId = getRouterParam(eventHandler, 'id')
  if (!categoryId) {
    throw createError({ statusCode: 400, statusMessage: 'Category ID is required' })
  }

  const body = await validateBody(
    eventHandler,
    createTicketCategorySchema.partial(),
    'Invalid category data'
  )

  try {
    const existingCategory = await db
      .select()
      .from(ticketCategory)
      .where(eq(ticketCategory.id, categoryId))
      .limit(1)

    if (!existingCategory.length) {
      throw createError({ statusCode: 404, statusMessage: 'Category not found' })
    }

    // Build update data
    interface UpdateData {
      updatedAt: Date
      name?: string
      description?: string | null
      displayOrder?: number
    }

    const updateData: UpdateData = {
      updatedAt: new Date(),
    }

    if (body.name !== undefined) updateData.name = body.name
    if (body.description !== undefined) updateData.description = body.description
    if (body.displayOrder !== undefined) updateData.displayOrder = body.displayOrder

    await db.update(ticketCategory).set(updateData).where(eq(ticketCategory.id, categoryId))

    // Return updated category
    const updatedCategory = await db
      .select()
      .from(ticketCategory)
      .where(eq(ticketCategory.id, categoryId))
      .limit(1)

    return updatedCategory[0]
  } catch (error: unknown) {
    if (isH3Error(error)) throw error

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to update category',
    })
  }
})
