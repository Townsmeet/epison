<template>
  <div
    class="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
  >
    <div class="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
      <div class="text-center">
        <div
          class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900"
        >
          <UIcon name="i-heroicons-check" class="h-6 w-6 text-green-600 dark:text-green-400" />
        </div>
        <h2 class="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
          Registration Successful!
        </h2>
        <p class="mt-2 text-sm text-gray-600 dark:text-gray-300">
          Thank you for registering for {{ conference.title }}
        </p>
      </div>

      <div class="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md mt-8">
        <div class="flex">
          <div class="flex-shrink-0">
            <UIcon name="i-heroicons-information-circle" class="h-5 w-5 text-blue-400" />
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-blue-800 dark:text-blue-200">What's Next?</h3>
            <div class="mt-2 text-sm text-blue-700 dark:text-blue-300 space-y-2">
              <p>• A confirmation email has been sent to your email address.</p>
              <p>• Payment instructions will be sent to your email within 24 hours.</p>
              <p>
                • For any questions, please contact
                <a href="mailto:conference@epison.org" class="font-medium underline"
                  >conference@epison.org</a
                >
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-8 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Registration Details</h3>
        <dl class="space-y-4">
          <div class="sm:grid sm:grid-cols-3 sm:gap-4">
            <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Registration ID</dt>
            <dd class="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">
              {{ registration.id }}
            </dd>
          </div>
          <div class="sm:grid sm:grid-cols-3 sm:gap-4">
            <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Name</dt>
            <dd class="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">
              {{ registration.firstName }} {{ registration.lastName }}
            </dd>
          </div>
          <div class="sm:grid sm:grid-cols-3 sm:gap-4">
            <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Email</dt>
            <dd class="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">
              {{ registration.email }}
            </dd>
          </div>
          <div class="sm:grid sm:grid-cols-3 sm:gap-4">
            <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Registration Type</dt>
            <dd class="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">
              {{ getRegistrationTypeLabel(registration.registrationType) }}
              <span
                v-if="registration.earlyBird"
                class="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
              >
                Early Bird
              </span>
            </dd>
          </div>
          <div class="sm:grid sm:grid-cols-3 sm:gap-4">
            <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Amount</dt>
            <dd class="mt-1 text-sm font-bold text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">
              ₦{{ registration.fee.toLocaleString() }}
            </dd>
          </div>
        </dl>
      </div>

      <div class="mt-8">
        <UButton to="/conferences" color="primary" block size="lg" class="justify-center">
          Back to Conferences
        </UButton>

        <div class="mt-4 text-center">
          <UButton
            to="/"
            color="neutral"
            variant="ghost"
            class="text-sm font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
          >
            <UIcon name="i-heroicons-home" class="h-4 w-4 mr-1" />
            Back to Home
          </UButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const _route = useRoute()

// In a real app, this would be fetched from the API using the registration ID from the URL
const registration = ref({
  id: 'EPI' + Math.floor(100000 + Math.random() * 900000),
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  registrationType: 'member',
  fee: 25000,
  earlyBird: true,
  date: new Date().toISOString(),
})

const conference = ref({
  title: '29th Annual Scientific Conference',
  startDate: '2024-11-15',
  endDate: '2024-11-18',
  location: 'Abuja, Nigeria',
})

function getRegistrationTypeLabel(type: string) {
  const types: Record<string, string> = {
    member: 'EPISON Member',
    'non-member': 'Non-Member',
    'student-member': 'Student Member',
    'student-non-member': 'Student Non-Member',
  }
  return types[type] || type
}

// In a real app, we would fetch the registration details using the ID from the URL
onMounted(() => {
  // Example of how you might fetch the registration details
  // const registrationId = route.query.registration_id
  // fetchRegistration(registrationId)
})
</script>
