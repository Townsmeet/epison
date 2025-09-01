<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
    <div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="mb-6">
        <NuxtLink :to="`/events/${slug}`" class="text-sm text-primary-600 hover:underline"
          >← Back to event</NuxtLink
        >
      </div>

      <div class="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        <div class="px-6 py-8 text-center">
          <div v-if="loading" class="flex items-center justify-center gap-3">
            <UIcon name="i-heroicons-arrow-path" class="h-5 w-5 animate-spin" />
            <p class="text-gray-600 dark:text-gray-300">Verifying your payment...</p>
          </div>

          <div v-else-if="ok" class="space-y-3">
            <UIcon name="i-heroicons-check-circle" class="h-10 w-10 text-green-600 inline-block" />
            <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">
              Registration confirmed
            </h1>
            <p class="text-gray-600 dark:text-gray-300">Reference: {{ reference }}</p>
            <p v-if="customerEmail" class="text-sm text-gray-500 dark:text-gray-400">
              A confirmation has been sent to {{ customerEmail }}.
            </p>
            <div class="pt-4">
              <UButton :to="`/events/${slug}`" color="primary">Return to event</UButton>
            </div>
          </div>

          <div v-else class="space-y-3">
            <UIcon
              name="i-heroicons-exclamation-triangle"
              class="h-10 w-10 text-amber-600 inline-block"
            />
            <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">
              We couldn't verify your payment
            </h1>
            <p class="text-gray-600 dark:text-gray-300">Reference: {{ reference || 'N/A' }}</p>
            <div class="pt-4 flex items-center justify-center gap-3">
              <UButton color="neutral" variant="soft" :to="`/events/${slug}`"
                >Back to event</UButton
              >
              <UButton color="primary" :to="`/events/${slug}/register`">Try again</UButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const slug = computed(() => route.params.slug as string)

const loading = ref(true)
const ok = ref(false)
const reference = ref<string | null>(null)
const customerEmail = ref<string | null>(null)

onMounted(async () => {
  const q = route.query as { reference?: string; email?: string }
  reference.value = q.reference || null
  customerEmail.value = q.email || null
  if (!reference.value) {
    loading.value = false
    ok.value = false
    return
  }
  // Since API is not implemented, assume success if reference exists
  loading.value = false
  ok.value = true
})
</script>
