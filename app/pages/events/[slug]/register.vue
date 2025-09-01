<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="mb-8">
        <NuxtLink :to="`/events/${slug}`" class="text-sm text-primary-600 hover:underline"
          >← Back to event</NuxtLink
        >
        <h1 class="mt-2 text-3xl font-bold text-gray-900 dark:text-white">Event Registration</h1>
        <p v-if="event" class="mt-1 text-gray-600 dark:text-gray-300">{{ event.title }}</p>
      </div>

      <div class="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        <div class="px-6 py-6">
          <UForm :state="form" class="space-y-6" @submit="onSubmit">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <UFormField label="Full name" name="name" required>
                <UInput v-model="form.name" placeholder="Your full name" class="w-full" />
              </UFormField>
              <UFormField label="Email" name="email" required>
                <UInput
                  v-model="form.email"
                  type="email"
                  placeholder="you@example.com"
                  class="w-full"
                />
              </UFormField>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <UFormField label="Organisation" name="org">
                <UInput
                  v-model="form.org"
                  placeholder="Your organisation (optional)"
                  class="w-full"
                />
              </UFormField>
              <UFormField label="Phone" name="phone">
                <UInput
                  v-model="form.phone"
                  type="tel"
                  placeholder="Phone (optional)"
                  class="w-full"
                />
              </UFormField>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <UFormField label="Ticket" name="ticket" required>
                <USelect
                  v-model="form.ticket"
                  :items="tickets"
                  option-attribute="label"
                  value-attribute="value"
                  class="w-full"
                />
              </UFormField>
              <div class="flex items-end">
                <div class="text-gray-900 dark:text-white">
                  <p class="text-sm">Amount</p>
                  <p class="text-2xl font-semibold">
                    ₦{{ (selectedAmount / 100).toLocaleString() }}
                  </p>
                </div>
              </div>
            </div>

            <div class="flex items-center justify-between pt-2">
              <p class="text-xs text-gray-500 dark:text-gray-400">
                Payments are processed securely by Paystack.
              </p>
              <UButton type="submit" color="primary" :loading="submitting">Pay & Register</UButton>
            </div>
          </UForm>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { z } from 'zod'

const route = useRoute()
const slug = computed(() => route.params.slug as string)
const { events } = useEvents()
const event = computed(() =>
  events.value.find(
    e =>
      e &&
      e.title &&
      e.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-') === slug.value
  )
)

const submitting = ref(false)

// Single unified pricing for all events (amount in kobo)
const BASE_AMOUNT_KOBO = 10000 * 100 // ₦10,000

const tickets = [
  { label: 'Standard (₦10,000)', value: 'standard', amount: BASE_AMOUNT_KOBO },
  { label: 'Premium (₦20,000)', value: 'premium', amount: BASE_AMOUNT_KOBO * 2 },
  { label: 'Platinum (₦50,000)', value: 'platinum', amount: BASE_AMOUNT_KOBO * 5 },
]

const form = reactive({
  name: '',
  email: '',
  org: '',
  phone: '',
  ticket: tickets[0]?.value as string,
})

const schema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email required'),
  org: z.string().optional(),
  phone: z.string().optional(),
  ticket: z.string().min(1, 'Select a ticket'),
})

function validate() {
  const res = schema.safeParse(form)
  if (!res.success) {
    const issues: Record<string, string> = {}
    res.error.issues.forEach(i => {
      const path = i.path[0] as string
      issues[path] = i.message
    })
    return issues
  }
  return
}

const selectedAmount = computed(
  () => tickets.find(t => t.value === form.ticket)?.amount ?? BASE_AMOUNT_KOBO
)

const { initializePayment } = usePaystack()

async function onSubmit() {
  const errors = validate()
  if (errors) return
  submitting.value = true

  try {
    const amountNaira = selectedAmount.value / 100 // Convert from kobo to Naira
    // Await payment result and then navigate in page context
    const result = await initializePayment({
      email: form.email,
      amount: amountNaira,
      metadata: {
        eventSlug: slug.value,
        eventTitle: event.value?.title,
        registrantName: form.name,
        organization: form.org,
        phone: form.phone,
        ticketType: form.ticket,
        type: 'event_registration',
      },
      onCancel: () => {
        // Payment was cancelled, keep user on form
        console.log('Payment cancelled by user')
      },
      onError: error => {
        console.error('Payment error:', error)
      },
    })

    if (result?.reference) {
      const url = `/events/${slug.value}/register-success?reference=${encodeURIComponent(result.reference)}&email=${encodeURIComponent(form.email)}`
      try {
        await navigateTo(url, { replace: true })
      } catch {
        if (typeof window !== 'undefined') window.location.href = url
      }
    }
  } catch (err) {
    console.error('Registration error:', err)
  } finally {
    submitting.value = false
  }
}
</script>
