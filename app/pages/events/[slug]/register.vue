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

            <UFormField label="Select Ticket" name="ticket" required>
              <div class="space-y-6">
                <!-- Categorized Tickets -->
                <div
                  v-for="category in ticketStructure.categorized"
                  :key="category.id"
                  class="space-y-3"
                >
                  <div class="border-l-4 border-primary-500 pl-4">
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                      {{ category.name }}
                    </h3>
                    <p
                      v-if="category.description"
                      class="text-sm text-gray-600 dark:text-gray-300 mt-1"
                    >
                      {{ category.description }}
                    </p>
                  </div>

                  <div class="ml-6 space-y-3">
                    <div
                      v-for="ticket in category.tickets"
                      :key="ticket.id"
                      class="relative flex items-start p-4 border rounded-lg cursor-pointer transition-all"
                      :class="[
                        form.ticket === ticket.id
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600',
                      ]"
                      @click="form.ticket = ticket.id"
                    >
                      <div class="flex items-center h-5">
                        <URadio
                          v-model="form.ticket"
                          :value="ticket.id"
                          class="pointer-events-none"
                        />
                      </div>
                      <div class="ml-3 flex-1">
                        <div class="flex items-center justify-between">
                          <label
                            class="font-medium text-gray-900 dark:text-white cursor-pointer"
                            @click.stop="form.ticket = ticket.id"
                          >
                            {{ ticket.name }}
                          </label>
                          <span
                            class="text-lg font-semibold text-primary-600 dark:text-primary-400"
                          >
                            ₦{{ (ticket.price / 100).toLocaleString() }}
                          </span>
                        </div>
                        <p
                          v-if="ticket.description"
                          class="text-sm text-gray-500 dark:text-gray-400 mt-1"
                        >
                          {{ ticket.description }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Uncategorized Tickets -->
                <div v-if="ticketStructure.uncategorized.length" class="space-y-3">
                  <h3
                    v-if="ticketStructure.categorized.length"
                    class="text-lg font-semibold text-gray-900 dark:text-white"
                  >
                    Other Tickets
                  </h3>

                  <div class="space-y-3">
                    <div
                      v-for="ticket in ticketStructure.uncategorized"
                      :key="ticket.id"
                      class="relative flex items-start p-4 border rounded-lg cursor-pointer transition-all"
                      :class="[
                        form.ticket === ticket.id
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600',
                      ]"
                      @click="form.ticket = ticket.id"
                    >
                      <div class="flex items-center h-5">
                        <URadio
                          v-model="form.ticket"
                          :value="ticket.id"
                          class="pointer-events-none"
                        />
                      </div>
                      <div class="ml-3 flex-1">
                        <div class="flex items-center justify-between">
                          <label
                            class="font-medium text-gray-900 dark:text-white cursor-pointer"
                            @click.stop="form.ticket = ticket.id"
                          >
                            {{ ticket.name }}
                          </label>
                          <span
                            class="text-lg font-semibold text-primary-600 dark:text-primary-400"
                          >
                            ₦{{ (ticket.price / 100).toLocaleString() }}
                          </span>
                        </div>
                        <p
                          v-if="ticket.description"
                          class="text-sm text-gray-500 dark:text-gray-400 mt-1"
                        >
                          {{ ticket.description }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </UFormField>

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

import type { TicketDisplayStructure } from '../../../../types/event'

const route = useRoute()
const slug = computed(() => route.params.slug as string)
const { getPublicEventBySlug, getPublicTicketsStructured, createPublicEventRegistration } =
  useEvents()

// Fetch the public event by slug (same as detail page)
const { data: eventResponse } = await getPublicEventBySlug(slug.value)
const event = computed(() => eventResponse.value)

// Fetch structured tickets
const { data: ticketsResponse } = await getPublicTicketsStructured(event.value?.id || '')
const ticketStructure = computed<TicketDisplayStructure>(
  () => ticketsResponse.value?.data || { categorized: [], uncategorized: [] }
)

const submitting = ref(false)

const form = reactive({
  name: '',
  email: '',
  org: '',
  phone: '',
  ticket: '' as string,
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

// Initialize selected ticket when tickets load
watchEffect(() => {
  const structure = ticketStructure.value
  const firstTicket = structure.categorized[0]?.tickets[0] || structure.uncategorized[0]
  if (!form.ticket && firstTicket) {
    form.ticket = firstTicket.id
  }
})

const { initializePayment } = usePaystack()

async function onSubmit() {
  const errors = validate()
  if (errors) return
  submitting.value = true

  try {
    // 1) Create registration on the server to generate a payment reference
    const registration = await createPublicEventRegistration(
      String((event.value as { id?: string | number })?.id || ''),
      {
        attendeeName: form.name,
        attendeeEmail: form.email,
        ticketId: form.ticket || undefined,
        quantity: 1,
      }
    )

    // If totalAmount is 0, no payment required – navigate to success
    if (!registration.totalAmount || registration.totalAmount <= 0) {
      const url = `/events/${slug.value}/register-success?reference=${encodeURIComponent(registration.paymentReference || '')}&email=${encodeURIComponent(form.email)}`
      try {
        await navigateTo(url, { replace: true })
      } catch {
        if (typeof window !== 'undefined') window.location.href = url
      }
      return
    }

    // 2) Initialize Paystack using server-provided payment data
    const ref = registration.paymentData?.reference || registration.paymentReference || ''
    const amountNaira = (registration.paymentData?.amount ?? registration.totalAmount) / 100

    const result = await initializePayment({
      email: form.email,
      amount: amountNaira,
      reference: ref,
      metadata: {
        eventId: String((event.value as { id?: string | number })?.id || ''),
        eventSlug: slug.value,
        eventTitle: event.value?.title,
        registrantName: form.name,
        organization: form.org,
        phone: form.phone,
        ticketId: form.ticket,
        type: 'event_registration',
      },
      onCancel: () => {
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
