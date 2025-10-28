import type { H3Event } from 'h3'
import { getRouterParam, createError } from 'h3'
import { eq, and } from 'drizzle-orm'
import { db } from '../../../utils/drizzle'
import { eventTicket, ticketCategory } from '../../../db/schema'
import type { TicketDisplayStructure, TicketCategoryWithTickets } from '../../../../types/event'

export default defineEventHandler(async (eventHandler: H3Event) => {
  const eventId = getRouterParam(eventHandler, 'id')
  if (!eventId) {
    throw createError({ statusCode: 400, statusMessage: 'Event ID is required' })
  }

  try {
    // Fetch only public tickets for the event
    const tickets = await db
      .select()
      .from(eventTicket)
      .where(and(eq(eventTicket.eventId, eventId), eq(eventTicket.isPublic, true)))
      .orderBy(eventTicket.displayOrder, eventTicket.createdAt)

    // Fetch all categories for the event
    const categories = await db
      .select()
      .from(ticketCategory)
      .where(eq(ticketCategory.eventId, eventId))
      .orderBy(ticketCategory.displayOrder, ticketCategory.createdAt)

    // Define types for the raw database records
    interface RawTicket extends Omit<typeof eventTicket.$inferSelect, 'createdAt' | 'updatedAt'> {
      createdAt: Date
      updatedAt: Date
    }

    interface RawCategory
      extends Omit<typeof ticketCategory.$inferSelect, 'createdAt' | 'updatedAt'> {
      createdAt: Date
      updatedAt: Date
    }

    // Transform data to match TypeScript interfaces
    const transformTicket = (ticket: RawTicket) => ({
      ...ticket,
      categoryId: ticket.categoryId || undefined,
      salesStart: ticket.salesStart || undefined,
      salesEnd: ticket.salesEnd || undefined,
      description: ticket.description || undefined,
      createdAt: ticket.createdAt.toISOString(),
      updatedAt: ticket.updatedAt.toISOString(),
    })

    const transformCategory = (category: RawCategory) => ({
      ...category,
      description: category.description || undefined,
      createdAt: category.createdAt.toISOString(),
      updatedAt: category.updatedAt.toISOString(),
    })

    // Build the structured response
    const categorized: TicketCategoryWithTickets[] = categories
      .map(category => ({
        ...transformCategory(category),
        tickets: tickets.filter(ticket => ticket.categoryId === category.id).map(transformTicket),
      }))
      .filter(category => category.tickets.length > 0)

    const uncategorized = tickets.filter(ticket => !ticket.categoryId).map(transformTicket)

    const structure: TicketDisplayStructure = {
      categorized,
      uncategorized,
    }

    return { data: structure }
  } catch (error: unknown) {
    console.error('Error fetching public tickets with categories:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch tickets with categories',
    })
  }
})
