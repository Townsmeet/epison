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

      <!-- Renewal Success -->
      <template v-if="isRenewal">
        <h1 class="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
          Membership Renewed!
        </h1>

        <p class="mt-4 text-lg text-gray-600 dark:text-gray-300">
          Thank you for renewing your membership with the Epidemiological Society of Nigeria. Your
          payment has been processed successfully.
        </p>

        <div class="mt-8 bg-green-50 dark:bg-green-900/20 rounded-lg p-4 text-left">
          <h3 class="text-lg font-medium text-green-800 dark:text-green-200">Renewal Details</h3>
          <ul class="mt-2 space-y-2 text-green-700 dark:text-green-300">
            <li class="flex items-start">
              <UIcon name="i-heroicons-calendar" class="h-5 w-5 mt-0.5 mr-2 flex-shrink-0" />
              <span
                >Your membership is now valid until <strong>December 31, {{ currentYear }}</strong
                >.</span
              >
            </li>
            <li class="flex items-start">
              <UIcon name="i-heroicons-envelope" class="h-5 w-5 mt-0.5 mr-2 flex-shrink-0" />
              <span>A confirmation email has been sent to your registered email address.</span>
            </li>
            <li v-if="paymentRef" class="flex items-start">
              <UIcon name="i-heroicons-receipt-percent" class="h-5 w-5 mt-0.5 mr-2 flex-shrink-0" />
              <span
                >Payment Reference: <strong>{{ paymentRef }}</strong></span
              >
            </li>
          </ul>
        </div>
      </template>

      <!-- Application Success -->
      <template v-else>
        <h1 class="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
          Application Submitted!
        </h1>

        <p class="mt-4 text-lg text-gray-600 dark:text-gray-300">
          Thank you for applying to the Epidemiological Society of Nigeria. Your payment has been
          processed successfully and your application is now under review.
        </p>

        <div class="mt-8 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 text-left">
          <h3 class="text-lg font-medium text-blue-800 dark:text-blue-200">What's Next?</h3>
          <ul class="mt-2 space-y-2 text-blue-700 dark:text-blue-300">
            <li class="flex items-start">
              <UIcon name="i-heroicons-envelope" class="h-5 w-5 mt-0.5 mr-2 flex-shrink-0" />
              <span>Check your email for a payment confirmation and application details.</span>
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
      </template>

      <div class="mt-8">
        <UButton to="/" color="primary" size="lg"> Back to Home </UButton>

        <p class="mt-4 text-sm text-gray-500 dark:text-gray-400">
          Questions?
          <NuxtLink
            to="/contact"
            class="text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
            >Contact our membership team</NuxtLink
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

const route = useRoute()

const isRenewal = computed(() => route.query.type === 'renewal')
const paymentRef = computed(() => route.query.ref as string | undefined)
const currentYear = new Date().getFullYear()

useHead(() => ({
  title: isRenewal.value ? 'Membership Renewed - EPISON' : 'Application Received - EPISON',
  meta: [
    {
      name: 'description',
      content: isRenewal.value
        ? 'Your EPISON membership has been successfully renewed.'
        : 'Your membership application has been received. Thank you for applying to the Epidemiological Society of Nigeria (EPISON).',
    },
  ],
}))
</script>
