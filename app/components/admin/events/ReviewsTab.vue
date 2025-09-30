<template>
  <div class="space-y-6">
    <!-- Header with Request Reviews Button -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div class="flex items-center justify-between mb-4">
        <div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Event Reviews</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Collect feedback from attendees to improve future events
          </p>
        </div>
        <UButton
          v-if="event.status === 'completed'"
          color="primary"
          icon="i-heroicons-envelope"
          :loading="isRequestingReviews"
          @click="requestReviews"
        >
          Request Reviews
        </UButton>
        <div
          v-else
          class="flex items-center space-x-2 px-4 py-2 bg-yellow-50 dark:bg-yellow-900/30 rounded-md border border-yellow-200 dark:border-yellow-800"
        >
          <UIcon
            name="i-heroicons-exclamation-triangle"
            class="w-5 h-5 text-yellow-500 dark:text-yellow-400"
          />
          <span class="text-sm font-medium text-yellow-700 dark:text-yellow-300">
            Reviews can be requested after the event is completed
          </span>
        </div>
      </div>

      <!-- Summary Stats -->
      <div v-if="reviewSummary" class="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
        <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
          <div class="text-sm text-gray-600 dark:text-gray-400">Average Rating</div>
          <div class="flex items-center gap-2 mt-2">
            <span class="text-2xl font-bold text-gray-900 dark:text-white">{{
              reviewSummary.averageRating.toFixed(1)
            }}</span>
            <div class="flex gap-0.5">
              <UIcon
                v-for="star in 5"
                :key="star"
                name="i-heroicons-star-solid"
                :class="
                  star <= Math.round(reviewSummary.averageRating)
                    ? 'text-yellow-400'
                    : 'text-gray-300 dark:text-gray-600'
                "
                class="w-4 h-4"
              />
            </div>
          </div>
        </div>

        <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
          <div class="text-sm text-gray-600 dark:text-gray-400">Total Reviews</div>
          <div class="text-2xl font-bold text-gray-900 dark:text-white mt-2">
            {{ reviewSummary.totalReviews }}
          </div>
        </div>

        <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
          <div class="text-sm text-gray-600 dark:text-gray-400">Response Rate</div>
          <div class="text-2xl font-bold text-gray-900 dark:text-white mt-2">
            {{ reviewSummary.responseRate }}%
          </div>
        </div>

        <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
          <div class="text-sm text-gray-600 dark:text-gray-400">Requests Sent</div>
          <div class="text-2xl font-bold text-gray-900 dark:text-white mt-2">
            {{ reviewSummary.totalRequests }}
          </div>
        </div>
      </div>

      <!-- Rating Distribution -->
      <div v-if="reviewSummary" class="mt-6">
        <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-3">Rating Distribution</h4>
        <div class="space-y-2">
          <div v-for="rating in [5, 4, 3, 2, 1]" :key="rating" class="flex items-center gap-3">
            <div class="flex items-center gap-1 w-16">
              <span class="text-sm text-gray-600 dark:text-gray-400">{{ rating }}</span>
              <UIcon name="i-heroicons-star-solid" class="w-4 h-4 text-yellow-400" />
            </div>
            <div class="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                class="bg-yellow-400 h-2 rounded-full transition-all"
                :style="{
                  width: `${reviewSummary.totalReviews > 0 ? (reviewSummary.ratingDistribution[rating] / reviewSummary.totalReviews) * 100 : 0}%`,
                }"
              />
            </div>
            <span class="text-sm text-gray-600 dark:text-gray-400 w-12 text-right">{{
              reviewSummary.ratingDistribution[rating]
            }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Reviews List -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
      <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">All Reviews</h3>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="p-12 text-center">
        <UIcon
          name="i-heroicons-arrow-path"
          class="w-8 h-8 animate-spin mx-auto text-primary-500"
        />
        <p class="mt-4 text-gray-600 dark:text-gray-300">Loading reviews...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="!reviews.length" class="p-12 text-center">
        <UIcon
          name="i-heroicons-chat-bubble-left-right"
          class="w-12 h-12 mx-auto text-gray-400 mb-4"
        />
        <p class="text-gray-600 dark:text-gray-300">No reviews yet</p>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">
          Request reviews from attendees to see feedback here
        </p>
      </div>

      <!-- Reviews List -->
      <div v-else class="divide-y divide-gray-200 dark:divide-gray-700">
        <div
          v-for="review in reviews"
          :key="review.id"
          class="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
        >
          <div class="flex items-start justify-between mb-3">
            <div>
              <h4 class="font-medium text-gray-900 dark:text-white">{{ review.attendeeName }}</h4>
              <p class="text-sm text-gray-500 dark:text-gray-400">{{ review.attendeeEmail }}</p>
            </div>
            <div class="flex flex-col items-end gap-2">
              <div class="flex gap-0.5">
                <UIcon
                  v-for="star in 5"
                  :key="star"
                  name="i-heroicons-star-solid"
                  :class="
                    star <= review.rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'
                  "
                  class="w-5 h-5"
                />
              </div>
              <span class="text-xs text-gray-500 dark:text-gray-400">{{
                formatDate(review.submittedAt)
              }}</span>
            </div>
          </div>
          <p v-if="review.reviewText" class="text-gray-700 dark:text-gray-300 leading-relaxed">
            {{ review.reviewText }}
          </p>
          <p v-else class="text-sm italic text-gray-500 dark:text-gray-400">
            No written feedback provided
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
type EventStatus = 'draft' | 'published' | 'completed' | 'cancelled' | string
interface EventBasic {
  id: string
  status: EventStatus
}

interface ReviewItem {
  id: string
  attendeeName: string
  attendeeEmail: string
  rating: number
  reviewText?: string | null
  submittedAt: string | Date
}

interface ReviewSummary {
  averageRating: number
  totalReviews: number
  responseRate: number
  totalRequests: number
  ratingDistribution: Record<number, number>
}

interface Props {
  event: EventBasic
}

const props = defineProps<Props>()

const loading = ref(true)
const isRequestingReviews = ref(false)
const reviews = ref<ReviewItem[]>([])
const reviewSummary = ref<ReviewSummary | null>(null)

// Fetch reviews on mount
onMounted(async () => {
  await fetchReviews()
})

async function fetchReviews() {
  try {
    loading.value = true
    const response = await $fetch(`/api/admin/events/${props.event.id}/reviews`)
    reviews.value = response.data.reviews
    reviewSummary.value = response.data.summary
  } catch (error: unknown) {
    console.error('Error fetching reviews:', error)
    useToast().add({
      title: 'Error',
      description: 'Failed to load reviews',
      icon: 'i-heroicons-exclamation-circle',
      color: 'error',
    })
  } finally {
    loading.value = false
  }
}

async function requestReviews() {
  try {
    isRequestingReviews.value = true
    const response = await $fetch(`/api/admin/events/${props.event.id}/request-reviews`, {
      method: 'POST',
    })

    useToast().add({
      title: 'Success',
      description: response.message || 'Review requests sent successfully',
      icon: 'i-heroicons-check-circle',
      color: 'success',
    })

    // Refresh reviews
    await fetchReviews()
  } catch (error: unknown) {
    const err =
      typeof error === 'object' && error && 'data' in error
        ? (error as { data?: { statusMessage?: string } })
        : undefined
    useToast().add({
      title: 'Error',
      description: err?.data?.statusMessage || 'Failed to send review requests',
      icon: 'i-heroicons-exclamation-circle',
      color: 'error',
    })
  } finally {
    isRequestingReviews.value = false
  }
}

function formatDate(dateString: string | Date | null): string {
  if (!dateString) return ''
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
</script>
