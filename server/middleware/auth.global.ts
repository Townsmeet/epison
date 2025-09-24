import type { H3Event } from 'h3'
import { defineEventHandler } from 'h3'
import { auth } from '../utils/auth'

// Populate event.context.auth for admin endpoints to consume via requireAuthUser()
export default defineEventHandler(async (event: H3Event) => {
  type EventWithAuth = H3Event & { context: { auth?: { userId: string } } }
  // If already populated by another middleware, skip
  const existing = (event as EventWithAuth).context?.auth
  if (existing && existing.userId) return

  // Try Better Auth session resolution
  try {
    const session = await auth.api.getSession(event)
    const userId =
      (session as { user?: { id?: string }; userId?: string } | null | undefined)?.user?.id ||
      (session as { user?: { id?: string }; userId?: string } | null | undefined)?.userId
    if (userId) {
      ;(event as EventWithAuth).context.auth = { userId }
      return
    }
  } catch {
    // ignore and leave context.auth undefined if session can't be resolved
  }
})
