export default defineNuxtRouteMiddleware(to => {
  // Only protect admin routes
  if (!to.path.startsWith('/admin')) return

  const { isAuthenticated } = useAuth()

  // If already authenticated via shared state, allow
  if (isAuthenticated.value) return

  // Fallback: if we have a session cookie, allow without network calls
  const sessionCookie = useCookie<string | null>('better-auth.session')
  const sessionToken = useCookie<string | null>('better-auth.session_token')
  const legacyAuth = useCookie<string | null>('auth_token')
  const hasSession = Boolean(sessionCookie.value || sessionToken.value || legacyAuth.value)

  if (hasSession) return

  // Otherwise redirect to login
  return navigateTo(`/auth/login?redirect=${encodeURIComponent(to.path)}`)
})
