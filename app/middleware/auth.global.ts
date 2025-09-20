export default defineNuxtRouteMiddleware(async to => {
  // Only protect admin routes
  if (!to.path.startsWith('/admin')) return

  const { isAuthenticated, init } = useAuth()

  // Initialize auth state
  await init()

  // Redirect to login if not authenticated
  if (!isAuthenticated.value) {
    return navigateTo(`/auth/login?redirect=${encodeURIComponent(to.path)}`)
  }

  // If already on login page but authenticated, redirect to admin
  if (to.path === '/auth/login' && isAuthenticated.value) {
    return navigateTo('/admin')
  }
})
