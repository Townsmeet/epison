<template>
  <div
    class="min-h-[calc(100vh-64px)] flex items-center justify-center bg-white dark:bg-gray-900 px-4 sm:px-6 lg:px-8"
  >
    <div class="max-w-md w-full space-y-8 text-center">
      <div
        class="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-green-100 dark:bg-green-900/30"
      >
        <UIcon
          name="i-heroicons-check-circle"
          class="h-12 w-12 text-green-600 dark:text-green-400"
        />
      </div>

      <h1 class="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
        Application Submitted!
      </h1>

      <p class="mt-4 text-lg text-gray-600 dark:text-gray-300">
        Thank you for applying to the Epidemiological Society of Nigeria. We've received your
        application and will review it shortly.
      </p>

      <div class="mt-8 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 text-left">
        <h3 class="text-lg font-medium text-blue-800 dark:text-blue-200">What's Next?</h3>
        <ul class="mt-2 space-y-2 text-blue-700 dark:text-blue-300">
          <li class="flex items-start">
            <UIcon name="i-heroicons-envelope" class="h-5 w-5 mt-0.5 mr-2 flex-shrink-0" />
            <span>Check your email for a confirmation message with your application details.</span>
          </li>
          <li class="flex items-start">
            <UIcon name="i-heroicons-clock" class="h-5 w-5 mt-0.5 mr-2 flex-shrink-0" />
            <span>Our team will review your application within 3-5 business days.</span>
          </li>
          <li class="flex items-start">
            <UIcon name="i-heroicons-check-circle" class="h-5 w-5 mt-0.5 mr-2 flex-shrink-0" />
            <span
              >If approved, you'll receive a confirmation email else our team will contact
              you.</span
            >
          </li>
        </ul>
      </div>

      <div class="mt-8">
        <UButton to="/" color="primary" size="lg" class="w-full sm:w-auto"> Back to Home </UButton>

        <p class="mt-4 text-sm text-gray-500 dark:text-gray-400">
          Questions?
          <a
            href="mailto:membership@epison.org.ng"
            class="text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
            >Contact our membership team</a
          >
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default',
})

useHead({
  title: 'Application Received - EPISON',
  meta: [
    {
      name: 'description',
      content:
        'Your membership application has been received. Thank you for applying to the Epidemiological Society of Nigeria (EPISON).',
    },
  ],
})
</script>
