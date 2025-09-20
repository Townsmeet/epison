import { authClient } from '~/utils/auth-client'
import type { User } from 'better-auth'

export const useAuth = () => {
  const user = ref<User | null>(null)
  const isAuthenticated = computed(() => !!user.value)
  const isLoading = ref(true)

  // Initialize auth state
  const init = async () => {
    try {
      const { data } = await authClient.getSession()
      user.value = data?.user || null
    } catch {
      user.value = null
    } finally {
      isLoading.value = false
    }
  }

  // Initialize on setup
  init()

  // Login with email/password
  const login = async (email: string, password: string, rememberMe = false) => {
    try {
      isLoading.value = true
      const { data, error } = await authClient.signIn.email({
        email,
        password,
        rememberMe,
      })

      if (error) {
        // Extract error message from the error object
        const errorMessage = error.message || 'Authentication failed'
        throw new Error(errorMessage)
      }

      if (!data?.user) {
        throw new Error('No user data returned from authentication')
      }

      // Update user state
      user.value = data.user
      return { error: null }
    } catch (error: unknown) {
      user.value = null
      // Ensure we return a proper error object with message
      const errorMessage =
        error instanceof Error ? error.message : 'An unknown error occurred during login'
      return { error: new Error(errorMessage) }
    } finally {
      isLoading.value = false
    }
  }

  // Request password reset
  const requestPasswordReset = async (email: string) => {
    try {
      isLoading.value = true
      const { error } = await authClient.forgetPassword({
        email,
        redirectTo: '/auth/reset-password',
      })

      if (error) {
        throw new Error(error.message || 'Failed to send reset email')
      }

      return { error: null }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to send reset email'
      return { error: new Error(errorMessage) }
    } finally {
      isLoading.value = false
    }
  }

  // Reset password with token
  const resetPassword = async (token: string, password: string) => {
    try {
      isLoading.value = true
      const { error } = await authClient.resetPassword({
        token,
        newPassword: password,
      })

      if (error) {
        throw new Error(error.message || 'Failed to reset password')
      }

      return { error: null }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to reset password'
      return { error: new Error(errorMessage) }
    } finally {
      isLoading.value = false
    }
  }

  // Logout
  const logout = async () => {
    try {
      await authClient.signOut()
      user.value = null
      return navigateTo('/auth/login')
    } catch (error) {
      return { error }
    }
  }

  return {
    user,
    isAuthenticated,
    isLoading,
    init,
    login,
    logout,
    requestPasswordReset,
    resetPassword,
  }
}
