<template>
  <form @submit.prevent="saveChanges">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center space-x-4">
        <UButton
          color="neutral"
          variant="ghost"
          icon="i-heroicons-arrow-left"
          @click="$router.push(`/admin/registrations/${registration.id}`)"
        >
          Back
        </UButton>
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
            Edit Registration #{{ registration.id }}
          </h1>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Update attendee details and registration information
          </p>
        </div>
      </div>
      <div class="flex space-x-2">
        <UButton
          color="neutral"
          variant="outline"
          type="button"
          @click="$router.push(`/admin/registrations/${registration.id}`)"
        >
          Cancel
        </UButton>
        <UButton type="submit" color="primary" :loading="isSaving"> Save Changes </UButton>
      </div>
    </div>

    <!-- Form container -->
    <div class="max-w-4xl">
      <UCard>
        <template #header>
          <h3 class="text-lg font-semibold">Personal Information</h3>
        </template>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <UFormField :error="errors.name" label="Full Name" required>
            <UInput v-model="form.name" placeholder="Enter full name" />
          </UFormField>

          <UFormField :error="errors.email" label="Email Address" required>
            <UInput v-model="form.email" type="email" placeholder="Enter email address" />
          </UFormField>

          <UFormField :error="errors.phone" label="Phone Number">
            <UInput v-model="form.phone" type="tel" placeholder="Enter phone number" />
          </UFormField>

          <UFormField :error="errors.organization" label="Organization">
            <UInput v-model="form.organization" placeholder="Enter organization name" />
          </UFormField>
        </div>
      </UCard>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

definePageMeta({
  layout: 'admin',
})

type FormData = {
  id: string
  name: string
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
  name: (value: string) => {
    if (!value) return 'Name is required'
    return ''
  },
  email: (value: string) => {
    if (!value) return 'Email is required'
    if (!/\S+@\S+\.\S+/.test(value)) return 'Email is invalid'
    return ''
  },
  phone: () => '',
  organization: () => '',
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
  id: '',
  name: '',
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

async function saveChanges() {
  try {
    // Validate form
    errors.value = {}
    let isValid = true

    ;(Object.keys(registrationSchema) as Array<keyof typeof registrationSchema>).forEach(key => {
      // The schema contains validators with different input types per field.
      // We cast locally to avoid a broad type that would cause "never" inference.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const validate = registrationSchema[key] as (v: any) => string
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const value = form.value[key as keyof FormData] as any
      const error = validate(value)
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

    // Call real update registration endpoint
    const { updateRegistration } = useEvents()
    await updateRegistration(registrationId, {
      attendeeName: form.value.name.trim(),
      attendeeEmail: form.value.email,
      attendeePhone: form.value.phone,
      attendeeOrg: form.value.organization,
      category: form.value.type,
      paymentStatus: form.value.paymentStatus as 'Pending' | 'Paid' | 'Cancelled' | 'Refunded',
      paymentProvider: form.value.paymentMethod,
      reference: form.value.reference,
      notes: form.value.notes,
      unitPrice: form.value.amount, // UI amount is in Naira, PATCH converts it to kobo
    })

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
    interface RegistrationDetail {
      id: string
      eventId: string
      eventTitle?: string
      attendeeName: string
      attendeeEmail: string
      attendeePhone?: string | null
      attendeeOrg?: string | null
      category?: string | null
      ticketId?: string | null
      ticketName?: string | null
      unitPrice: number
      quantity: number
      currency: string
      totalAmount: number
      paymentStatus: 'Pending' | 'Paid' | 'Cancelled' | 'Refunded'
      reference?: string | null
      paymentProvider?: string | null
      paidAt?: string | null
      refundedAt?: string | null
      registeredAt: string
      notes?: string | null
    }

    const res = await $fetch<{ success: boolean; data: RegistrationDetail }>(
      `/api/admin/registrations/${registrationId}`
    )
    const data = res?.data
    if (data) {
      const mappedData = {
        id: data.id,
        name: data.attendeeName || '',
        email: data.attendeeEmail || '',
        phone: data.attendeePhone || '',
        organization: data.attendeeOrg || '',
        profession: '',
        type: data.category || 'Member',
        status: 'Confirmed',
        paymentStatus: data.paymentStatus || 'Pending',
        paymentMethod: data.paymentProvider || '',
        paymentDate: data.paidAt || new Date().toISOString(),
        reference: data.reference || '',
        amount: Math.round((data.unitPrice || 0) / 100), // convert kobo to Naira
        discount: 0,
        date: data.registeredAt || new Date().toISOString(),
        dietaryRequirements: '',
        specialRequirements: '',
        notes: data.notes || '',
        event: data.eventId || '',
        assignedTo: '',
        tags: [],
      }

      registration.value = { ...mappedData, id: registrationId }
      Object.assign(form.value, mappedData)
    }
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
