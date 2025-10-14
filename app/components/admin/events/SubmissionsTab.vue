<template>
  <div>
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold">Abstract Submissions</h3>
          <UBadge v-if="eventSubmissions.length" color="neutral" variant="subtle">
            {{ eventSubmissions.length }} total
          </UBadge>
        </div>
      </template>

      <div class="space-y-4">
        <!-- Error State -->
        <UAlert
          v-if="error"
          :title="error.message || 'Error loading submissions'"
          color="error"
          variant="subtle"
          class="mb-4"
        >
          <template #actions>
            <UButton
              color="error"
              variant="outline"
              size="sm"
              icon="i-heroicons-arrow-path"
              @click="submissionsResponse.refresh()"
            >
              Retry
            </UButton>
          </template>
        </UAlert>

        <!-- Loading State -->
        <div v-else-if="isLoading" class="flex items-center justify-center py-8">
          <UIcon name="i-heroicons-arrow-path" class="animate-spin h-6 w-6 mr-2" />
          <span>Loading submissions...</span>
        </div>

        <!-- Content -->
        <div v-else class="space-y-6">
          <!-- Stats -->
          <div class="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
            <div>
              <div class="text-2xl font-semibold text-gray-900 dark:text-white">
                {{ eventSubmissions.length }}
              </div>
              <div class="text-xs text-gray-500 dark:text-gray-400">Total</div>
            </div>
            <div>
              <div class="text-2xl font-semibold text-green-600">
                {{ acceptedCount }}
              </div>
              <div class="text-xs text-gray-500 dark:text-gray-400">Accepted</div>
            </div>
            <div>
              <div class="text-2xl font-semibold text-yellow-600">
                {{ underReviewCount }}
              </div>
              <div class="text-xs text-gray-500 dark:text-gray-400">Under Review</div>
            </div>
            <div>
              <div class="text-2xl font-semibold text-blue-600">
                {{ pendingCount }}
              </div>
              <div class="text-xs text-gray-500 dark:text-gray-400">Pending</div>
            </div>
            <div>
              <div class="text-2xl font-semibold text-red-600">
                {{ rejectedCount }}
              </div>
              <div class="text-xs text-gray-500 dark:text-gray-400">Rejected</div>
            </div>
          </div>

          <!-- Search and Filters -->
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <UInput
              v-model="submissionSearch"
              placeholder="Search by title, author, keywords..."
              icon="i-heroicons-magnifying-glass"
              autocomplete="off"
              class="w-full sm:w-72"
            />
            <div class="flex gap-2">
              <USelect
                v-model="submissionStatusFilter"
                :items="[{ label: 'All Status', value: null }, ...submissionStatusOptions]"
                label-attribute="label"
                value-attribute="value"
                placeholder="All Status"
                class="w-40"
                :clearable="false"
              />
              <USelect
                v-model="submissionCategoryFilter"
                :items="[{ label: 'All Categories', value: null }, ...submissionCategoryOptions]"
                label-attribute="label"
                value-attribute="value"
                placeholder="All Categories"
                class="w-40"
                :clearable="false"
              />
            </div>
          </div>

          <!-- Submissions List -->
          <div class="space-y-4">
            <div
              v-for="submission in filteredSubmissions"
              :key="submission.id"
              class="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800"
            >
              <div class="flex items-start justify-between">
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2 mb-2">
                    <h4 class="text-lg font-medium text-gray-900 dark:text-white truncate">
                      {{ submission.title }}
                    </h4>
                    <UBadge :color="getSubmissionStatusColor(submission.status)" size="sm">
                      {{ submission.status.replace('_', ' ') }}
                    </UBadge>
                    <UBadge color="neutral" variant="outline" size="sm">
                      {{ submission.category }}
                    </UBadge>
                  </div>

                  <div class="text-sm text-gray-600 dark:text-gray-300 mb-2">
                    <strong>Authors:</strong> {{ submission.authors.join(', ') }}
                  </div>

                  <div class="text-sm text-gray-600 dark:text-gray-300 mb-2">
                    <strong>Corresponding Author:</strong>
                    {{ submission.correspondingAuthor.name }} ({{
                      submission.correspondingAuthor.email
                    }})
                  </div>

                  <div class="text-sm text-gray-500 dark:text-gray-400 mb-3 line-clamp-3">
                    {{ submission.abstract }}
                  </div>

                  <div class="flex flex-wrap gap-1 mb-2">
                    <UBadge
                      v-for="keyword in submission.keywords"
                      :key="keyword"
                      color="primary"
                      variant="soft"
                      size="xs"
                    >
                      {{ keyword }}
                    </UBadge>
                  </div>

                  <div class="text-xs text-gray-500 dark:text-gray-400">
                    Submitted: {{ formatDate(submission.submissionDate) }}
                  </div>
                </div>

                <div class="flex items-center gap-2 ml-4">
                  <UButton
                    size="sm"
                    color="neutral"
                    variant="soft"
                    icon="i-heroicons-eye"
                    @click="viewSubmission(submission)"
                  >
                    View
                  </UButton>
                  <UDropdownMenu :items="getSubmissionActions(submission)">
                    <UButton
                      size="sm"
                      color="neutral"
                      variant="ghost"
                      icon="i-heroicons-ellipsis-horizontal"
                    />
                  </UDropdownMenu>
                </div>
              </div>
            </div>

            <div v-if="filteredSubmissions.length === 0" class="text-center py-8">
              <UIcon
                name="i-heroicons-document-text"
                class="h-12 w-12 text-gray-400 mx-auto mb-4"
              />
              <p class="text-gray-500 dark:text-gray-400">
                {{
                  eventSubmissions.length === 0
                    ? 'No submissions yet'
                    : 'No submissions match your filters'
                }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </UCard>

    <!-- View Submission Modal -->
    <UModal v-model:open="isViewModalOpen">
      <template #content>
        <div class="h-[85vh] max-h-[85vh] flex flex-col">
          <UCard
            class="h-full flex flex-col"
            :ui="{
              body: 'flex-1 overflow-y-auto',
              header: 'sticky top-0 z-10 bg-white/90 dark:bg-gray-900/90 backdrop-blur',
              footer: 'sticky bottom-0 z-10 bg-white/90 dark:bg-gray-900/90 backdrop-blur',
            }"
          >
            <!-- <template #header>
              <div class="flex items-center justify-between">
                <h3 class="text-lg font-semibold">{{ selectedSubmission?.title || 'Submission Details' }}</h3>
                <UButton
                  color="neutral"
                  variant="ghost"
                  icon="i-heroicons-x-mark"
                  @click="isViewModalOpen = false"
                />
              </div>
            </template> -->

            <div v-if="selectedSubmission" class="space-y-6">
              <!-- Submission Header -->
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <div class="flex items-center gap-2 mb-2">
                    <UBadge :color="getSubmissionStatusColor(selectedSubmission.status)" size="sm">
                      {{ selectedSubmission.status.replace('_', ' ') }}
                    </UBadge>
                    <UBadge color="neutral" variant="outline" size="sm">
                      {{ selectedSubmission.category }}
                    </UBadge>
                  </div>
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                    {{ selectedSubmission.title }}
                  </h3>
                </div>
              </div>

              <!-- Submission Details -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Authors -->
                <div>
                  <h4 class="font-medium text-gray-900 dark:text-white mb-2">Authors</h4>
                  <div class="space-y-1">
                    <div
                      v-for="author in selectedSubmission.authors"
                      :key="author"
                      class="text-sm text-gray-600 dark:text-gray-300"
                    >
                      {{ author }}
                    </div>
                  </div>
                </div>

                <!-- Corresponding Author -->
                <div>
                  <h4 class="font-medium text-gray-900 dark:text-white mb-2">
                    Corresponding Author
                  </h4>
                  <div class="text-sm text-gray-600 dark:text-gray-300">
                    <div class="font-medium">{{ selectedSubmission.correspondingAuthor.name }}</div>
                    <div>{{ selectedSubmission.correspondingAuthor.email }}</div>
                    <div v-if="selectedSubmission.correspondingAuthor.affiliation" class="text-xs">
                      {{ selectedSubmission.correspondingAuthor.affiliation }}
                    </div>
                    <div v-if="selectedSubmission.correspondingAuthor.phone" class="text-xs">
                      {{ selectedSubmission.correspondingAuthor.phone }}
                    </div>
                  </div>
                </div>
              </div>

              <!-- Abstract -->
              <div>
                <h4 class="font-medium text-gray-900 dark:text-white mb-2">Abstract</h4>
                <div class="prose prose-sm max-w-none dark:prose-invert">
                  <p class="text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
                    {{ selectedSubmission.abstract }}
                  </p>
                </div>
              </div>

              <!-- Keywords -->
              <div v-if="selectedSubmission.keywords.length > 0">
                <h4 class="font-medium text-gray-900 dark:text-white mb-2">Keywords</h4>
                <div class="flex flex-wrap gap-1">
                  <UBadge
                    v-for="keyword in selectedSubmission.keywords"
                    :key="keyword"
                    color="primary"
                    variant="soft"
                    size="xs"
                  >
                    {{ keyword }}
                  </UBadge>
                </div>
              </div>

              <!-- Submission Info -->
              <div
                class="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-200 dark:border-gray-700"
              >
                <div>
                  <h4 class="font-medium text-gray-900 dark:text-white mb-2">Submission Details</h4>
                  <div class="space-y-1 text-sm text-gray-600 dark:text-gray-300">
                    <div>
                      <strong>Submitted:</strong>
                      {{ formatDate(selectedSubmission.submissionDate) }}
                    </div>
                    <div><strong>Category:</strong> {{ selectedSubmission.category }}</div>
                  </div>
                </div>

                <div v-if="selectedSubmission.notes">
                  <h4 class="font-medium text-gray-900 dark:text-white mb-2">Notes</h4>
                  <div class="text-sm text-gray-600 dark:text-gray-300">
                    {{ selectedSubmission.notes }}
                  </div>
                </div>
              </div>

              <!-- Reviewer Comments (if any) -->
              <div v-if="selectedSubmission.reviewerComments">
                <h4 class="font-medium text-gray-900 dark:text-white mb-2">Reviewer Comments</h4>
                <div class="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                  <p class="text-sm text-gray-600 dark:text-gray-300">
                    {{ selectedSubmission.reviewerComments }}
                  </p>
                </div>
              </div>
            </div>

            <template #footer>
              <div class="flex justify-between">
                <div class="flex gap-2">
                  <UButton
                    color="error"
                    variant="soft"
                    size="sm"
                    :loading="updatingStatus === 'rejected'"
                    :disabled="updatingStatus !== null"
                    @click="handleModalStatusChange('rejected')"
                  >
                    Reject
                  </UButton>
                  <UButton
                    color="warning"
                    variant="soft"
                    size="sm"
                    :loading="updatingStatus === 'revision_required'"
                    :disabled="updatingStatus !== null"
                    @click="handleModalStatusChange('revision_required')"
                  >
                    Request Revision
                  </UButton>
                  <UButton
                    color="success"
                    variant="soft"
                    size="sm"
                    :loading="updatingStatus === 'accepted'"
                    :disabled="updatingStatus !== null"
                    @click="handleModalStatusChange('accepted')"
                  >
                    Accept
                  </UButton>
                </div>
                <UButton color="neutral" variant="ghost" @click="isViewModalOpen = false">
                  Close
                </UButton>
              </div>
            </template>
          </UCard>
        </div>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { AbstractSubmission } from '../../../../types/submissions'

const props = defineProps<{ eventId: string | number }>()

const { getSubmissions, updateSubmission } = useSubmissions()

// Reactive data for filters
const submissionSearch = ref('')
const submissionStatusFilter = ref<string | null>(null)
const submissionCategoryFilter = ref<string | null>(null)

// Modal state for viewing submission details
const isViewModalOpen = ref(false)
const selectedSubmission = ref<AbstractSubmission | null>(null)

// Loading state for status updates
const updatingStatus = ref<string | null>(null)
const updatingSubmissionId = ref<string | null>(null)

// Fetch submissions for this event with reactive filters
const submissionsResponse = await getSubmissions({
  eventId: props.eventId.toString(),
  page: 1,
  limit: 100, // Get all submissions for this event
  sort: '-submissionDate',
})

// Test without eventId filter first to see if any submissions exist
const allSubmissionsResponse = await getSubmissions({
  page: 1,
  limit: 10,
  sort: '-submissionDate',
})

console.log('[SubmissionsTab] Props received:', {
  eventId: props.eventId,
  eventIdType: typeof props.eventId,
  eventIdString: String(props.eventId),
})
console.log('[SubmissionsTab] API call parameters:', {
  eventId: String(props.eventId),
  page: 1,
  limit: 100,
  sort: '-submissionDate',
})
console.log('[SubmissionsTab] All submissions (no filter):', allSubmissionsResponse?.data?.value)
console.log(
  '[SubmissionsTab] Filtered submissions (with eventId):',
  submissionsResponse?.data?.value
)

// Handle loading and error states
const isLoading = computed(() => submissionsResponse.pending.value)
const error = computed(() => submissionsResponse.error.value)

console.log('[SubmissionsTab] Loading state:', isLoading.value)
console.log('[SubmissionsTab] Error state:', error.value)
console.log('[SubmissionsTab] Response data:', submissionsResponse?.data?.value)

const eventSubmissions = computed<AbstractSubmission[]>(() => {
  const data = submissionsResponse?.data?.value
  console.log('[SubmissionsTab] Computing eventSubmissions:', {
    data,
    dataType: typeof data,
    hasData: !!data,
    hasDataArray: data && typeof data === 'object' && 'data' in data && Array.isArray(data.data),
  })
  return data && typeof data === 'object' && 'data' in data && Array.isArray(data.data)
    ? (data.data as AbstractSubmission[])
    : []
})

const submissionStatusOptions = computed(() => [
  { label: 'Pending', value: 'pending' },
  { label: 'Under Review', value: 'under_review' },
  { label: 'Accepted', value: 'accepted' },
  { label: 'Rejected', value: 'rejected' },
  { label: 'Revision Required', value: 'revision_required' },
])

const submissionCategoryOptions = computed(() => [
  { label: 'Oral Presentation', value: 'oral' },
  { label: 'Poster Presentation', value: 'poster' },
  { label: 'Workshop Proposal', value: 'workshop' },
])

const filteredSubmissions = computed<AbstractSubmission[]>(() => {
  let filtered = [...eventSubmissions.value]

  // Apply search filter
  if (submissionSearch.value) {
    const search = submissionSearch.value.toLowerCase()
    filtered = filtered.filter(
      (s: AbstractSubmission) =>
        s.title.toLowerCase().includes(search) ||
        s.authors.some(author => author.toLowerCase().includes(search)) ||
        s.keywords.some(keyword => keyword.toLowerCase().includes(search)) ||
        s.correspondingAuthor.name.toLowerCase().includes(search)
    )
  }

  // Apply status filter (null means 'All Status' is selected)
  if (submissionStatusFilter.value !== null) {
    filtered = filtered.filter((s: AbstractSubmission) => s.status === submissionStatusFilter.value)
  }

  // Apply category filter (null means 'All Categories' is selected)
  if (submissionCategoryFilter.value !== null) {
    filtered = filtered.filter(
      (s: AbstractSubmission) => s.category === submissionCategoryFilter.value
    )
  }

  return filtered
})

const acceptedCount = computed<number>(
  () => eventSubmissions.value.filter((s: AbstractSubmission) => s.status === 'accepted').length
)
const underReviewCount = computed<number>(
  () => eventSubmissions.value.filter((s: AbstractSubmission) => s.status === 'under_review').length
)
const pendingCount = computed<number>(
  () => eventSubmissions.value.filter((s: AbstractSubmission) => s.status === 'pending').length
)
const rejectedCount = computed<number>(
  () => eventSubmissions.value.filter((s: AbstractSubmission) => s.status === 'rejected').length
)

type BadgeColor = 'neutral' | 'success' | 'primary' | 'secondary' | 'info' | 'warning' | 'error'
function getSubmissionStatusColor(status: AbstractSubmission['status']): BadgeColor {
  const colors: Record<AbstractSubmission['status'], BadgeColor> = {
    pending: 'secondary',
    under_review: 'warning',
    accepted: 'success',
    rejected: 'error',
    revision_required: 'info',
  }
  return colors[status] ?? 'neutral'
}

function viewSubmission(submission: AbstractSubmission) {
  selectedSubmission.value = submission
  isViewModalOpen.value = true
}

function getSubmissionActions(submission: AbstractSubmission) {
  const isUpdating = updatingSubmissionId.value === submission.id

  return [
    [
      {
        label: 'Accept',
        icon: 'i-heroicons-check-circle',
        disabled: isUpdating,
        click: () => {
          console.log('[SubmissionsTab] Accept button clicked for submission:', submission.id)
          changeSubmissionStatus(submission.id, 'accepted')
        },
      },
    ],
    [
      {
        label: 'Request Revision',
        icon: 'i-heroicons-pencil-square',
        disabled: isUpdating,
        click: () => {
          console.log(
            '[SubmissionsTab] Request Revision button clicked for submission:',
            submission.id
          )
          changeSubmissionStatus(submission.id, 'revision_required')
        },
      },
    ],
    [
      {
        label: 'Reject',
        icon: 'i-heroicons-x-circle',
        disabled: isUpdating,
        click: () => {
          console.log('[SubmissionsTab] Reject button clicked for submission:', submission.id)
          changeSubmissionStatus(submission.id, 'rejected')
        },
      },
    ],
  ]
}

function handleModalStatusChange(newStatus: AbstractSubmission['status']) {
  if (!selectedSubmission.value) return

  console.log('[SubmissionsTab] Modal status change triggered:', {
    submissionId: selectedSubmission.value.id,
    newStatus,
    hasSubmission: !!selectedSubmission.value,
  })

  // Call the main status change function - it will handle loading states
  changeSubmissionStatus(selectedSubmission.value.id, newStatus)
}

async function changeSubmissionStatus(
  submissionId: string,
  newStatus: AbstractSubmission['status']
) {
  console.log('[SubmissionsTab] Starting status update:', { submissionId, newStatus })

  // Prevent multiple simultaneous updates for the same submission
  if (updatingSubmissionId.value === submissionId) {
    console.log('[SubmissionsTab] Already updating this submission, skipping')
    return
  }

  // Set loading state AFTER the check
  updatingSubmissionId.value = submissionId
  console.log('[SubmissionsTab] Set loading state for submission:', submissionId)

  // Show loading state
  useToast().add({
    title: 'Updating Status',
    description: `Changing submission status to ${newStatus.replace('_', ' ')}...`,
    color: 'info',
  })
  console.log('[SubmissionsTab] Created loading toast')

  try {
    console.log('[SubmissionsTab] Calling updateSubmission API...')
    // Update submission status via API
    const result = await updateSubmission(submissionId, { status: newStatus })
    console.log('[SubmissionsTab] API call successful:', result)

    // If modal is open and we're updating the currently viewed submission, close modal
    if (isViewModalOpen.value && selectedSubmission.value?.id === submissionId) {
      isViewModalOpen.value = false
      selectedSubmission.value = null
      console.log('[SubmissionsTab] Closed modal after status update')
    }

    // Refresh submissions data to get updated counts and status
    console.log('[SubmissionsTab] Refreshing submissions data...')
    await submissionsResponse.refresh()
    console.log('[SubmissionsTab] Data refresh completed')

    // Show success message
    useToast().add({
      title: 'Status Updated',
      description: `Submission status changed to ${newStatus.replace('_', ' ')}`,
      color: 'success',
    })
    console.log('[SubmissionsTab] Success toast shown')
  } catch (error: unknown) {
    console.error('[SubmissionsTab] Error updating submission status:', error)
    // Show error message
    const errorMessage =
      error &&
      typeof error === 'object' &&
      'data' in error &&
      error.data &&
      typeof error.data === 'object' &&
      'message' in error.data &&
      typeof error.data.message === 'string'
        ? error.data.message
        : 'Failed to update submission status'

    useToast().add({
      title: 'Update Failed',
      description: errorMessage,
      color: 'error',
    })
  } finally {
    // Clear loading state
    updatingSubmissionId.value = null
    console.log('[SubmissionsTab] Cleared loading state')
  }
}

function formatDate(dateString: string): string {
  if (!dateString) return ''
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' }
  return new Date(dateString).toLocaleDateString('en-US', options)
}
</script>
