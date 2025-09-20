<template>
  <div class="flex min-h-screen">
    <div class="flex-1 flex items-center justify-center p-8">
      <UCard class="w-full max-w-md">
        <template #header>
          <div class="text-center">
            <h1 class="text-2xl font-bold">Forgot Password</h1>
            <p class="text-gray-500 dark:text-gray-400 mt-1">
              We'll send you a link to reset your password
            </p>
          </div>
        </template>

        <UForm :state="state" :schema="schema" class="space-y-4" @submit="onSubmit">
          <UFormField label="Email" name="email">
            <UInput
              v-model="state.email"
              type="email"
              placeholder="you@example.com"
              icon="i-heroicons-envelope"
              class="w-full"
              required
            />
          </UFormField>

          <UButton type="submit" color="primary" class="w-full justify-center" :loading="isLoading">
            Send Reset Link
          </UButton>
        </UForm>

        <template #footer>
          <div class="text-center text-sm text-gray-500 dark:text-gray-400">
            Remember your password?
            {{ ' ' }}
            <NuxtLink to="/auth/login" class="text-primary hover:underline"> Sign in </NuxtLink>
          </div>
        </template>
      </UCard>
    </div>
    <div class="hidden lg:flex-1 lg:flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div class="max-w-md p-8 text-center">
        <UIcon name="i-heroicons-lock-closed" class="w-16 h-16 text-primary mx-auto mb-6" />
        <h2 class="text-3xl font-bold mb-4">Reset Password</h2>
        <p class="text-center text-gray-500 dark:text-gray-400">
          Enter your email address and we'll send you a link to reset your password
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '#ui/types'

const { requestPasswordReset, isLoading } = useAuth()

const schema = z.object({
  email: z.string().email('Invalid email'),
})

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  email: '',
})

async function onSubmit(_event: FormSubmitEvent<Schema>) {
  try {
    const { error } = await requestPasswordReset(state.email!)

    if (error) throw error

    useToast().add({
      title: 'Email sent',
      description: 'Check your email for a link to reset your password.',
      icon: 'i-heroicons-envelope',
      color: 'success',
    })

    await navigateTo('/auth/login')
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to send reset link'
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
