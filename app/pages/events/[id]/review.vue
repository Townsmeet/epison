<template>
  <div
    class="min-h-screen bg-gradient-to-br from-gray-50 via-white to-teal-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-teal-900/20"
  >
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12">
        <UIcon
          name="i-heroicons-arrow-path"
          class="w-12 h-12 animate-spin mx-auto text-primary-500"
        />
        <p class="mt-4 text-gray-600 dark:text-gray-300">Loading...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-12">
        <div class="bg-red-50 dark:bg-red-900/20 rounded-lg p-8">
          <UIcon
            name="i-heroicons-exclamation-circle"
            class="w-12 h-12 mx-auto text-red-500 mb-4"
          />
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Error</h2>
          <p class="text-gray-600 dark:text-gray-300">{{ error }}</p>
        </div>
      </div>

      <!-- Already Submitted State -->
      <div v-else-if="reviewData?.review.tokenUsed" class="text-center py-12">
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
          <UIcon name="i-heroicons-check-circle" class="w-16 h-16 mx-auto text-green-500 mb-4" />
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Thank You for Your Feedback!
          </h2>
          <p class="text-gray-600 dark:text-gray-300 mb-4">
            You have already submitted your review for this event.
          </p>
          <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 mt-6">
            <p class="text-sm text-gray-600 dark:text-gray-300 mb-2">Your Rating:</p>
            <div class="flex justify-center gap-1">
              <UIcon
                v-for="star in 5"
                :key="star"
                name="i-heroicons-star-solid"
                :class="
                  star <= (reviewData.review.rating || 0)
                    ? 'text-yellow-400'
                    : 'text-gray-300 dark:text-gray-600'
                "
                class="w-6 h-6"
              />
            </div>
          </div>
          <UButton to="/events" color="primary" class="mt-6"> Browse More Events </UButton>
        </div>
      </div>

      <!-- Review Form -->
      <div v-else-if="reviewData" class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">Share Your Feedback</h1>
          <p class="text-gray-600 dark:text-gray-300">
            We'd love to hear about your experience at
            <strong>{{ reviewData.event.title }}</strong>
          </p>
        </div>

        <UForm :state="form" class="space-y-6" @submit="onSubmit">
          <!-- Attendee Name (Read-only) -->
          <UFormField label="Your Name" name="attendeeName">
            <UInput v-model="reviewData.review.attendeeName" disabled class="w-full" />
          </UFormField>

          <!-- Rating -->
          <UFormField label="Rating" name="rating" required>
            <div class="flex gap-2">
              <button
                v-for="star in 5"
                :key="star"
                type="button"
                class="focus:outline-none transition-transform hover:scale-110"
                @click="form.rating = star"
              >
                <UIcon
                  name="i-heroicons-star-solid"
                  :class="
                    star <= form.rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'
                  "
                  class="w-10 h-10"
                />
              </button>
            </div>
            <p v-if="form.rating > 0" class="text-sm text-gray-600 dark:text-gray-400 mt-2">
              {{ getRatingLabel(form.rating) }}
            </p>
          </UFormField>

          <!-- Review Text -->
          <UFormField
            label="Your Feedback (Optional)"
            name="reviewText"
            help="Share your thoughts about the event, speakers, organization, or any suggestions for improvement."
          >
            <UTextarea
              v-model="form.reviewText"
              :rows="6"
              placeholder="Tell us about your experience..."
              class="w-full"
            />
          </UFormField>

          <!-- Submit Button -->
          <div class="flex justify-end gap-4">
            <UButton to="/events" color="neutral" variant="outline"> Cancel </UButton>
            <UButton
              type="submit"
              color="primary"
              :loading="isSubmitting"
              :disabled="form.rating === 0"
              size="lg"
            >
              Submit Feedback
            </UButton>
          </div>
        </UForm>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const eventId = route.params.id as string
const token = route.query.token as string

const loading = ref(true)
const error = ref<string | null>(null)

interface ReviewInfo {
  tokenUsed: boolean
  attendeeName: string
  attendeeEmail: string
  rating: number
  reviewText?: string | null
}

interface ReviewEventInfo {
  title: string
}

interface ReviewPageData {
  review: ReviewInfo
  event: ReviewEventInfo
}

const reviewData = ref<ReviewPageData | null>(null)
const isSubmitting = ref(false)

const form = reactive({
  rating: 0,
  reviewText: '',
})

// Fetch review data
onMounted(async () => {
  try {
    const response = await $fetch(`/api/events/${eventId}/review`, {
      query: { token },
    })
    reviewData.value = response.data
  } catch (err: unknown) {
    const e =
      typeof err === 'object' && err && 'data' in err
        ? (err as { data?: { statusMessage?: string } })
        : undefined
    error.value = e?.data?.statusMessage || 'Failed to load review form. Please check your link.'
  } finally {
    loading.value = false
  }
})

function getRatingLabel(rating: number): string {
  const labels: Record<number, string> = {
    1: 'Poor',
    2: 'Fair',
    3: 'Good',
    4: 'Very Good',
    5: 'Excellent',
  }
  return labels[rating] || ''
}

async function onSubmit() {
  if (form.rating === 0) {
    useToast().add({
      title: 'Rating Required',
      description: 'Please select a rating before submitting.',
      icon: 'i-heroicons-exclamation-circle',
      color: 'error',
    })
    return
  }

  try {
    isSubmitting.value = true
    await $fetch(`/api/events/${eventId}/review`, {
      method: 'POST',
      body: {
        token,
        rating: form.rating,
        reviewText: form.reviewText || undefined,
      },
    })

    useToast().add({
      title: 'Thank You!',
      description: 'Your feedback has been submitted successfully.',
      icon: 'i-heroicons-check-circle',
      color: 'success',
    })

    // Refresh to show submitted state
    if (reviewData.value) {
      reviewData.value.review.tokenUsed = true
      reviewData.value.review.rating = form.rating
      reviewData.value.review.reviewText = form.reviewText
    }
  } catch (err: unknown) {
    const e =
      typeof err === 'object' && err && 'data' in err
        ? (err as { data?: { statusMessage?: string } })
        : undefined
    useToast().add({
      title: 'Error',
      description: e?.data?.statusMessage || 'Failed to submit your feedback. Please try again.',
      icon: 'i-heroicons-exclamation-circle',
      color: 'error',
    })
  } finally {
    isSubmitting.value = false
  }
}
</script>
