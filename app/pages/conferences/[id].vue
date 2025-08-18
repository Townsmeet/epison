<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Conference Header -->
    <div class="relative bg-white dark:bg-gray-900 overflow-hidden">
      <div class="max-w-7xl mx-auto">
        <div
          class="relative z-10 pb-8 bg-white dark:bg-gray-900 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32"
        >
          <div class="pt-10 sm:pt-16 lg:pt-8 lg:pb-14 lg:overflow-hidden">
            <div class="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 lg:mt-16 lg:px-8">
              <div class="lg:text-left">
                <span
                  class="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium"
                  :class="conference.badgeClass"
                >
                  {{ conference.type }}
                </span>
                <h1
                  class="text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white sm:text-5xl md:text-6xl mt-4"
                >
                  <span class="block">{{ conference.title }}</span>
                </h1>
                <div class="mt-6 space-y-4">
                  <div class="flex items-center text-gray-500 dark:text-gray-300">
                    <UIcon
                      name="i-heroicons-calendar"
                      class="flex-shrink-0 h-5 w-5 text-gray-400"
                    />
                    <span class="ml-2">
                      {{ formatDate(conference.startDate) }} - {{ formatDate(conference.endDate) }}
                    </span>
                  </div>
                  <div class="flex items-center text-gray-500 dark:text-gray-300">
                    <UIcon name="i-heroicons-map-pin" class="flex-shrink-0 h-5 w-5 text-gray-400" />
                    <span class="ml-2">{{ conference.location }}</span>
                  </div>
                </div>
                <div class="mt-8 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                  <UButton
                    v-if="conference.registrationOpen"
                    to="#register"
                    size="lg"
                    color="primary"
                    class="w-full sm:w-auto justify-center"
                  >
                    Register Now
                  </UButton>
                  <UButton
                    v-if="conference.brochureUrl"
                    :to="conference.brochureUrl"
                    target="_blank"
                    size="lg"
                    color="white"
                    class="w-full sm:w-auto justify-center"
                  >
                    <UIcon name="i-heroicons-document-arrow-down" class="h-5 w-5 mr-2" />
                    Download Brochure
                  </UButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
        <img
          class="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
          :src="conference.image"
          :alt="conference.title"
        />
      </div>
    </div>

    <!-- Conference Details -->
    <div class="py-12 bg-white dark:bg-gray-900">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="lg:grid lg:grid-cols-3 lg:gap-8">
          <div class="lg:col-span-2">
            <!-- About Section -->
            <div class="prose dark:prose-invert max-w-none">
              <h2>About the Conference</h2>
              <p>{{ conference.about }}</p>

              <h3>Theme</h3>
              <p class="text-lg font-medium text-gray-900 dark:text-white">
                "{{ conference.theme }}"
              </p>

              <h3>Objectives</h3>
              <ul>
                <li v-for="(objective, index) in conference.objectives" :key="index">
                  {{ objective }}
                </li>
              </ul>
            </div>

            <!-- Registration Form -->
            <div id="register" class="mt-12">
              <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Register Now</h2>
              <UForm :state="registration" class="space-y-6" @submit="submitRegistration">
                <div class="bg-white dark:bg-gray-800 shadow sm:rounded-lg">
                  <div class="px-4 py-5 sm:p-6">
                    <h3 class="text-lg font-medium leading-6 text-gray-900 dark:text-white">
                      Registration Form
                    </h3>
                    <div class="mt-5 grid grid-cols-6 gap-6">
                      <div class="col-span-6 sm:col-span-3">
                        <UFormGroup label="First Name" name="firstName" required>
                          <UInput v-model="registration.firstName" />
                        </UFormGroup>
                      </div>

                      <div class="col-span-6 sm:col-span-3">
                        <UFormGroup label="Last Name" name="lastName" required>
                          <UInput v-model="registration.lastName" />
                        </UFormGroup>
                      </div>

                      <div class="col-span-6 sm:col-span-4">
                        <UFormGroup label="Email Address" name="email" required>
                          <UInput v-model="registration.email" type="email" />
                        </UFormGroup>
                      </div>

                      <div class="col-span-6 sm:col-span-3">
                        <UFormGroup label="Phone Number" name="phone" required>
                          <UInput v-model="registration.phone" type="tel" />
                        </UFormGroup>
                      </div>

                      <div class="col-span-6 sm:col-span-3">
                        <UFormGroup label="Registration Type" name="registrationType" required>
                          <USelect
                            v-model="registration.registrationType"
                            :options="registrationTypes"
                            option-attribute="label"
                            value-attribute="value"
                            @update:model-value="updateRegistrationFee"
                          />
                        </UFormGroup>
                      </div>

                      <div v-if="registration.registrationType === 'member'" class="col-span-6">
                        <UFormGroup
                          label="EPISON Membership Number"
                          name="membershipNumber"
                          required
                        >
                          <UInput v-model="registration.membershipNumber" />
                        </UFormGroup>
                      </div>

                      <div class="col-span-6">
                        <UFormGroup label="Registration Fee" name="fee" required>
                          <div class="mt-1">
                            <div class="relative rounded-md shadow-sm">
                              <div
                                class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                              >
                                <span class="text-gray-500 dark:text-gray-400 sm:text-sm">₦</span>
                              </div>
                              <UInput
                                v-model="registration.fee"
                                type="text"
                                disabled
                                class="pl-7"
                              />
                            </div>
                          </div>
                        </UFormGroup>
                      </div>

                      <div class="col-span-6">
                        <div class="flex items-start">
                          <div class="flex items-center h-5">
                            <UCheckbox id="terms" v-model="registration.agreeTerms" required />
                          </div>
                          <div class="ml-3 text-sm">
                            <label for="terms" class="font-medium text-gray-700 dark:text-gray-300">
                              I agree to the
                              <a
                                href="#"
                                class="text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
                                >Terms and Conditions</a
                              >
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="px-4 py-3 bg-gray-50 dark:bg-gray-700 text-right sm:px-6">
                    <div class="flex justify-between items-center">
                      <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Total:
                        <span class="text-lg font-bold"
                          >₦{{ registration.fee.toLocaleString() }}</span
                        >
                      </span>
                      <UButton
                        type="submit"
                        color="primary"
                        :loading="isSubmitting"
                        :disabled="!registration.agreeTerms"
                      >
                        Complete Registration
                      </UButton>
                    </div>
                  </div>
                </div>
              </UForm>
            </div>
          </div>

          <!-- Sidebar -->
          <div class="mt-12 lg:mt-0 lg:pl-8">
            <div class="space-y-6">
              <!-- Registration Card -->
              <div class="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
                <div class="p-6">
                  <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    Registration Fees
                  </h3>
                  <div class="space-y-4">
                    <div
                      v-for="(fee, index) in conference.registrationFees"
                      :key="index"
                      class="flex items-center justify-between"
                    >
                      <div>
                        <p class="text-sm font-medium text-gray-900 dark:text-white">
                          {{ fee.category }}
                        </p>
                        <p v-if="fee.description" class="text-xs text-gray-500 dark:text-gray-400">
                          {{ fee.description }}
                        </p>
                      </div>
                      <span class="text-sm font-medium text-gray-900 dark:text-white">
                        {{ fee.amount === 0 ? 'Free' : `₦${fee.amount.toLocaleString()}` }}
                        <span
                          v-if="fee.earlyBird"
                          class="text-xs text-green-600 dark:text-green-400"
                          >(Early Bird)</span
                        >
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Important Dates -->
              <div class="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
                <div class="p-6">
                  <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    Important Dates
                  </h3>
                  <ul class="space-y-4">
                    <li
                      v-for="(date, index) in conference.importantDates"
                      :key="index"
                      class="flex items-start"
                    >
                      <UIcon
                        name="i-heroicons-calendar"
                        class="h-5 w-5 text-primary-500 flex-shrink-0 mt-0.5"
                      />
                      <div class="ml-3">
                        <p class="text-sm font-medium text-gray-900 dark:text-white">
                          {{ date.title }}
                        </p>
                        <p class="text-sm text-gray-500 dark:text-gray-400">
                          {{ formatDate(date.date) }}
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>

              <!-- Venue -->
              <div class="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
                <div class="p-6">
                  <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Venue</h3>
                  <div class="flex items-center">
                    <div class="flex-shrink-0">
                      <UIcon
                        name="i-heroicons-building-office-2"
                        class="h-6 w-6 text-primary-500"
                      />
                    </div>
                    <div class="ml-3">
                      <p class="text-sm font-medium text-gray-900 dark:text-white">
                        {{ conference.venue.name }}
                      </p>
                      <p class="text-sm text-gray-500 dark:text-gray-400">
                        {{ conference.venue.address }}
                      </p>
                      <p class="text-sm text-gray-500 dark:text-gray-400">
                        {{ conference.venue.city }}, {{ conference.venue.country }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const _conferenceId = route.params.id as string
const isSubmitting = ref(false)

// Conference data - in a real app, this would be fetched from an API
const conference = ref({
  id: 'annual-conference-2024',
  title: '29th Annual Scientific Conference',
  type: 'Conference',
  startDate: '2024-11-15',
  endDate: '2024-11-18',
  location: 'Abuja, Nigeria',
  registrationOpen: true,
  earlyBird: true,
  badgeClass: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  about:
    "The EPISON Annual Scientific Conference is the premier gathering of epidemiologists and public health professionals in Nigeria. This year's conference will bring together experts, researchers, and practitioners to discuss the latest developments in epidemiology and public health.",
  theme: 'Advancing Epidemiology for Health Security and Sustainable Development',
  objectives: [
    'To provide a platform for knowledge sharing and networking among epidemiologists and public health professionals',
    'To discuss innovative approaches to addressing public health challenges in Nigeria and beyond',
    'To build capacity in epidemiological methods and their application in public health practice',
    'To foster collaboration and partnerships for improved health outcomes',
  ],
  venue: {
    name: 'Nicon Luxury Hotel',
    address: '19, Muhammadu Buhari Way, Central Business District',
    city: 'Abuja',
    country: 'Nigeria',
    phone: '+234 9 461 0000',
    email: 'info@niconluxury.com',
  },
  registrationFees: [
    {
      category: 'EPISON Member',
      description: 'Early Bird (Before Oct 15)',
      amount: 25000,
      earlyBird: true,
    },
    { category: 'EPISON Member', description: 'Regular', amount: 35000, earlyBird: false },
    {
      category: 'Non-Member',
      description: 'Early Bird (Before Oct 15)',
      amount: 40000,
      earlyBird: true,
    },
    { category: 'Non-Member', description: 'Regular', amount: 50000, earlyBird: false },
    { category: 'Student Member', description: 'With valid ID', amount: 10000, earlyBird: false },
    {
      category: 'Student Non-Member',
      description: 'With valid ID',
      amount: 15000,
      earlyBird: false,
    },
  ],
  importantDates: [
    { title: 'Abstract Submission Opens', date: '2024-06-01' },
    { title: 'Early Bird Registration Deadline', date: '2024-10-15' },
    { title: 'Abstract Submission Deadline', date: '2024-09-15' },
    { title: 'Notification of Abstract Acceptance', date: '2024-09-30' },
    { title: 'Regular Registration Deadline', date: '2024-11-01' },
    { title: 'Conference Dates', date: '2024-11-15' },
  ],
  image:
    'https://images.unsplash.com/photo-1533174072775-26d83692aa5d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80',
})

// Registration form
const registration = ref({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  registrationType: 'member',
  membershipNumber: '',
  fee: 25000,
  agreeTerms: false,
})

const registrationTypes = [
  { label: 'EPISON Member', value: 'member' },
  { label: 'Non-Member', value: 'non-member' },
  { label: 'Student Member', value: 'student-member' },
  { label: 'Student Non-Member', value: 'student-non-member' },
]

function updateRegistrationFee() {
  switch (registration.value.registrationType) {
    case 'member':
      registration.value.fee = 35000
      break
    case 'non-member':
      registration.value.fee = 50000
      break
    case 'student-member':
      registration.value.fee = 10000
      break
    case 'student-non-member':
      registration.value.fee = 15000
      break
    default:
      registration.value.fee = 35000
  }

  // Apply early bird discount if applicable
  const earlyBirdEnd = new Date('2024-10-15')
  const today = new Date()
  if (today < earlyBirdEnd) {
    if (registration.value.registrationType === 'member') {
      registration.value.fee = 25000
    } else if (registration.value.registrationType === 'non-member') {
      registration.value.fee = 40000
    }
  }
}

async function submitRegistration() {
  isSubmitting.value = true
  try {
    // In a real app, this would be an API call
    await new Promise(resolve => setTimeout(resolve, 1500))

    // Show success message
    useToast().add({
      title: 'Registration Successful',
      description:
        'Thank you for registering for the conference. A confirmation email has been sent to your email address.',
      icon: 'i-heroicons-check-circle',
      color: 'green',
    })

    // Reset form
    registration.value = {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      registrationType: 'member',
      membershipNumber: '',
      fee: 25000,
      agreeTerms: false,
    }
  } catch (error) {
    console.error('Error submitting registration:', error)
    useToast().add({
      title: 'Error',
      description: 'There was an error processing your registration. Please try again.',
      icon: 'i-heroicons-exclamation-circle',
      color: 'red',
    })
  } finally {
    isSubmitting.value = false
  }
}

function formatDate(dateString: string) {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }
  return new Date(dateString).toLocaleDateString('en-US', options)
}

// Set initial fee based on registration type
onMounted(() => {
  updateRegistrationFee()
})
</script>
