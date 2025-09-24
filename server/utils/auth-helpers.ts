import type { H3Event } from 'h3'
import { createError } from 'h3'

export type AuthContext = {
  userId: string
  // extend with roles/permissions if needed later
}

type EventWithAuth = H3Event & { context: { auth?: AuthContext } }

export function requireAuthUser(event: H3Event): AuthContext {
  const auth = (event as EventWithAuth).context?.auth
  if (!auth || !auth.userId) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    })
  }
  return auth
}

export function getAuthUser(event: H3Event): AuthContext | null {
  const auth = (event as EventWithAuth).context?.auth
  return auth && auth.userId ? auth : null
}
