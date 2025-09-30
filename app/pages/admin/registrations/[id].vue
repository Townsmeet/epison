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
                Registration #{{ reg?.id || '...' }}
              </h1>
              <span
                v-if="reg"
                class="ml-4 px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                :class="getPaymentStatusBadgeClass(reg.paymentStatus)"
              >
                {{ reg.paymentStatus }}
              </span>
            </div>
            <div class="mt-1 flex items-center text-sm text-gray-500 dark:text-gray-400">
              <UIcon
                name="i-heroicons-calendar"
                class="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400"
              />
              <span v-if="reg">Registered on {{ formatDate(reg.registeredAt) }}</span>
              <span v-else>Loading...</span>
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
              :to="`/admin/registrations/${reg?.id}/edit`"
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
              <dl v-if="reg" class="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                <div class="sm:col-span-2">
                  <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Full Name</dt>
                  <dd class="mt-1 text-sm text-gray-900 dark:text-white">
                    {{ reg.attendeeName }}
                  </dd>
                </div>
                <div class="sm:col-span-1">
                  <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Email Address
                  </dt>
                  <dd class="mt-1 text-sm text-gray-900 dark:text-white">
                    {{ reg.attendeeEmail }}
                  </dd>
                </div>
                <div class="sm:col-span-1">
                  <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Registration Type
                  </dt>
                  <dd class="mt-1">
                    <span
                      class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                      :class="getTypeBadgeClass(reg.category || 'Member')"
                    >
                      {{ reg.category || 'Member' }}
                    </span>
                  </dd>
                </div>
              </dl>
              <div v-else class="text-sm text-gray-600 dark:text-gray-300">Loading...</div>
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
                <table v-if="reg" class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <tbody
                    class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700"
                  >
                    <tr>
                      <td
                        class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white"
                      >
                        {{ reg.ticketName || 'Event' }} Registration ({{
                          reg.eventTitle || 'Event'
                        }})
                      </td>
                      <td
                        class="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900 dark:text-white"
                      >
                        ₦{{ asNaira(reg.unitPrice).toLocaleString() }} x {{ reg.quantity }}
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
                        ₦{{ asNaira(reg.totalAmount).toLocaleString() }}
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
                        v-if="reg"
                        class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                        :class="getPaymentStatusBadgeClass(reg.paymentStatus)"
                      >
                        {{ reg.paymentStatus }}
                      </span>
                      <span class="ml-2 text-sm text-gray-500 dark:text-gray-400">
                        {{ reg ? getPaymentStatusText(reg.paymentStatus) : '' }}
                      </span>
                    </div>
                  </div>

                  <UButton
                    v-if="reg && reg.paymentStatus === 'Pending'"
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

        <!-- Right sidebar intentionally left empty; removed unsupported Status and Recent Activity cards -->
        <div class="space-y-6" />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
definePageMeta({
  layout: 'admin',
})

const route = useRoute()
const registrationId = route.params.id as string

// Loading states
const isUpdatingPayment = ref(false)

// Options (removed unused statusOptions)

// Real registration detail
type RegistrationDetail = {
  id: string
  eventId: string
  eventTitle?: string
  attendeeName: string
  attendeeEmail: string
  category?: string
  ticketId?: string
  ticketName?: string
  unitPrice: number
  quantity: number
  currency: string
  totalAmount: number
  paymentStatus: 'Pending' | 'Paid' | 'Cancelled' | 'Refunded'
  reference?: string
  paymentProvider?: string
  paidAt?: string | Date | null
  refundedAt?: string | Date | null
  registeredAt: string | Date
  notes?: string
}

const reg = ref<RegistrationDetail | null>(null)

// Adapter to keep some existing uses working
const registration = computed(() => {
  const r = reg.value
  if (!r) {
    return {
      id: registrationId,
      name: '',
      email: '',
      type: 'Member',
      paymentStatus: 'Pending',
      paymentMethod: '',
      reference: '',
      amount: 0,
      discount: 0,
      date: '',
      event: '',
    }
  }
  return {
    id: r.id,
    name: r.attendeeName,
    email: r.attendeeEmail,
    type: r.category || 'Member',
    paymentStatus: r.paymentStatus,
    paymentMethod: r.paymentProvider || '',
    reference: r.reference || '',
    amount: asNaira(r.unitPrice),
    discount: 0,
    date: r.registeredAt,
    event: r.eventTitle || 'Event',
  }
})

function asNaira(kobo?: number) {
  return Math.round((kobo || 0) / 100)
}

// Methods
function formatDate(dateInput: string | Date): string {
  if (!dateInput) return ''
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }
  const d = typeof dateInput === 'string' ? new Date(dateInput) : dateInput
  return d.toLocaleDateString('en-US', options)
}

// Removed unused getStatusBadgeClass

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

// Removed unused getInitials

// Actions
async function markAsPaid() {
  isUpdatingPayment.value = true
  try {
    await $fetch(`/api/admin/registrations/${registrationId}/status`, {
      method: 'PATCH',
      body: { paymentStatus: 'Paid' },
    })
    if (reg.value) {
      reg.value.paymentStatus = 'Paid'
      reg.value.paidAt = new Date()
    }

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

function printRegistration() {
  window.print()
}

// Fetch registration data on component mount
onMounted(async () => {
  try {
    const res = await $fetch<{ success: boolean; data: RegistrationDetail }>(
      `/api/admin/registrations/${registrationId}`
    )
    reg.value = res?.data || null
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
