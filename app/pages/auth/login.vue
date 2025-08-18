<template>
  <div class="flex min-h-screen">
    <div class="flex-1 flex items-center justify-center p-8">
      <UCard class="w-full max-w-md">
        <template #header>
          <div class="text-center">
            <h1 class="text-2xl font-bold">Welcome back</h1>
            <p class="text-gray-500 dark:text-gray-400 mt-1">
              Sign in to your EPISON Admin account
            </p>
          </div>
        </template>

        <UForm :state="state" class="space-y-4" @submit="onSubmit">
          <UFormGroup label="Email" name="email">
            <UInput
              v-model="state.email"
              type="email"
              placeholder="you@example.com"
              icon="i-heroicons-envelope"
              required
            />
          </UFormGroup>

          <UFormGroup label="Password" name="password">
            <UInput
              v-model="state.password"
              type="password"
              placeholder="••••••••"
              icon="i-heroicons-lock-closed"
              required
            />
          </UFormGroup>

          <div class="flex items-center justify-between">
            <UCheckbox v-model="state.remember" name="remember" label="Remember me" />
            <NuxtLink to="/auth/forgot-password" class="text-sm text-primary hover:underline">
              Forgot password?
            </NuxtLink>
          </div>

          <UButton type="submit" color="primary" class="w-full justify-center" :loading="isLoading">
            Sign in
          </UButton>
        </UForm>

        <template #footer>
          <div class="text-center text-sm text-gray-500 dark:text-gray-400">
            Don't have an account?
            {{ ' ' }}
            <NuxtLink to="/auth/register" class="text-primary hover:underline">
              Contact administrator
            </NuxtLink>
          </div>
        </template>
      </UCard>
    </div>
    <div class="hidden lg:flex-1 lg:flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div class="max-w-md p-8">
        <UIcon name="i-heroicons-chart-bar" class="w-16 h-16 text-primary mx-auto mb-6" />
        <h2 class="text-3xl font-bold text-center mb-4">EPISON Admin</h2>
        <p class="text-center text-gray-500 dark:text-gray-400">
          Manage conferences, members, and more with the EPISON Admin Dashboard
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const isLoading = ref(false)

const state = reactive({
  email: '',
  password: '',
  remember: false,
})

async function onSubmit() {
  try {
    isLoading.value = true
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    // Navigate to admin dashboard on success
    return navigateTo('/admin')
  } catch (error) {
    // Handle error
    console.error(error)
  } finally {
    isLoading.value = false
  }
}

// Set page metadata
definePageMeta({
  layout: 'auth',
  middleware: ['guest'],
})
</script>
