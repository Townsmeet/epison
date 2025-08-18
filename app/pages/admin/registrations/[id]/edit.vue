<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Page header -->
    <div class="bg-white dark:bg-gray-800 shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="md:flex md:items-center md:justify-between">
          <div class="flex-1 min-w-0">
            <div class="flex items-center">
              <UButton
                :to="`/admin/registrations/${registration.id}`"
                color="neutral"
                variant="ghost"
                icon="i-heroicons-arrow-left"
                class="mr-2"
              />
              <h1
                class="text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:text-3xl sm:truncate"
              >
                Edit Registration #{{ registration.id }}
              </h1>
            </div>
          </div>
          <div class="mt-4 flex md:mt-0 md:ml-4 space-x-2">
            <UButton
              color="neutral"
              variant="outline"
              @click="$router.push(`/admin/registrations/${registration.id}`)"
            >
              Cancel
            </UButton>
            <UButton type="submit" color="primary" :loading="isSaving" @click="saveChanges">
              Save Changes
            </UButton>
          </div>
        </div>
      </div>
    </div>

    <!-- Main content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div class="space-y-6">
        <!-- Form sections -->
        <div class="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
          <div class="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
            <h3 class="text-lg font-medium leading-6 text-gray-900 dark:text-white">
              Personal Information
            </h3>
          </div>
          <div class="px-6 py-5">
            <div class="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div class="sm:col-span-3">
                <UFormGroup :error="errors.firstName" label="First Name" name="firstName" required>
                  <UInput v-model="form.firstName" />
                </UFormGroup>
              </div>
              <div class="sm:col-span-3">
                <UFormGroup :error="errors.lastName" label="Last Name" name="lastName" required>
                  <UInput v-model="form.lastName" />
                </UFormGroup>
              </div>
              <div class="sm:col-span-4">
                <UFormGroup :error="errors.email" label="Email Address" name="email" required>
                  <UInput v-model="form.email" type="email" />
                </UFormGroup>
              </div>
              <div class="sm:col-span-2">
                <UFormGroup :error="errors.phone" label="Phone Number" name="phone">
                  <UInput v-model="form.phone" type="tel" />
                </UFormGroup>
              </div>
              <div class="sm:col-span-3">
                <UFormGroup :error="errors.organization" label="Organization" name="organization">
                  <UInput v-model="form.organization" />
                </UFormGroup>
              </div>
              <div class="sm:col-span-3">
                <UFormGroup :error="errors.profession" label="Profession" name="profession">
                  <UInput v-model="form.profession" />
                </UFormGroup>
              </div>
              <div class="sm:col-span-3">
                <UFormGroup :error="errors.type" label="Registration Type" name="type" required>
                  <USelect v-model="form.type" :options="registrationTypes" />
                </UFormGroup>
              </div>
              <div class="sm:col-span-3">
                <UFormGroup
                  :error="errors.status"
                  label="Registration Status"
                  name="status"
                  required
                >
                  <USelect v-model="form.status" :options="statusOptions" />
                </UFormGroup>
              </div>
              <div class="sm:col-span-3">
                <UFormGroup
                  :error="errors.paymentStatus"
                  label="Payment Status"
                  name="paymentStatus"
                  required
                >
                  <USelect v-model="form.paymentStatus" :options="paymentStatusOptions" />
                </UFormGroup>
              </div>
              <div v-if="form.paymentStatus === 'Paid'" class="sm:col-span-3">
                <UFormGroup
                  :error="errors.paymentDate"
                  label="Payment Date"
                  name="paymentDate"
                  required
                >
                  <UPopover>
                    <UButton
                      variant="outline"
                      :label="form.paymentDate ? formatDate(form.paymentDate) : 'Select date'"
                      icon="i-heroicons-calendar"
                    />
                    <template #panel>
                      <DatePicker v-model="form.paymentDate" />
                    </template>
                  </UPopover>
                </UFormGroup>
              </div>
              <div class="sm:col-span-3">
                <UFormGroup
                  :error="errors.paymentMethod"
                  label="Payment Method"
                  name="paymentMethod"
                >
                  <UInput v-model="form.paymentMethod" />
                </UFormGroup>
              </div>
              <div class="sm:col-span-3">
                <UFormGroup :error="errors.reference" label="Reference Number" name="reference">
                  <UInput v-model="form.reference" />
                </UFormGroup>
              </div>
              <div class="sm:col-span-3">
                <UFormGroup :error="errors.amount" label="Registration Fee" name="amount" required>
                  <UInputGroup>
                    <span
                      class="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-300 text-sm"
                    >
                      ₦
                    </span>
                    <UInput
                      :model-value="form.amount"
                      type="number"
                      step="0.01"
                      min="0"
                      @update:model-value="val => (form.amount = Number(val))"
                    />
                  </UInputGroup>
                </UFormGroup>
              </div>
              <div class="sm:col-span-3">
                <UFormGroup :error="errors.discount" label="Discount (%)" name="discount">
                  <UInput
                    :model-value="form.discount"
                    type="number"
                    min="0"
                    max="100"
                    @update:model-value="val => (form.discount = Number(val))"
                  />
                </UFormGroup>
              </div>
              <div class="sm:col-span-3">
                <UFormGroup
                  :error="errors.finalAmount"
                  label="Final Amount"
                  name="finalAmount"
                  disabled
                >
                  <UInputGroup>
                    <span
                      class="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-300 text-sm"
                    >
                      ₦
                    </span>
                    <UInput :value="finalAmount.toLocaleString()" disabled />
                  </UInputGroup>
                </UFormGroup>
              </div>
              <div class="sm:col-span-6">
                <UFormGroup
                  :error="errors.dietaryRequirements"
                  label="Dietary Requirements"
                  name="dietaryRequirements"
                >
                  <UTextarea v-model="form.dietaryRequirements" />
                </UFormGroup>
              </div>
              <div class="sm:col-span-6">
                <UFormGroup
                  :error="errors.specialRequirements"
                  label="Special Requirements"
                  name="specialRequirements"
                >
                  <UTextarea v-model="form.specialRequirements" />
                </UFormGroup>
              </div>
              <div class="sm:col-span-6">
                <UFormGroup :error="errors.notes" label="Admin Notes" name="notes">
                  <UTextarea v-model="form.notes" rows="4" />
                  <template #description>
                    <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Internal notes about this registration (not visible to attendee)
                    </p>
                  </template>
                </UFormGroup>
              </div>
            </div>
          </div>
        </div>

        <!-- Event Information -->
        <div class="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
          <div class="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
            <h3 class="text-lg font-medium leading-6 text-gray-900 dark:text-white">
              Event Information
            </h3>
          </div>
          <div class="px-6 py-5">
            <div class="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div class="sm:col-span-6">
                <UFormGroup :error="errors.event" label="Event" name="event" required>
                  <USelect
                    v-model="form.event"
                    :options="eventOptions"
                    option-attribute="name"
                    value-attribute="id"
                  />
                </UFormGroup>
              </div>
              <div class="sm:col-span-3">
                <UFormGroup :error="errors.date" label="Registration Date" name="date" required>
                  <UPopover>
                    <UButton
                      variant="outline"
                      :label="form.date ? formatDate(form.date) : 'Select date'"
                      icon="i-heroicons-calendar"
                    />
                    <template #panel>
                      <DatePicker v-model="form.date" />
                    </template>
                  </UPopover>
                </UFormGroup>
              </div>
              <div class="sm:col-span-3">
                <UFormGroup :error="errors.assignedTo" label="Assigned To" name="assignedTo">
                  <USelect
                    v-model="form.assignedTo"
                    :options="adminUsers"
                    placeholder="Unassigned"
                  />
                </UFormGroup>
              </div>
              <div class="sm:col-span-6">
                <UFormGroup :error="errors.tags" label="Tags" name="tags">
                  <USelectMenu
                    v-model="form.tags"
                    :options="tagOptions"
                    multiple
                    placeholder="Add tags..."
                  >
                    <template #label>
                      <span v-if="form.tags.length === 0" class="text-gray-400">Add tags...</span>
                      <span v-else class="truncate">{{ form.tags.join(', ') }}</span>
                    </template>
                  </USelectMenu>
                </UFormGroup>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

type FormData = {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  organization: string
  profession: string
  type: string
  status: string
  paymentStatus: string
  paymentMethod: string
  paymentDate: string
  reference: string
  amount: number
  discount: number
  date: string
  dietaryRequirements: string
  specialRequirements: string
  notes: string
  event: string
  assignedTo: string
  tags: string[]
}

// Form validation schema
const registrationSchema = {
  firstName: (value: string) => {
    if (!value) return 'First name is required'
    return ''
  },
  lastName: (value: string) => {
    if (!value) return 'Last name is required'
    return ''
  },
  email: (value: string) => {
    if (!value) return 'Email is required'
    if (!/\S+@\S+\.\S+/.test(value)) return 'Email is invalid'
    return ''
  },
  phone: () => '',
  organization: () => '',
  profession: () => '',
  type: (value: string) => {
    if (!value) return 'Registration type is required'
    return ''
  },
  status: (value: string) => {
    if (!value) return 'Status is required'
    return ''
  },
  paymentStatus: (value: string) => {
    if (!value) return 'Payment status is required'
    return ''
  },
  paymentMethod: () => '',
  paymentDate: () => '',
  reference: () => '',
  amount: (value: number) => {
    if (value < 0) return 'Amount must be positive'
    return ''
  },
  discount: (value: number) => {
    if (value < 0 || value > 100) return 'Discount must be between 0 and 100'
    return ''
  },
  date: (value: string) => {
    if (!value) return 'Registration date is required'
    return ''
  },
  dietaryRequirements: () => '',
  specialRequirements: () => '',
  notes: () => '',
  event: (value: string) => {
    if (!value) return 'Event is required'
    return ''
  },
  assignedTo: () => '',
  tags: () => '',
}

const route = useRoute()
const router = useRouter()

const registrationId = route.params.id as string

// Registration data
const registration = ref({
  id: registrationId,
  // Add other default values as needed
})

// Loading states
const isLoading = ref(true)
const isSaving = ref(false)

// Form data
const form = ref<FormData>({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  organization: '',
  profession: '',
  type: 'Member',
  status: 'Pending',
  paymentStatus: 'Pending',
  paymentMethod: '',
  paymentDate: new Date().toISOString(),
  reference: '',
  amount: 0,
  discount: 0,
  date: new Date().toISOString(),
  dietaryRequirements: '',
  specialRequirements: '',
  notes: '',
  event: '',
  assignedTo: '',
  tags: [],
})

const errors = ref<Record<string, string>>({})
const _formRef = ref<HTMLFormElement>()
const _validation = ref<{ valid: boolean; errors: string[] }>({ valid: true, errors: [] })

// Options
const registrationTypes = ['Member', 'Non-Member', 'Student', 'Speaker', 'Sponsor', 'Exhibitor']
const statusOptions = ['Pending', 'Confirmed', 'Cancelled', 'Refunded', 'Waitlisted']
const paymentStatusOptions = ['Pending', 'Paid', 'Failed', 'Refunded']
const tagOptions = ['VIP', 'Speaker', 'Sponsor', 'Media', 'Volunteer', 'Staff']

// Sample events - in a real app, this would be fetched from an API
const eventOptions = [
  { id: 'annual-conference-2024', name: '29th Annual Scientific Conference 2024' },
  { id: 'public-health-forum-2024', name: 'Public Health Forum 2024' },
  { id: 'research-symposium-2024', name: 'Research Symposium 2024' },
]

// Sample admin users - in a real app, this would be fetched from an API
const adminUsers = [
  { id: 'admin@example.com', name: 'Admin User' },
  { id: 'john@example.com', name: 'John Smith' },
  { id: 'sarah@example.com', name: 'Sarah Johnson' },
]

// Computed
const finalAmount = computed(() => {
  const amount = form.value.amount || 0
  const discount = form.value.discount || 0
  return amount * (1 - discount / 100)
})

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

async function saveChanges() {
  try {
    // Validate form
    errors.value = {}
    let isValid = true

    Object.keys(registrationSchema).forEach(key => {
      const error = registrationSchema[key as keyof typeof registrationSchema](
        form.value[key as keyof FormData]
      )
      if (error) {
        errors.value[key as keyof FormData] = error
        isValid = false
      }
    })

    if (!isValid) {
      useToast().add({
        title: 'Validation Error',
        description: 'Please check the form for errors',
        icon: 'i-heroicons-exclamation-triangle',
        color: 'warning',
      })
      return
    }

    isSaving.value = true

    // In a real app, this would be an API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Reset errors on successful save
    errors.value = {}

    useToast().add({
      title: 'Registration updated',
      description: 'The registration has been successfully updated',
      icon: 'i-heroicons-check-circle',
      color: 'success',
    })

    // Redirect back to the registration detail page
    router.push(`/admin/registrations/${registrationId}`)
  } catch (error) {
    console.error('Error saving registration:', error)
    useToast().add({
      title: 'Error',
      description: error instanceof Error ? error.message : 'Failed to update registration',
      icon: 'i-heroicons-exclamation-circle',
      color: 'error',
    })
  } finally {
    isSaving.value = false
  }
}

// Fetch registration data on component mount
onMounted(async () => {
  try {
    // Simulate API call to fetch registration data
    await new Promise(resolve => setTimeout(resolve, 500))

    // Update the registration ref with the fetched data
    const registrationData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '+234 801 234 5678',
      organization: 'Nigerian Medical Association',
      profession: 'Epidemiologist',
      type: 'Member',
      status: 'Confirmed',
      paymentStatus: 'Paid',
      paymentMethod: 'Bank Transfer',
      paymentDate: '2023-08-15T11:45:00Z',
      reference: 'TX123456789',
      amount: 50000,
      discount: 20,
      date: '2023-08-15T10:30:00Z',
      dietaryRequirements: 'Vegetarian, No nuts',
      specialRequirements: 'Wheelchair access required',
      notes: 'VIP attendee - ensure front row seating',
      event: 'annual-conference-2024',
      assignedTo: 'admin@example.com',
      tags: ['VIP', 'Speaker'],
    }

    // Update registration and form with fetched data
    registration.value = { ...registrationData, id: registrationId }
    Object.assign(form.value, registrationData)
  } catch (error) {
    console.error('Error loading registration:', error)
    useToast().add({
      title: 'Error',
      description: 'Failed to load registration details',
      icon: 'i-heroicons-exclamation-circle',
      color: 'error',
    })
  } finally {
    isLoading.value = false
  }
})
</script>
