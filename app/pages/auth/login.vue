<template>
  <div class="flex min-h-screen">
    <div class="flex-1 flex items-center justify-center p-8">
      <UCard class="w-full max-w-md p-6 sm:p-8">
        <template #header>
          <div class="text-center">
            <h1 class="text-2xl font-bold">Welcome back</h1>
            <p class="text-gray-500 dark:text-gray-400 mt-1">
              Sign in to your EPISON Admin account
            </p>
          </div>
        </template>

        <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
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

          <UFormField label="Password" name="password">
            <UInput
              v-model="state.password"
              type="password"
              placeholder="••••••••"
              icon="i-heroicons-lock-closed"
              class="w-full"
              required
            />
          </UFormField>

          <div class="flex items-center justify-between">
            <UCheckbox v-model="state.remember" name="remember" label="Remember me" />
            <NuxtLink to="/auth/forgot-password" class="text-sm text-primary hover:underline">
              Forgot password?
            </NuxtLink>
          </div>

          <UButton
            type="submit"
            color="primary"
            class="w-full justify-center"
            :loading="isLoading"
            :disabled="isLoading"
          >
            Sign in
          </UButton>

          <!-- Errors will be shown via toast notifications -->
        </UForm>
      </UCard>
    </div>
    <div class="hidden lg:flex-1 lg:flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div class="max-w-md p-8 text-center">
        <UIcon
          name="i-heroicons-chart-bar"
          class="w-16 h-16 text-center text-primary mx-auto mb-6"
        />
        <h2 class="text-3xl font-bold mb-4">EPISON Admin</h2>
        <p class="text-center text-gray-500 dark:text-gray-400">
          Manage members, events, and more with the EPISON Admin Dashboard
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '#ui/types'

const { login, isLoading } = useAuth()
const toast = useToast()
const route = useRoute()

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Must be at least 8 characters'),
  remember: z.boolean().default(false),
})

type Schema = z.output<typeof schema>

const state = reactive<Schema>({
  email: '',
  password: '',
  remember: false,
})

const onSubmit = async (_event: FormSubmitEvent<Schema>) => {
  try {
    const { error: loginError } = await login(state.email, state.password, state.remember)
    if (loginError) throw loginError

    // Show success message
    toast.add({
      title: 'Login successful',
      color: 'success',
      icon: 'i-heroicons-check-circle',
    })

    // Redirect to intended page or default to /admin
    const redirect = route.query.redirect?.toString() || '/admin'
    await navigateTo(redirect)
  } catch (error: unknown) {
    // Extract error message from the error object
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred'
    toast.add({
      title: 'Login failed',
      description: errorMessage,
      color: 'error',
      icon: 'i-heroicons-exclamation-circle',
    })
  }
}

// Set page metadata
definePageMeta({
  layout: 'auth',
  middleware: 'guest',
})
</script>
