<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Page header -->
    <div class="bg-white dark:bg-gray-800 shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="md:flex md:items-center md:justify-between">
          <div class="flex-1 min-w-0">
            <div class="flex items-center">
              <UButton
                to="/admin/registrations"
                color="neutral"
                variant="ghost"
                icon="i-heroicons-arrow-left"
                class="mr-2"
              />
              <h1
                class="text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:text-3xl sm:truncate"
              >
                Registration #{{ registration.id }}
              </h1>
              <span
                class="ml-4 px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                :class="getStatusBadgeClass(registration.status)"
              >
                {{ registration.status }}
              </span>
            </div>
            <div class="mt-1 flex items-center text-sm text-gray-500 dark:text-gray-400">
              <UIcon
                name="i-heroicons-calendar"
                class="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400"
              />
              Registered on {{ formatDate(registration.date) }}
            </div>
          </div>
          <div class="mt-4 flex md:mt-0 md:ml-4 space-x-2">
            <UButton
              color="neutral"
              variant="outline"
              icon="i-heroicons-printer"
              @click="printRegistration"
            >
              Print
            </UButton>
            <UButton
              color="primary"
              icon="i-heroicons-pencil"
              :to="`/admin/registrations/${registration.id}/edit`"
            >
              Edit
            </UButton>
          </div>
        </div>
      </div>
    </div>

    <!-- Main content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Left column -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Personal Information -->
          <div class="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
            <div class="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
              <h3 class="text-lg font-medium leading-6 text-gray-900 dark:text-white">
                Personal Information
              </h3>
            </div>
            <div class="px-6 py-5">
              <dl class="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                <div class="sm:col-span-2">
                  <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Full Name</dt>
                  <dd class="mt-1 text-sm text-gray-900 dark:text-white">
                    {{ registration.name }}
                  </dd>
                </div>
                <div class="sm:col-span-1">
                  <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Email Address
                  </dt>
                  <dd class="mt-1 text-sm text-gray-900 dark:text-white">
                    {{ registration.email }}
                  </dd>
                </div>
                <div class="sm:col-span-1">
                  <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Phone Number</dt>
                  <dd class="mt-1 text-sm text-gray-900 dark:text-white">
                    {{ registration.phone || 'Not provided' }}
                  </dd>
                </div>
                <div class="sm:col-span-1">
                  <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Organization</dt>
                  <dd class="mt-1 text-sm text-gray-900 dark:text-white">
                    {{ registration.organization || 'Not provided' }}
                  </dd>
                </div>
                <div class="sm:col-span-1">
                  <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Registration Type
                  </dt>
                  <dd class="mt-1">
                    <span
                      class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                      :class="getTypeBadgeClass(registration.type)"
                    >
                      {{ registration.type }}
                    </span>
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          <!-- Payment Information -->
          <div class="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
            <div class="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
              <h3 class="text-lg font-medium leading-6 text-gray-900 dark:text-white">
                Payment Information
              </h3>
            </div>
            <div class="px-6 py-5">
              <div class="overflow-hidden">
                <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <tbody
                    class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700"
                  >
                    <tr>
                      <td
                        class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white"
                      >
                        {{ registration.event }} Registration
                      </td>
                      <td
                        class="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900 dark:text-white"
                      >
                        ₦{{ registration.amount.toLocaleString() }}
                      </td>
                    </tr>
                    <tr v-if="registration.discount > 0">
                      <td
                        class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400"
                      >
                        Early Bird Discount ({{ registration.discount }}%)
                      </td>
                      <td
                        class="px-6 py-4 whitespace-nowrap text-right text-sm text-red-600 dark:text-red-400"
                      >
                        -₦{{
                          ((registration.amount * registration.discount) / 100).toLocaleString()
                        }}
                      </td>
                    </tr>
                    <tr class="border-t border-gray-200 dark:border-gray-700">
                      <td
                        class="px-6 py-4 whitespace-nowrap text-base font-medium text-gray-900 dark:text-white"
                      >
                        Total
                      </td>
                      <td
                        class="px-6 py-4 whitespace-nowrap text-right text-base font-medium text-gray-900 dark:text-white"
                      >
                        ₦{{
                          (registration.amount * (1 - registration.discount / 100)).toLocaleString()
                        }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div class="mt-6 border-t border-gray-200 dark:border-gray-700 pt-6">
                <div class="flex items-center justify-between">
                  <div>
                    <h4 class="text-sm font-medium text-gray-900 dark:text-white">
                      Payment Status
                    </h4>
                    <div class="mt-1 flex items-center">
                      <span
                        class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                        :class="getPaymentStatusBadgeClass(registration.paymentStatus)"
                      >
                        {{ registration.paymentStatus }}
                      </span>
                      <span class="ml-2 text-sm text-gray-500 dark:text-gray-400">
                        {{ getPaymentStatusText(registration.paymentStatus) }}
                      </span>
                    </div>
                  </div>

                  <UButton
                    v-if="registration.paymentStatus === 'Pending'"
                    color="success"
                    size="sm"
                    icon="i-heroicons-check-circle"
                    :loading="isUpdatingPayment"
                    @click="markAsPaid"
                  >
                    Mark as Paid
                  </UButton>
                </div>

                <div v-if="registration.paymentMethod" class="mt-4">
                  <h4 class="text-sm font-medium text-gray-900 dark:text-white">Payment Method</h4>
                  <p class="mt-1 text-sm text-gray-900 dark:text-white">
                    {{ registration.paymentMethod }}
                  </p>
                  <p
                    v-if="registration.reference"
                    class="mt-1 text-sm text-gray-500 dark:text-gray-400"
                  >
                    Reference: {{ registration.reference }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right sidebar -->
        <div class="space-y-6">
          <!-- Status -->
          <div class="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
            <div class="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
              <h3 class="text-lg font-medium leading-6 text-gray-900 dark:text-white">
                Registration Status
              </h3>
            </div>
            <div class="px-6 py-5 space-y-4">
              <div>
                <label
                  for="status"
                  class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >Status</label
                >
                <USelect
                  id="status"
                  v-model="registration.status"
                  :options="statusOptions"
                  class="w-full"
                  @update:model-value="updateStatus"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >Assigned To</label
                >
                <div class="flex items-center">
                  <div
                    class="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center"
                  >
                    <span class="text-gray-600 dark:text-gray-300 font-medium">
                      {{ registration.assignedTo ? getInitials(registration.assignedTo) : '?' }}
                    </span>
                  </div>
                  <div class="ml-3">
                    <p class="text-sm font-medium text-gray-900 dark:text-white">
                      {{ registration.assignedTo || 'Unassigned' }}
                    </p>
                  </div>
                  <UButton
                    color="neutral"
                    variant="ghost"
                    size="xs"
                    class="ml-auto"
                    @click="assignToMe"
                  >
                    {{ registration.assignedTo === 'You' ? 'Unassign' : 'Assign to me' }}
                  </UButton>
                </div>
              </div>
            </div>
          </div>

          <!-- Activity -->
          <div class="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
            <div class="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
              <h3 class="text-lg font-medium leading-6 text-gray-900 dark:text-white">
                Recent Activity
              </h3>
            </div>
            <div class="px-6 py-5">
              <div class="flow-root">
                <ul class="-mb-8">
                  <li v-for="activity in activities" :key="activity.id">
                    <div class="relative pb-8">
                      <div class="relative flex space-x-3">
                        <div>
                          <span
                            :class="[
                              activity.iconBackground,
                              'h-6 w-6 rounded-full flex items-center justify-center',
                            ]"
                          >
                            <UIcon :name="activity.icon" class="h-4 w-4 text-white" />
                          </span>
                        </div>
                        <div class="min-w-0 flex-1 pt-0.5">
                          <p class="text-sm text-gray-600 dark:text-gray-300">
                            {{ activity.content }}
                          </p>
                          <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                            {{ activity.date }}
                          </p>
                        </div>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
definePageMeta({
  layout: 'admin',
})

const route = useRoute()
const registrationId = route.params.id as string

// Loading states
const isUpdatingPayment = ref(false)
const isUpdating = ref(false)

// Options
const statusOptions = ['Pending', 'Confirmed', 'Cancelled', 'Refunded', 'Waitlisted']

// Sample registration data - in a real app, this would be fetched from an API
const registration = ref({
  id: registrationId,
  name: 'John Doe',
  email: 'john.doe@example.com',
  phone: '+234 801 234 5678',
  organization: 'Nigerian Medical Association',
  profession: 'Epidemiologist',
  type: 'Member',
  status: 'Confirmed',
  paymentStatus: 'Paid',
  paymentMethod: 'Bank Transfer',
  reference: 'TX123456789',
  amount: 50000,
  discount: 20,
  date: '2023-08-15T10:30:00Z',
  paymentDate: '2023-08-15T11:45:00Z',
  assignedTo: 'You',
  event: 'Annual Conference 2024',
  eventDate: '2024-11-15',
  eventLocation: 'Eko Hotel & Suites, Lagos',
})

// Sample activity data
const activities = ref([
  {
    id: 1,
    content: 'Attendee requested a receipt for tax purposes.',
    date: '2h ago',
    icon: 'i-heroicons-chat-bubble-left-ellipsis',
    iconBackground: 'bg-gray-400',
  },
  {
    id: 2,
    content: 'Payment completed',
    date: '3h ago',
    icon: 'i-heroicons-banknotes',
    iconBackground: 'bg-green-500',
  },
  {
    id: 3,
    content: 'Registration submitted',
    date: '4h ago',
    icon: 'i-heroicons-clipboard-document-check',
    iconBackground: 'bg-blue-500',
  },
])

// Methods
function formatDate(dateString: string): string {
  if (!dateString) return ''
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }
  return new Date(dateString).toLocaleDateString('en-US', options)
}

function getStatusBadgeClass(status: string): string {
  const statusClasses: Record<string, string> = {
    Confirmed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    Pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    Cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    Refunded: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    Waitlisted: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  }
  return statusClasses[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
}

function getPaymentStatusBadgeClass(status: string): string {
  const statusClasses: Record<string, string> = {
    Paid: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    Pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    Failed: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    Refunded: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  }
  return statusClasses[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
}

function getPaymentStatusText(status: string): string {
  const statusText: Record<string, string> = {
    Paid: 'Payment received and confirmed',
    Pending: 'Awaiting payment confirmation',
    Failed: 'Payment failed or was declined',
    Refunded: 'Payment has been refunded',
  }
  return statusText[status] || 'Payment status unknown'
}

function getTypeBadgeClass(type: string): string {
  const typeClasses: Record<string, string> = {
    Member: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    'Non-Member': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    Student: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    Speaker: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    Sponsor: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
  }
  return typeClasses[type] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .substring(0, 2)
}

// Actions
async function markAsPaid() {
  isUpdatingPayment.value = true
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Update local state
    registration.value.paymentStatus = 'Paid'
    registration.value.paymentDate = new Date().toISOString()

    // Add activity
    activities.value.unshift({
      id: activities.value.length + 1,
      content: 'Marked as paid by admin',
      date: 'Just now',
      icon: 'i-heroicons-banknotes',
      iconBackground: 'bg-green-500',
    })

    useToast().add({
      title: 'Payment status updated',
      description: 'Registration has been marked as paid',
      icon: 'i-heroicons-check-circle',
      color: 'success',
    })
  } catch (error) {
    console.error('Error updating payment status:', error)
    useToast().add({
      title: 'Error',
      description: 'Failed to update payment status',
      icon: 'i-heroicons-exclamation-circle',
      color: 'error',
    })
  } finally {
    isUpdatingPayment.value = false
  }
}

async function updateStatus() {
  isUpdating.value = true
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))

    // Add activity
    activities.value.unshift({
      id: activities.value.length + 1,
      content: `Status changed to ${registration.value.status}`,
      date: 'Just now',
      icon: 'i-heroicons-flag',
      iconBackground: 'bg-blue-500',
    })

    useToast().add({
      title: 'Status updated',
      icon: 'i-heroicons-check-circle',
      color: 'success',
    })
  } catch (error) {
    console.error('Error updating status:', error)
    useToast().add({
      title: 'Error',
      description: 'Failed to update status',
      icon: 'i-heroicons-exclamation-circle',
      color: 'error',
    })
  } finally {
    isUpdating.value = false
  }
}

function assignToMe() {
  if (registration.value.assignedTo === 'You') {
    registration.value.assignedTo = ''
    useToast().add({
      title: 'Assignment removed',
      icon: 'i-heroicons-check-circle',
      color: 'success',
    })
  } else {
    registration.value.assignedTo = 'You'
    useToast().add({
      title: 'Assigned to you',
      icon: 'i-heroicons-check-circle',
      color: 'success',
    })
  }
}

function printRegistration() {
  window.print()
}

// Fetch registration data on component mount
onMounted(async () => {
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))
  } catch (error) {
    console.error('Error loading registration:', error)
    useToast().add({
      title: 'Error',
      description: 'Failed to load registration details',
      icon: 'i-heroicons-exclamation-circle',
      color: 'error',
    })
  }
})
</script>
