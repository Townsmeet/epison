<template>
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
                <strong>Corresponding Author:</strong> {{ submission.correspondingAuthor.name }} ({{
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
          <UIcon name="i-heroicons-document-text" class="h-12 w-12 text-gray-400 mx-auto mb-4" />
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
  </UCard>
</template>

<script setup lang="ts">
import type { AbstractSubmission } from '../../../../types/submissions'

const props = defineProps<{ eventId: number }>()

const { getSubmissions, updateSubmission } = useSubmissions()

// Fetch submissions for this event
const submissionsResponse = await getSubmissions({
  eventId: props.eventId.toString(),
  page: 1,
  limit: 100, // Get all submissions for this event
  sort: '-submissionDate',
})

const eventSubmissions = computed<AbstractSubmission[]>(() => {
  return (submissionsResponse?.data as AbstractSubmission[]) || []
})

const submissionSearch = ref('')
const submissionStatusFilter = ref<string | null>(null)
const submissionCategoryFilter = ref<string | null>(null)

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
  useToast().add({
    title: 'View Submission',
    description: `Opening details for "${submission.title}"`,
    color: 'info',
  })
}

function getSubmissionActions(submission: AbstractSubmission) {
  return [
    [
      {
        label: 'Accept',
        icon: 'i-heroicons-check-circle',
        click: () => changeSubmissionStatus(submission.id, 'accepted'),
      },
    ],
    [
      {
        label: 'Request Revision',
        icon: 'i-heroicons-pencil-square',
        click: () => changeSubmissionStatus(submission.id, 'revision_required'),
      },
    ],
    [
      {
        label: 'Reject',
        icon: 'i-heroicons-x-circle',
        click: () => changeSubmissionStatus(submission.id, 'rejected'),
      },
    ],
  ]
}

function changeSubmissionStatus(submissionId: string, newStatus: AbstractSubmission['status']) {
  updateSubmission(submissionId, { status: newStatus })
  useToast().add({
    title: 'Status Updated',
    description: `Submission status changed to ${newStatus.replace('_', ' ')}`,
    color: 'success',
  })
}

function formatDate(dateString: string): string {
  if (!dateString) return ''
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' }
  return new Date(dateString).toLocaleDateString('en-US', options)
}
</script>
