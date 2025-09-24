import { getCookie } from 'h3'

export default defineNuxtRouteMiddleware(async to => {
  // Only protect admin routes
  if (!to.path.startsWith('/admin')) return

  const { isAuthenticated } = useAuth()

  // If already authenticated via shared state, allow
  if (isAuthenticated.value) return

  // Server-side: check HttpOnly cookies reliably using h3 getCookie
  if (import.meta.server) {
    const event = useRequestEvent()
    // In rare cases event can be undefined in typing; if so, skip SSR check
    if (!event) return
    const sessionCookie = getCookie(event, 'better-auth.session')
    const sessionToken = getCookie(event, 'better-auth.session_token')
    const legacyAuth = getCookie(event, 'auth_token')
    const hasSession = Boolean(sessionCookie || sessionToken || legacyAuth)
    if (!hasSession) {
      return navigateTo(`/auth/login?redirect=${encodeURIComponent(to.path)}`)
    }
    // If session exists, allow
    return
  }

  // Client-side: cannot read HttpOnly cookies; await auth init to determine state
  if (import.meta.client) {
    const { init, isAuthenticated: clientAuthed } = useAuth()
    await init()
    if (!clientAuthed.value) {
      return navigateTo(`/auth/login?redirect=${encodeURIComponent(to.path)}`)
    }
    return
  }

  // Otherwise redirect to login (fallback)
  return navigateTo(`/auth/login?redirect=${encodeURIComponent(to.path)}`)
})
