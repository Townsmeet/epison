<template>
  <div class="flex min-h-screen">
    <div class="flex-1 flex items-center justify-center p-8">
      <UCard class="w-full max-w-md">
        <template #header>
          <div class="text-center">
            <h1 class="text-2xl font-bold">Forgot Password</h1>
            <p class="text-gray-500 dark:text-gray-400 mt-1">
              Enter your email and we'll send you a link to reset your password
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
      <div class="max-w-md p-8">
        <UIcon name="i-heroicons-lock-closed" class="w-16 h-16 text-primary mx-auto mb-6" />
        <h2 class="text-3xl font-bold text-center mb-4">Reset Password</h2>
        <p class="text-center text-gray-500 dark:text-gray-400">
          Enter your email address and we'll send you a link to reset your password
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const isLoading = ref(false)

const state = reactive({
  email: '',
})

async function onSubmit() {
  try {
    isLoading.value = true
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    // Show success message
    useToast().add({
      title: 'Email sent',
      description: 'Check your email for a link to reset your password.',
      icon: 'i-heroicons-envelope',
    })
    // Navigate back to login
    return navigateTo('/auth/login')
  } catch (error) {
    // Handle error
    console.error(error)
  } finally {
    isLoading.value = false
  }
}

definePageMeta({
  layout: 'auth',
  middleware: ['guest'],
})
</script>
