<template>
  <div class="flex min-h-screen">
    <div class="flex-1 flex items-center justify-center p-8">
      <UCard class="w-full max-w-md">
        <template #header>
          <div class="text-center">
            <h1 class="text-2xl font-bold">Set a new password</h1>
            <p class="text-gray-500 dark:text-gray-400 mt-1">Enter and confirm your new password</p>
          </div>
        </template>

        <UForm :schema="resetPasswordSchema" :state="state" class="space-y-4" @submit="onSubmit">
          <UFormField label="New password" name="password">
            <UInput
              v-model="state.password"
              type="password"
              placeholder="••••••••"
              icon="i-heroicons-lock-closed"
              class="w-full"
              required
            />
          </UFormField>

          <UFormField label="Confirm password" name="confirm">
            <UInput
              v-model="state.confirm"
              type="password"
              placeholder="••••••••"
              icon="i-heroicons-lock-closed"
              class="w-full"
              required
            />
          </UFormField>

          <UButton type="submit" color="primary" class="w-full justify-center" :loading="isLoading">
            Reset password
          </UButton>
        </UForm>

        <template #footer>
          <div class="text-center text-sm text-gray-500 dark:text-gray-400">
            Remembered your password?
            {{ ' ' }}
            <NuxtLink to="/auth/login" class="text-primary hover:underline"> Sign in </NuxtLink>
          </div>
        </template>
      </UCard>
    </div>

    <div class="hidden lg:flex-1 lg:flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div class="max-w-md p-8 text-center">
        <UIcon name="i-heroicons-key" class="w-16 h-16 text-primary mx-auto mb-6" />
        <h2 class="text-3xl font-bold mb-4">Reset Password</h2>
        <p class="text-center text-gray-500 dark:text-gray-400">
          Create a strong password you don't use elsewhere
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FormSubmitEvent } from '#ui/types'
import { resetPasswordSchema, type ResetPasswordData } from '~/schemas/auth'

const route = useRoute()
const { resetPassword, isLoading } = useAuth()

// Token from the reset link
const token = computed(() => {
  const t = route.query.token
  return Array.isArray(t) ? t[0] : t || ''
})

const state = reactive<Partial<ResetPasswordData>>({
  password: '',
  confirm: '',
})

async function onSubmit(_event: FormSubmitEvent<ResetPasswordData>) {
  try {
    if (!token.value) {
      useToast().add({
        title: 'Invalid link',
        description: 'The reset link is missing or invalid. Please request a new one.',
        icon: 'i-heroicons-exclamation-triangle',
        color: 'error',
      })
      await navigateTo('/auth/forgot-password')
      return
    }

    const { error } = await resetPassword(token.value, state.password!)

    if (error) throw error

    useToast().add({
      title: 'Password updated',
      description: 'Your password has been reset. You can now sign in.',
      icon: 'i-heroicons-check-circle',
      color: 'success',
    })

    await navigateTo('/auth/login')
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to reset password. Please try again.'
    useToast().add({
      title: 'Error',
      description: errorMessage,
      icon: 'i-heroicons-exclamation-circle',
      color: 'error',
    })
  }
}

definePageMeta({
  layout: 'auth',
  middleware: ['guest'],
})
</script>
