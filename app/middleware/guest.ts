export default defineNuxtRouteMiddleware(to => {
  // Use the shared auth state so checks are consistent app-wide
  const { isAuthenticated } = useAuth()

  // If already logged in and trying to access guest-only routes (e.g. /auth/*), redirect
  if (isAuthenticated.value && to.path.startsWith('/auth')) {
    const redirect = (to.query.redirect as string) || '/admin'
    return navigateTo(redirect)
  }

  // Otherwise, allow navigation
  return
})
