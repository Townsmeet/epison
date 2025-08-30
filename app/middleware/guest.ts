export default defineNuxtRouteMiddleware(to => {
  // Basic guest middleware: if a user is considered authenticated, redirect away from auth pages
  // Adjust the cookie/key logic to match your auth implementation.
  const authCookie = useCookie<string | null>('auth_token')
  const isAuthenticated = Boolean(authCookie.value)

  // If already logged in and trying to access guest-only routes (e.g. /auth/*), redirect to admin
  if (isAuthenticated && to.path.startsWith('/auth')) {
    return navigateTo('/admin')
  }

  // Otherwise, allow navigation
  return
})
