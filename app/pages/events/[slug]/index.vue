<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div class="relative bg-white dark:bg-gray-900 overflow-hidden">
      <div class="max-w-7xl mx-auto">
        <div
          class="relative z-10 pb-8 bg-white dark:bg-gray-900 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32"
        >
          <div class="pt-10 sm:pt-16 lg:pt-8 lg:pb-14 lg:overflow-hidden">
            <div class="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 lg:mt-16 lg:px-8">
              <div class="lg:text-left">
                <span
                  v-if="event"
                  class="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium"
                  :class="badgeClass"
                >
                  {{ typeLabel }}
                </span>
                <h1
                  class="text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white sm:text-5xl md:text-6xl mt-4"
                >
                  <span v-if="event?.title" class="block">{{ event!.title }}</span>
                  <span v-else class="block sr-only">Loading event...</span>
                </h1>
                <div v-if="event" class="mt-6 space-y-4">
                  <div class="flex items-center text-gray-500 dark:text-gray-300">
                    <UIcon
                      name="i-heroicons-calendar"
                      class="flex-shrink-0 h-5 w-5 text-gray-400"
                    />
                    <span class="ml-2">{{ formatDateRange(event.startDate, event.endDate) }}</span>
                  </div>
                  <div class="flex items-center text-gray-500 dark:text-gray-300">
                    <UIcon name="i-heroicons-map-pin" class="flex-shrink-0 h-5 w-5 text-gray-400" />
                    <span class="ml-2">{{ event.location }}</span>
                  </div>
                  <!-- Past Event Notice -->
                  <div
                    v-if="isPast"
                    class="flex items-start p-3 rounded-lg bg-amber-50 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200 border border-amber-200 dark:border-amber-800"
                  >
                    <UIcon name="i-heroicons-information-circle" class="h-5 w-5 mt-0.5 mr-2" />
                    <div>
                      <p class="text-sm font-medium">This event has ended.</p>
                      <p v-if="event.endDate" class="text-xs opacity-80">
                        Ended on
                        {{
                          new Date(event.endDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })
                        }}
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  v-if="event"
                  class="mt-8 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4"
                >
                  <NuxtLink
                    v-if="!isPast && event.status === 'registration_open'"
                    :to="registerPath"
                    class="w-full sm:w-auto"
                  >
                    <UButton size="lg" color="primary" class="w-full sm:w-auto justify-center">
                      Register Now
                    </UButton>
                  </NuxtLink>
                  <UButton
                    v-if="!isPast && canSubmitAbstract"
                    size="lg"
                    color="secondary"
                    variant="soft"
                    class="w-full sm:w-auto justify-center"
                    @click="showSubmissionForm = true"
                  >
                    Submit Abstract
                  </UButton>
                  <UButton
                    v-else-if="isPast"
                    to="/events"
                    size="lg"
                    color="neutral"
                    variant="soft"
                    class="w-full sm:w-auto justify-center"
                  >
                    View upcoming events
                  </UButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
        <img
          v-if="event"
          class="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
          :src="heroImage"
          :alt="event?.title || 'Event cover'"
          @error="onImgError"
        />
      </div>
    </div>

    <div class="py-12 bg-white dark:bg-gray-900">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="lg:grid lg:grid-cols-3 lg:gap-8">
          <div class="lg:col-span-2">
            <!-- About -->
            <div v-if="event" class="prose dark:prose-invert max-w-none">
              <h2>About this {{ typeLabel.toLowerCase() }}</h2>
              <p>{{ event.description }}</p>
            </div>

            <!-- Speakers (always show; placeholder when empty) -->
            <div v-if="event && event.speakers?.length" class="mt-12">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Speakers</h3>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div
                  v-for="sp in event?.speakers || []"
                  :key="sp.id"
                  class="flex items-start gap-4 p-4 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                >
                  <img
                    :src="
                      normalizeUrl(sp.photoUrl) ||
                      `https://picsum.photos/seed/speaker-${sp.id}/160/160`
                    "
                    :alt="sp.name"
                    class="h-16 w-16 rounded-full object-cover"
                    @error="onSpeakerImgError"
                  />
                  <div>
                    <p class="font-medium text-gray-900 dark:text-white">{{ sp.name }}</p>
                    <p v-if="sp.title || sp.org" class="text-sm text-gray-600 dark:text-gray-300">
                      {{ [sp.title, sp.org].filter(Boolean).join(', ') }}
                    </p>
                    <p
                      v-if="sp.bio"
                      class="mt-2 text-sm text-gray-500 dark:text-gray-400 line-clamp-3"
                    >
                      {{ sp.bio }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Sidebar -->
          <div class="mt-12 lg:mt-0 lg:pl-8">
            <div class="space-y-6">
              <!-- Organizing Committee -->
              <div
                v-if="event?.committee && event.committee.length"
                class="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden"
              >
                <div class="p-6">
                  <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    Organizing Committee
                  </h3>
                  <ul class="space-y-4">
                    <li v-for="m in event.committee" :key="m.id" class="flex items-start gap-3">
                      <UIcon name="i-heroicons-user" class="h-5 w-5 text-gray-400 mt-0.5" />
                      <div>
                        <div class="font-medium text-gray-900 dark:text-white">{{ m.name }}</div>
                        <div class="text-sm text-gray-600 dark:text-gray-300">
                          <span v-if="m.role">{{ m.role }}</span>
                          <span v-if="m.role && (m.email || m.phone)" class="mx-2">•</span>
                          <NuxtLink
                            v-if="m.email"
                            :to="`mailto:${m.email}`"
                            class="hover:underline"
                            >{{ m.email }}</NuxtLink
                          >
                          <span v-if="m.phone">
                            <span v-if="m.email" class="mx-2">•</span>
                            <NuxtLink :to="`tel:${m.phone}`" class="hover:underline">{{
                              m.phone
                            }}</NuxtLink>
                          </span>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>

              <!-- Sponsors (always show; placeholder when empty) -->
              <div
                v-if="event?.sponsors?.length"
                class="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden"
              >
                <div class="p-6">
                  <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Sponsors</h3>
                  <div class="grid grid-cols-2 gap-4">
                    <a
                      v-for="s in event?.sponsors || []"
                      :key="s.id"
                      :href="s.website || '#'"
                      target="_blank"
                      class="flex items-center justify-center p-2 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
                    >
                      <img
                        :src="normalizeUrl(s.logoUrl) || ''"
                        :alt="s.name"
                        class="h-10 object-contain"
                        @error="onSponsorImgError"
                      />
                    </a>
                  </div>
                </div>
              </div>
              <div
                v-else-if="event"
                class="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden"
              >
                <div class="p-6">
                  <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Sponsors</h3>
                  <p class="text-sm text-gray-600 dark:text-gray-300">
                    Sponsorship information will be available soon.
                  </p>
                </div>
              </div>

              <!-- Gallery (only for past events) -->
              <div
                v-if="isPast && event?.gallery?.length"
                class="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden"
              >
                <div class="p-6">
                  <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Gallery</h3>
                  <div class="grid grid-cols-2 gap-2">
                    <img
                      v-for="g in (event?.gallery || []).filter(g => g.type !== 'video')"
                      :key="g.id"
                      :src="normalizeUrl(g.url) || ''"
                      :alt="g.caption || 'Event image'"
                      class="rounded object-cover h-24 w-full"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Abstract Submission Modal -->
    <UModal v-model:open="showSubmissionForm" :dismissible="false">
      <template #content>
        <div class="h-[85vh] flex flex-col">
          <UCard
            class="flex flex-col h-full"
            :ui="{ body: 'flex-1 flex flex-col overflow-hidden p-0' }"
          >
            <template #header>
              <div class="flex items-center justify-between">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                  Submit Abstract - {{ event?.title }}
                </h3>
                <UButton
                  color="neutral"
                  variant="ghost"
                  icon="i-heroicons-x-mark"
                  @click="showSubmissionForm = false"
                />
              </div>
            </template>
            <UForm
              :schema="abstractSubmissionSchema"
              :state="submissionForm"
              class="flex-1 flex flex-col overflow-hidden"
              @submit="submitAbstractForm"
            >
              <div class="overflow-y-auto p-2 space-y-6">
                <!-- Submission Category -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Submission Category *
                  </label>
                  <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div
                      v-for="category in submissionCategories"
                      :key="category.id"
                      class="relative h-full"
                    >
                      <input
                        :id="`category-${category.id}`"
                        v-model="submissionForm.category"
                        type="radio"
                        :value="category.id"
                        class="sr-only"
                      />
                      <label
                        :for="`category-${category.id}`"
                        class="h-full p-4 border-2 rounded-lg cursor-pointer transition-colors flex flex-col items-center justify-center text-center"
                        :class="[
                          submissionForm.category === category.id
                            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600',
                        ]"
                      >
                        <div class="font-medium text-sm">{{ category.label }}</div>
                      </label>
                    </div>
                  </div>
                </div>

                <!-- Title -->
                <UFormField label="Title *" name="title">
                  <UInput
                    v-model="submissionForm.title"
                    placeholder="Enter your abstract title"
                    class="w-full"
                  />
                </UFormField>

                <!-- Authors -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Authors *
                  </label>
                  <div class="space-y-2">
                    <div
                      v-for="(author, index) in submissionForm.authors"
                      :key="index"
                      class="flex gap-2"
                    >
                      <UInput
                        v-model="submissionForm.authors[index]"
                        :placeholder="`Author ${index + 1}`"
                        class="flex-1"
                      />
                      <UButton
                        v-if="submissionForm.authors.length > 1"
                        color="error"
                        variant="ghost"
                        icon="i-heroicons-trash"
                        @click="removeAuthor(index)"
                      />
                    </div>
                    <UButton
                      color="neutral"
                      variant="soft"
                      icon="i-heroicons-plus"
                      @click="addAuthor"
                    >
                      Add Author
                    </UButton>
                  </div>
                </div>

                <!-- Corresponding Author -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <UFormField label="Corresponding Author Name *" name="correspondingAuthor.name">
                    <UInput
                      v-model="submissionForm.correspondingAuthor.name"
                      placeholder="Full name"
                      class="w-full"
                    />
                  </UFormField>
                  <UFormField label="Email *" name="correspondingAuthor.email">
                    <UInput
                      v-model="submissionForm.correspondingAuthor.email"
                      type="email"
                      placeholder="email@example.com"
                      class="w-full"
                    />
                  </UFormField>
                </div>

                <!-- Institution -->
                <UFormField
                  label="Institution/Organization *"
                  name="correspondingAuthor.affiliation"
                >
                  <UInput
                    v-model="submissionForm.correspondingAuthor.affiliation"
                    placeholder="Enter your institution or organization"
                    class="w-full"
                  />
                </UFormField>

                <!-- Phone (Optional) -->
                <UFormField label="Phone (Optional)" name="correspondingAuthor.phone">
                  <UInput
                    v-model="submissionForm.correspondingAuthor.phone"
                    placeholder="Phone number"
                    class="w-full"
                  />
                </UFormField>

                <!-- Abstract -->
                <UFormField label="Abstract *" name="abstract">
                  <UTextarea
                    v-model="submissionForm.abstract"
                    :rows="8"
                    placeholder="Enter your abstract here..."
                    class="w-full"
                  />
                  <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Word count:
                    {{
                      submissionForm.abstract
                        ? submissionForm.abstract.split(/\s+/).filter(Boolean).length
                        : 0
                    }}
                  </p>
                </UFormField>

                <!-- Keywords -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Keywords (3-5) *
                  </label>
                  <div class="space-y-2">
                    <div class="flex gap-2">
                      <UInput
                        v-model="keywordsInput"
                        placeholder="Add a keyword and press Enter"
                        class="flex-1"
                        @keydown.enter.prevent="updateKeywords"
                      />
                      <UButton @click="updateKeywords">Add</UButton>
                    </div>
                    <div
                      v-if="submissionForm.keywords.length > 0"
                      class="flex flex-wrap gap-2 mt-2"
                    >
                      <span
                        v-for="(keyword, index) in submissionForm.keywords"
                        :key="index"
                        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
                      >
                        {{ keyword }}
                        <button
                          type="button"
                          class="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full text-blue-400 hover:bg-blue-200 hover:text-blue-500 dark:hover:bg-blue-800 dark:hover:text-blue-300"
                          @click="removeKeyword(index)"
                        >
                          <span class="sr-only">Remove</span>
                          <svg class="w-2 h-2" fill="currentColor" viewBox="0 0 8 8">
                            <path
                              fill-rule="evenodd"
                              d="M4 3.293l2.146-2.147a.5.5 0 01.708.708L4.707 4l2.147 2.146a.5.5 0 01-.708.708L4 4.707l-2.146 2.147a.5.5 0 01-.708-.708L3.293 4 1.146 1.854a.5.5 0 01.708-.708L4 3.293z"
                              clip-rule="evenodd"
                            />
                          </svg>
                        </button>
                      </span>
                    </div>
                  </div>
                </div>

                <!-- Additional Notes -->
                <UFormField label="Additional Notes (Optional)" name="notes">
                  <UTextarea
                    v-model="submissionForm.notes"
                    :rows="4"
                    placeholder="Any additional information or special requirements..."
                    class="w-full"
                  />
                </UFormField>
              </div>
            </UForm>
            <template #footer>
              <div class="flex justify-end space-x-3">
                <UButton
                  type="button"
                  color="neutral"
                  variant="ghost"
                  @click="showSubmissionForm = false"
                >
                  Cancel
                </UButton>
                <UButton type="submit" color="primary" :loading="isSubmitting">
                  Submit Abstract
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
import { submissionCategories } from '../../../../types/submissions'
import type { Event as ApiEvent } from '../../../../types/event'
import { abstractSubmissionSchema, type AbstractSubmissionData } from '~/schemas/submissions'

const route = useRoute()
const { getPublicEventBySlug } = useEvents()
const { submitAbstract } = useSubmissions()
const slug = computed(() => route.params.slug as string)

function _slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}

// Normalize potentially relative URLs from backend to absolute URLs for <img src>
function normalizeUrl(u?: string | null): string | undefined {
  if (!u) return undefined
  if (/^https?:\/\//i.test(u)) return u
  try {
    const origin = typeof window !== 'undefined' ? window.location.origin : ''
    return origin && u.startsWith('/') ? `${origin}${u}` : u
  } catch {
    return u
  }
}

// Extend API Event with optional fields used in this page
type ExtendedEvent = ApiEvent & {
  speakers?: Array<{
    id: number
    name: string
    title?: string
    org?: string
    photoUrl?: string
    bio?: string
  }>
  committee?: Array<{
    id: number
    name: string
    role?: string
    email?: string
    phone?: string
  }>
  sponsors?: Array<{
    id: number
    name: string
    logoUrl: string
    website?: string
    tier?: string
  }>
  gallery?: Array<{
    id: number
    url: string
    caption?: string
    type?: 'image' | 'video'
  }>
  bannerUrl?: string
}

// Types for event normalization
type MediaItem = { url?: string; [key: string]: unknown }
type SponsorItem = {
  logoUrl?: string
  logo_url?: string
  website?: string
  website_url?: string
  [key: string]: unknown
}
type SpeakerItem = {
  photoUrl?: string
  photo_url?: string
  [key: string]: unknown
}

// Fetch public single event by slug
const { data: eventResponse, refresh: refreshPublicEvent } = await getPublicEventBySlug(slug.value)

// Normalize server 'media' field to 'gallery' expected by the template
const event = computed<ExtendedEvent | null>(() => {
  const e = eventResponse.value as
    | (ExtendedEvent & {
        media?: MediaItem[]
        banner_url?: string
        logo_url?: string
        photo_url?: string
      })
    | null

  if (!e) return null

  // Normalize arrays with proper type assertions
  const gallery = ((e.gallery ?? e.media ?? []) as MediaItem[]).map(m => ({
    ...m,
    url: m.url ? normalizeUrl(m.url) : m.url,
  }))

  const sponsors = ((e.sponsors ?? []) as SponsorItem[]).map(s => ({
    ...s,
    logoUrl: s.logoUrl || s.logo_url ? normalizeUrl(s.logoUrl || s.logo_url || '') : undefined,
    website: s.website || s.website_url || '',
  }))

  const speakers = ((e.speakers ?? []) as SpeakerItem[]).map(sp => ({
    ...sp,
    photoUrl:
      sp.photoUrl || sp.photo_url ? normalizeUrl(sp.photoUrl || sp.photo_url || '') : undefined,
  }))
  return {
    ...e,
    gallery,
    sponsors,
    speakers,
    bannerUrl: normalizeUrl(e.bannerUrl || e.banner_url) || e.bannerUrl || e.banner_url,
  } as ExtendedEvent
})

// Refresh if slug changes while staying on the same component instance
watch(slug, async () => {
  await refreshPublicEvent()
})

const typeLabel = computed(() =>
  event.value ? event.value.type.charAt(0).toUpperCase() + event.value.type.slice(1) : 'Event'
)

// Whether the event is a conference (used to show sponsors/speakers)
const _isConference = computed(() => (event.value?.type || '').toLowerCase() === 'conference')

const heroImage = computed(() => {
  const banner = normalizeUrl(event.value?.bannerUrl)
  const firstImage = normalizeUrl(
    event.value?.gallery?.find(g => (g.type ?? 'image') !== 'video')?.url
  )
  return banner || firstImage || `https://picsum.photos/seed/${slug.value || 'epison'}/1600/900`
})

// Register route path for this event
const registerPath = computed(() => `/events/${slug.value}/register`)

const badgeClass = computed(() => {
  switch (typeLabel.value) {
    case 'Conference':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    case 'Workshop':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    case 'Seminar':
      return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200'
    case 'Symposium':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
    case 'Webinar':
      return 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  }
})

function formatDateRange(start?: string, end?: string) {
  if (!start) return ''
  const startDate = new Date(start)
  if (!end)
    return startDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  const endDate = new Date(end)
  const sameMonth =
    startDate.getMonth() === endDate.getMonth() && startDate.getFullYear() === endDate.getFullYear()
  if (sameMonth) {
    return `${startDate.toLocaleDateString('en-US', { month: 'long' })} ${startDate.getDate()}–${endDate.getDate()}, ${endDate.getFullYear()}`
  }
  return `${startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} – ${endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
}

const isPast = computed(() => {
  if (!event.value) return false
  const end = event.value.endDate ? new Date(event.value.endDate) : new Date(event.value.startDate)
  return end.getTime() < Date.now()
})

// Abstract submission functionality
const showSubmissionForm = ref(false)
const isSubmitting = ref(false)
const keywordsInput = ref('')

const canSubmitAbstract = computed(() => {
  if (!event.value) return false
  if (!event.value.id) return false
  return !!(event.value.collectsSubmissions && !isPast.value)
})

const submissionForm = reactive<AbstractSubmissionData>({
  title: '',
  abstract: '',
  authors: [''],
  correspondingAuthor: {
    name: '',
    email: '',
    affiliation: '',
    phone: '',
  },
  keywords: [],
  category: 'oral',
  notes: '',
})

function addAuthor() {
  submissionForm.authors.push('')
}

function removeAuthor(index: number) {
  submissionForm.authors.splice(index, 1)
}

function updateKeywords() {
  if (keywordsInput.value.trim()) {
    const keywords = keywordsInput.value
      .split(',')
      .map(k => k.trim())
      .filter(k => k.length > 0)
    submissionForm.keywords = [...new Set([...submissionForm.keywords, ...keywords])]
    keywordsInput.value = ''
  }
}

function removeKeyword(index: number) {
  submissionForm.keywords.splice(index, 1)
}

async function submitAbstractForm(formEvent: { data: AbstractSubmissionData }) {
  if (!formEvent.data || !event.value) return

  isSubmitting.value = true
  try {
    await submitAbstract({
      eventId: String(event.value.id),
      title: formEvent.data.title.trim(),
      abstract: formEvent.data.abstract.trim(),
      authors: formEvent.data.authors.filter(a => a.trim()).map(a => a.trim()),
      correspondingAuthor: {
        name: formEvent.data.correspondingAuthor.name.trim(),
        email: formEvent.data.correspondingAuthor.email.trim(),
        affiliation: formEvent.data.correspondingAuthor.affiliation.trim(),
        phone: formEvent.data.correspondingAuthor.phone?.trim() || undefined,
      },
      keywords: formEvent.data.keywords,
      category: formEvent.data.category,
      notes: formEvent.data.notes?.trim() || undefined,
    })
    useToast().add({
      title: 'Abstract Submitted',
      description: 'Your abstract has been successfully submitted for review.',
      color: 'success',
    })

    // Reset form
    Object.assign(submissionForm, {
      title: '',
      abstract: '',
      authors: [''],
      correspondingAuthor: {
        name: '',
        email: '',
        affiliation: '',
        phone: '',
      },
      keywords: [],
      category: 'oral',
      notes: '',
    })
    keywordsInput.value = ''
    showSubmissionForm.value = false
  } catch (error) {
    // Handle Zod validation errors
    if (error && typeof error === 'object' && 'flatten' in error) {
      const flattened = (
        error as { flatten: () => { fieldErrors: Record<string, string[]>; formErrors: string[] } }
      ).flatten()

      // Show field-specific errors
      Object.entries(flattened.fieldErrors).forEach(([field, messages]) => {
        if (messages && Array.isArray(messages) && messages.length > 0) {
          useToast().add({
            title: 'Validation Error',
            description: `${field}: ${messages[0]}`,
            color: 'error',
          })
        }
      })

      // Show form-level errors if any
      flattened.formErrors.forEach((message: string) => {
        useToast().add({
          title: 'Validation Error',
          description: message,
          color: 'error',
        })
      })

      return
    }

    // Handle other errors
    useToast().add({
      title: 'Submission Failed',
      description: 'There was an error submitting your abstract. Please try again.',
      color: 'error',
    })
  } finally {
    isSubmitting.value = false
  }
}

function onImgError(e: Event) {
  const el = e.target as HTMLImageElement | null
  if (!el) return
  let idx = parseInt(el.dataset?.fallbackIdx ?? '0', 10)
  if (Number.isNaN(idx) || idx < 0) idx = 0
  const fallbacks: string[] = [
    'https://picsum.photos/seed/episonh1/1600/900',
    'https://picsum.photos/seed/episonh2/1600/900',
    'https://placehold.co/1600x900/png',
  ]
  if (idx >= fallbacks.length) return
  const fb = (fallbacks[idx] ?? fallbacks[0]) as string
  try {
    el.src = fb
  } catch {
    el.setAttribute('src', fb)
  }
  if (el.dataset) el.dataset.fallbackIdx = String(idx + 1)
}

// Speakers avatar fallback (square)
function onSpeakerImgError(e: Event) {
  const el = e.target as HTMLImageElement | null
  if (!el) return
  let idx = parseInt(el.dataset?.fallbackIdx ?? '0', 10)
  if (Number.isNaN(idx) || idx < 0) idx = 0
  const fallbacks: string[] = [
    'https://picsum.photos/seed/speaker1/160/160',
    'https://picsum.photos/seed/speaker2/160/160',
    'https://placehold.co/160x160/png',
  ]
  if (idx >= fallbacks.length) return
  const fb = (fallbacks[idx] ?? fallbacks[0]) as string
  try {
    el.src = fb
  } catch {
    el.setAttribute('src', fb)
  }
  if (el.dataset) el.dataset.fallbackIdx = String(idx + 1)
}

// Sponsor logo fallback (wide)
function onSponsorImgError(e: Event) {
  const el = e.target as HTMLImageElement | null
  if (!el) return
  let idx = parseInt(el.dataset?.fallbackIdx ?? '0', 10)
  if (Number.isNaN(idx) || idx < 0) idx = 0
  const fallbacks: string[] = [
    'https://placehold.co/160x80?text=Sponsor',
    'https://picsum.photos/seed/sponsor1/160/80',
    'https://picsum.photos/seed/sponsor2/160/80',
  ]
  if (idx >= fallbacks.length) return
  const fb = (fallbacks[idx] ?? fallbacks[0]) as string
  try {
    el.src = fb
  } catch {
    el.setAttribute('src', fb)
  }
  if (el.dataset) el.dataset.fallbackIdx = String(idx + 1)
}

// SEO
useHead(() => ({
  title: event.value ? `${event.value.title} | EPISON Events` : 'Event | EPISON',
  meta: [
    { name: 'description', content: event.value?.description || 'EPISON event' },
    {
      property: 'og:title',
      content: event.value ? `${event.value.title} | EPISON Events` : 'EPISON Event',
    },
    { property: 'og:description', content: event.value?.description || '' },
    { property: 'og:type', content: 'event' },
    { property: 'og:image', content: heroImage.value },
  ],
}))
</script>
