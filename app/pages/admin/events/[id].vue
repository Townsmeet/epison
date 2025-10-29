<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
        <UButton color="neutral" variant="ghost" icon="i-heroicons-arrow-left" @click="goBack"
          >Back</UButton
        >
        <span>/</span>
        <span class="text-gray-900 dark:text-white font-medium">Event Details</span>
      </div>
      <div class="flex items-center gap-2">
        <UButton color="neutral" variant="outline" icon="i-heroicons-pencil" @click="editEvent"
          >Edit</UButton
        >
        <UButton
          color="neutral"
          variant="outline"
          icon="i-heroicons-users"
          :class="[_getStatusBadgeClass('Registrations')]"
          @click="currentTab = 'Registrations' as any"
          >Registrations
        </UButton>
        <UButton color="error" variant="outline" icon="i-heroicons-trash" @click="handleDeleteEvent"
          >Delete</UButton
        >
      </div>
    </div>

    <!-- Tabs -->
    <div class="mb-6">
      <div
        class="flex flex-wrap gap-2 p-2 bg-white dark:bg-gray-800 rounded-xl border border-gray-200/60 dark:border-gray-700/60"
      >
        <button
          v-for="tab in tabs"
          :key="tab"
          :class="[
            currentTab === tab
              ? 'bg-primary-600 text-white shadow'
              : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700',
            'px-4 py-2 rounded-lg text-sm font-medium transition',
          ]"
          @click="switchTab(tab)"
        >
          {{ tab }}
        </button>
      </div>
    </div>

    <UAlert v-if="!event" title="Event not found" color="warning" variant="subtle" class="mb-6">
      <template #description>
        We couldn't find an event with ID "{{ id }}". It may have been removed.
      </template>
      <template #actions>
        <UButton color="primary" to="/admin/events" icon="i-heroicons-list-bullet"
          >Go to Events</UButton
        >
      </template>
    </UAlert>

    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Main -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Details Tab -->
        <AdminEventsDetailsTab v-if="event" v-show="currentTab === 'Details'" :event="event" />

        <!-- Tickets Tab -->
        <AdminEventsTicketsTab v-if="event" v-show="currentTab === 'Tickets'" :event="event" />

        <!-- Registrations Tab -->
        <AdminEventsRegistrationsTab
          v-show="currentTab === 'Registrations'"
          :event-id="event.id"
          :event-title="event.title"
        />

        <!-- Submissions Tab -->
        <AdminEventsSubmissionsTab
          v-if="event"
          v-show="currentTab === 'Submissions'"
          :event-id="id"
        />

        <!-- Committee Tab -->
        <AdminEventsCommitteeTab v-if="event" v-show="currentTab === 'Committee'" :event="event" />

        <!-- Sponsors Tab -->
        <AdminEventsSponsorsTab v-if="event" v-show="currentTab === 'Sponsors'" :event="event" />

        <!-- Gallery Tab -->
        <AdminEventsGalleryTab v-if="event" v-show="currentTab === 'Gallery'" :event="event" />

        <!-- Reviews Tab -->
        <AdminEventsReviewsTab v-if="event" v-show="currentTab === 'Reviews'" :event="event" />
      </div>

      <!-- Sidebar -->
      <div class="space-y-6">
        <AdminEventsSidebarActions
          v-if="event"
          :event="event"
          @share="shareEvent"
          @duplicate="duplicateEvent"
          @export="exportEvent"
          @cancel="cancelEvent"
        />

        <AdminEventsSidebarMeta v-if="event" :event="event" />
      </div>
    </div>

    <!-- Edit Event Modal -->
    <UModal v-model:open="isEditOpen" :title="modalTitle" :description="modalDescription">
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
            <template #header>
              <div class="flex items-center justify-between">
                <h3 class="text-lg font-semibold">Edit Event</h3>
                <UButton
                  color="neutral"
                  variant="ghost"
                  icon="i-heroicons-x-mark"
                  @click="isEditOpen = false"
                />
              </div>
              <div class="mt-2 flex gap-2 text-xs">
                <span :class="editStep === 1 ? 'font-bold underline' : ''">1: Info</span>
                <span>→</span>
                <span :class="editStep === 2 ? 'font-bold underline' : ''">2: Theme</span>
                <span>→</span>
                <span :class="editStep === 3 ? 'font-bold underline' : ''">3: Abstracts</span>
              </div>
            </template>

            <div v-if="editStep === 1" class="space-y-6">
              <UForm :state="editEventForm" class="space-y-6">
                <UFormField label="Event Title" name="title" required>
                  <UInput
                    v-model="editEventForm.title"
                    placeholder="Enter event title"
                    class="w-full"
                  />
                </UFormField>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <UFormField label="Event Type" name="type" required>
                    <USelect
                      v-model="editEventForm.type"
                      :items="[
                        { label: 'Conference', value: 'conference' },
                        { label: 'Workshop', value: 'workshop' },
                        { label: 'Webinar', value: 'webinar' },
                        { label: 'Seminar', value: 'seminar' },
                        { label: 'Symposium', value: 'symposium' },
                      ]"
                      placeholder="Select event type"
                      class="w-full"
                    />
                  </UFormField>

                  <UFormField label="Status" name="status" required>
                    <USelect
                      v-model="editEventForm.status"
                      :items="[
                        { label: 'Draft', value: 'draft' },
                        { label: 'Published', value: 'published' },
                        { label: 'Registration Open', value: 'registration_open' },
                        { label: 'Registration Closed', value: 'registration_closed' },
                        { label: 'Ongoing', value: 'ongoing' },
                        { label: 'Completed', value: 'completed' },
                        { label: 'Cancelled', value: 'cancelled' },
                      ]"
                      placeholder="Select status"
                      class="w-full"
                    />
                  </UFormField>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <UFormField label="Start Date" name="startDate" required>
                    <UInput
                      v-model="editEventForm.startDate"
                      type="datetime-local"
                      class="w-full"
                    />
                  </UFormField>

                  <UFormField label="End Date" name="endDate">
                    <UInput v-model="editEventForm.endDate" type="datetime-local" class="w-full" />
                  </UFormField>
                </div>

                <UFormField label="Location" name="location" required>
                  <UInput
                    v-model="editEventForm.location"
                    placeholder="Event location"
                    class="w-full"
                  />
                </UFormField>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <UFormField label="Capacity" name="capacity">
                    <UInput
                      v-model="editEventForm.capacity"
                      type="number"
                      placeholder="Maximum attendees"
                      class="w-full"
                    />
                  </UFormField>
                </div>

                <UFormField label="Description" name="description">
                  <UTextarea
                    v-model="editEventForm.description"
                    placeholder="Event description"
                    :rows="4"
                    class="w-full"
                  />
                </UFormField>

                <!-- Banner Image -->
                <UFormField label="Event Banner Image" name="bannerImage">
                  <input
                    type="file"
                    accept="image/*"
                    class="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100 dark:text-gray-300 dark:file:bg-primary-900/20 dark:file:text-primary-300"
                    @change="onEditBannerSelected"
                  />
                  <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Upload a JPG/PNG banner. Recommended aspect ratio ~3:2. Max ~2MB.
                  </p>
                  <div v-if="isUploadingBanner" class="mt-2 flex items-center gap-2">
                    <UIcon name="i-heroicons-arrow-path" class="w-4 h-4 animate-spin" />
                    <span class="text-xs text-gray-500 dark:text-gray-400"
                      >Uploading banner...</span
                    >
                  </div>
                  <div v-if="bannerPreview" class="mt-3">
                    <img
                      :src="bannerPreview"
                      alt="Banner preview"
                      class="w-full h-40 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
                    />
                  </div>
                </UFormField>
              </UForm>
            </div>

            <div v-else-if="editStep === 2" class="space-y-6">
              <UForm :state="editEventForm" class="space-y-6">
                <UFormField label="Theme" name="theme" required>
                  <UInput
                    v-model="editEventForm.theme"
                    placeholder="Enter event theme"
                    class="w-full"
                    maxlength="200"
                  />
                </UFormField>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Subthemes
                  </label>
                  <div class="space-y-2">
                    <div v-for="(st, i) in editEventForm.subthemesList" :key="i" class="flex gap-2">
                      <UInput
                        v-model="editEventForm.subthemesList[i]"
                        :placeholder="`Subtheme ${i + 1}`"
                        class="flex-1"
                      />
                      <UButton
                        v-if="editEventForm.subthemesList.length > 0"
                        color="error"
                        variant="ghost"
                        icon="i-heroicons-trash"
                        @click="editEventForm.subthemesList.splice(i, 1)"
                      />
                    </div>
                    <UButton
                      color="neutral"
                      variant="soft"
                      icon="i-heroicons-plus"
                      @click="editEventForm.subthemesList.push('')"
                    >
                      Add Subtheme
                    </UButton>
                  </div>
                </div>
              </UForm>
            </div>

            <div v-else-if="editStep === 3" class="space-y-6">
              <UForm :state="editEventForm" class="space-y-6">
                <div class="flex items-center">
                  <UCheckbox
                    v-model="editEventForm.collectsSubmissions"
                    label="Collect Abstract Submissions for this event?"
                  />
                </div>
                <div v-if="editEventForm.collectsSubmissions">
                  <UFormField label="Submission Guidelines" name="submissionGuidelines">
                    <UTextarea
                      v-model="editEventForm.submissionGuidelines"
                      placeholder="Paste your guidelines (you can include important dates here)"
                      :rows="8"
                      class="w-full"
                    />
                  </UFormField>
                </div>
              </UForm>
            </div>

            <template #footer>
              <div class="flex justify-between space-x-3">
                <UButton color="neutral" variant="ghost" @click="isEditOpen = false"
                  >Cancel</UButton
                >
                <div>
                  <UButton
                    v-if="editStep > 1"
                    color="neutral"
                    variant="soft"
                    class="mr-2"
                    @click="editStep--"
                    >Back
                  </UButton>
                  <UButton v-if="editStep < 3" color="primary" @click="editStep++">Next</UButton>
                  <UButton
                    v-else
                    color="primary"
                    :loading="isSavingEdit || isUploadingBanner"
                    :disabled="isUploadingBanner"
                    @click="handleUpdateEvent"
                    >Save Changes</UButton
                  >
                </div>
              </div>
            </template>
          </UCard>
        </div>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import { nextTick } from 'vue'
import type { AbstractSubmission } from '../../../../types/submissions'
import type { EventItem } from '../../../composables/useEvents'
import type { CreateEventForm } from '../../../../types/event'

definePageMeta({ layout: 'admin' })

const route = useRoute()
const id = computed(() => route.params.id as string)

const events = useEvents()
const { getEvent, deleteEvent, refreshEvent } = events
const submissions = useSubmissions()

// Fetch event data from API
const { data: eventResponse, pending: _eventLoading, error: _eventError } = await getEvent(id.value)

// Transform API response to EventItem format for backward compatibility
const event = computed(() => {
  const e = eventResponse.value?.data
  if (!e) return null
  console.log('[AdminEventDetail] Event data received:', {
    id: e.id,
    idType: typeof e.id,
    title: e.title,
    rawId: e.id,
  })
  return {
    ...e,
    registrations: e.registrationCount || 0,
    revenue: e.revenue || 0,
  } as EventItem
})

// Image URL computation is now handled in the component where it's needed

// Modal a11y title/description
const modalTitle = computed(() => 'Edit Event')
const modalDescription = computed(() => `Update details for "${event.value?.title ?? ''}"`)

// Tabs
const tabs = [
  'Details',
  'Tickets',
  'Sponsors',
  'Registrations',
  'Submissions',
  'Committee',
  'Gallery',
  'Reviews',
]
const currentTab = ref<
  | 'Details'
  | 'Tickets'
  | 'Registrations'
  | 'Sponsors'
  | 'Submissions'
  | 'Committee'
  | 'Gallery'
  | 'Reviews'
>('Details')

// Occupancy computation is now handled in the DetailsTab component

// Status color logic is now handled in the DetailsTab component

// Date range formatting is now handled in the DetailsTab component
function _formatDateRange(startDate: string, endDate?: string): string {
  const start = new Date(startDate)
  const end = endDate ? new Date(endDate) : null
  const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' }
  if (!end || start.toDateString() === end.toDateString()) {
    return start.toLocaleDateString('en-US', options)
  }
  return `${start.toLocaleDateString('en-US', options)} - ${end.toLocaleDateString('en-US', options)}`
}

function _slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}

function _onImgError(e: Event) {
  const el = e.target as HTMLImageElement | null
  if (!el) return
  let idx = parseInt(el.dataset?.fallbackIdx ?? '0', 10)
  if (Number.isNaN(idx) || idx < 0) idx = 0
  const fallbacks: string[] = [
    'https://picsum.photos/seed/episonadmin1/1200/800',
    'https://picsum.photos/seed/episonadmin2/1200/800',
    'https://placehold.co/1200x800/png',
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

function goBack() {
  navigateTo('/admin/events')
}
// Edit modal state
const isEditOpen = ref(false)
const isSavingEdit = ref(false)
const isUploadingBanner = ref(false)
const bannerPreview = ref<string>('')
const bannerFile = ref<File | null>(null)
const editStep = ref(1)

// Local edit form state
const editEventForm = reactive({
  title: '',
  type: 'webinar',
  status: 'draft',
  startDate: '',
  endDate: '',
  location: '',
  capacity: '' as string | number,
  description: '',
  collectsSubmissions: false,
  theme: '',
  subthemesList: [] as string[],
  submissionGuidelines: '',
})

function preloadEditForm() {
  const e = event.value
  if (!e) return
  editStep.value = 1
  editEventForm.title = e.title || ''
  editEventForm.type =
    (e.type as 'webinar' | 'conference' | 'workshop' | 'seminar' | 'symposium') || 'webinar'
  editEventForm.status =
    (e.status as
      | 'draft'
      | 'published'
      | 'registration_open'
      | 'registration_closed'
      | 'ongoing'
      | 'completed'
      | 'cancelled') || 'draft'
  const toLocalInput = (iso?: string) => (iso ? new Date(iso).toISOString().slice(0, 16) : '')
  editEventForm.startDate = toLocalInput(e.startDate)
  editEventForm.endDate = toLocalInput(e.endDate)
  editEventForm.location = e.location || ''
  editEventForm.capacity = (e.capacity as number | string) ?? ''
  editEventForm.description = e.description || ''
  editEventForm.collectsSubmissions = !!e.collectsSubmissions
  editEventForm.theme = e.theme || ''
  editEventForm.subthemesList = Array.isArray(e.subthemes) ? [...e.subthemes] : []
  editEventForm.submissionGuidelines = e.submissionGuidelines || ''
  const existing =
    (e as EventItem & { bannerUrl?: string }).bannerUrl ||
    e.gallery?.find(g => (g.type ?? 'image') !== 'video')?.url ||
    ''
  bannerPreview.value = existing || ''
  bannerFile.value = null
}

function editEvent() {
  if (!event.value) return
  preloadEditForm()
  isEditOpen.value = true
}

async function handleUpdateEvent() {
  if (!event.value) return
  isSavingEdit.value = true
  try {
    const toISO = (val?: string) => (val ? new Date(val).toISOString() : undefined)
    const payload: Partial<CreateEventForm> = {
      title: editEventForm.title.trim() || undefined,
      type: editEventForm.type as 'webinar' | 'conference' | 'workshop' | 'seminar' | 'symposium',
      status: editEventForm.status as
        | 'draft'
        | 'published'
        | 'registration_open'
        | 'registration_closed'
        | 'ongoing'
        | 'completed'
        | 'cancelled',
      startDate: toISO(editEventForm.startDate)!,
      endDate: toISO(editEventForm.endDate),
      location: editEventForm.location.trim() || undefined,
      capacity:
        editEventForm.capacity !== '' && editEventForm.capacity !== null
          ? Number(editEventForm.capacity)
          : undefined,
      description: editEventForm.description?.trim() || undefined,
      collectsSubmissions: !!editEventForm.collectsSubmissions,
      theme: editEventForm.theme?.trim() || undefined,
      subthemes: (editEventForm.subthemesList || []).map(s => s.trim()).filter(Boolean),
      submissionGuidelines: editEventForm.submissionGuidelines || undefined,
      submissionDates: undefined,
    }
    // If a new banner was selected, upload and include bannerUrl
    if (bannerFile.value) {
      isUploadingBanner.value = true
      const file = bannerFile.value
      const e = event.value
      const slugBase = (e as EventItem & { slug?: string }).slug || e.title
      const ext = file.name.includes('.') ? file.name.slice(file.name.lastIndexOf('.')) : ''
      const key = `${slugBase}-${Date.now()}${ext}`
      const form = new FormData()
      form.append('file', file)
      form.append('folder', 'events/banners')
      form.append('key', key)
      try {
        const uploadResp = await $fetch<{ url: string }>(`/api/uploads`, {
          method: 'POST',
          body: form,
          credentials: 'include',
        })
        ;(payload as Partial<CreateEventForm> & { bannerUrl?: string }).bannerUrl = uploadResp.url
      } catch (err) {
        console.error('Banner upload failed:', err)
        useToast().add({
          title: 'Upload failed',
          description: 'Could not upload banner image. Please try again.',
          color: 'error',
        })
        throw err
      } finally {
        isUploadingBanner.value = false
      }
    }
    await events.updateEvent(event.value.id, payload)
    await refreshEvent(event.value.id)
    isEditOpen.value = false
    useToast().add({
      title: 'Event updated',
      description: 'Changes saved successfully',
      color: 'success',
    })
  } catch (error) {
    console.error('Error updating event:', error)
    const e = error as {
      data?: { statusMessage?: string; message?: string }
      statusMessage?: string
      message?: string
    }
    const msg =
      e?.data?.statusMessage ||
      e?.data?.message ||
      e?.statusMessage ||
      e?.message ||
      'Failed to update event'
    useToast().add({ title: 'Error', description: msg, color: 'error' })
  } finally {
    isSavingEdit.value = false
  }
}

function onEditBannerSelected(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  // Validate file type and size (<= 2MB)
  const allowed = new Set(['image/jpeg', 'image/png'])
  if (!allowed.has(file.type)) {
    useToast().add({
      title: 'Invalid file type',
      description: 'Please upload a JPG or PNG image.',
      color: 'warning',
    })
    input.value = ''
    return
  }
  const maxBytes = 2 * 1024 * 1024
  if (file.size > maxBytes) {
    useToast().add({
      title: 'File too large',
      description: 'Image must be 2MB or less.',
      color: 'warning',
    })
    input.value = ''
    return
  }
  const reader = new FileReader()
  reader.onload = () => {
    const result = reader.result as string
    bannerPreview.value = result
  }
  reader.readAsDataURL(file)
  bannerFile.value = file
}

function duplicateEvent() {
  if (!event.value) return
  useToast().add({
    title: 'Event duplicated',
    description: `Duplicated "${event.value.title}"`,
    color: 'success',
  })
}
function shareEvent() {
  if (!event.value) return
  useToast().add({
    title: 'Share',
    description: `Share "${event.value.title}"`,
    color: 'info',
  })
}
function exportEvent() {
  if (!event.value) return
  useToast().add({ title: 'Export started', description: 'Exporting event data...', color: 'info' })
}
// Function to update submission status
async function changeSubmissionStatus(
  submissionId: string,
  newStatus: AbstractSubmission['status']
) {
  try {
    await submissions.updateSubmission(submissionId, { status: newStatus })
    await refreshEvent(event.value?.id || '')
    useToast().add({
      title: 'Submission updated',
      description: `Submission status changed to ${newStatus}`,
      color: 'success',
    })
  } catch (error) {
    console.error('Error updating submission status:', error)
    useToast().add({
      title: 'Error',
      description: 'Failed to update submission status',
      color: 'error',
    })
  }
}

function cancelEvent() {
  if (!event.value) return
  useToast().add({
    title: 'Event cancelled',
    description: 'The event has been cancelled',
    color: 'warning',
  })
}

async function handleDeleteEvent() {
  if (!event.value) return

  try {
    await deleteEvent(event.value.id)
    useToast().add({
      title: 'Event deleted',
      description: `Deleted "${event.value.title}"`,
      color: 'success',
    })
    navigateTo('/admin/events')
  } catch (error) {
    console.error('Error deleting event:', error)
    useToast().add({
      title: 'Error',
      description: 'Failed to delete event',
      color: 'error',
    })
  }
}

// Tickets management
type EventTicket = {
  id: number
  name: string
  price: number
  quantity: number
  salesStart?: string
  salesEnd?: string
  description?: string
  isPublic: boolean
}

// Tickets management is now handled in the TicketsTab component
const _tickets = computed<EventTicket[]>(() => {
  type EventWithTickets = EventItem & { tickets?: EventTicket[] }
  const e = event.value as EventWithTickets | undefined
  if (!e) return []
  if (!Array.isArray(e.tickets)) e.tickets = []
  return e.tickets as EventTicket[]
})

const newTicket = reactive<{
  name: string
  price: string | number
  quantity: string | number
  salesStart: string
  salesEnd: string
  description: string
  isPublic: boolean
}>({
  name: '',
  price: '',
  quantity: '',
  salesStart: '',
  salesEnd: '',
  description: '',
  isPublic: true,
})

const canAddTicket = computed(
  () => !!newTicket.name && Number(newTicket.price) >= 0 && Number(newTicket.quantity) >= 0
)

// Ticket management functions are now handled in the TicketsTab component
function _addTicket() {
  if (!event.value || !canAddTicket.value) return
  const t: EventTicket = {
    id: Date.now(),
    name: newTicket.name.trim(),
    price: Number(newTicket.price) || 0,
    quantity: Number(newTicket.quantity) || 0,
    salesStart: newTicket.salesStart || undefined,
    salesEnd: newTicket.salesEnd || undefined,
    description: newTicket.description?.trim() || undefined,
    isPublic: !!newTicket.isPublic,
  }
  ;(event.value as EventItem & { tickets?: EventTicket[] }).tickets!.push(t)
  Object.assign(newTicket, {
    name: '',
    price: '',
    quantity: '',
    salesStart: '',
    salesEnd: '',
    description: '',
    isPublic: true,
  })
  useToast().add({ title: 'Ticket added', color: 'success' })
}

function _removeTicket(id: number) {
  if (!event.value) return
  const e = event.value as EventItem & { tickets?: EventTicket[] }
  if (!Array.isArray(e.tickets)) return
  e.tickets = (e.tickets as EventTicket[]).filter((t: EventTicket) => t.id !== id)
  useToast().add({ title: 'Ticket removed', color: 'neutral' })
}

// Track if component is mounted to prevent updates after unmount
const isMounted = ref(true)
onUnmounted(() => {
  isMounted.value = false
})

async function switchTab(tab: string) {
  // Skip if no tab specified or component is unmounting
  if (!tab || !isMounted.value) return

  try {
    // Close any open dropdowns/menus first
    const active = document.activeElement as HTMLElement | null
    active?.blur?.()
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))

    // Allow UI to update before switching tabs
    await nextTick()

    // Check again after tick in case component started unmounting
    if (!isMounted.value) return

    // Schedule the tab switch in the next frame
    requestAnimationFrame(() => {
      if (!isMounted.value) return
      currentTab.value = tab as typeof currentTab.value
    })
  } catch (error) {
    console.error('Error switching tabs:', error)
  }
}

// Sponsors management is now handled in the SponsorsTab component
const _sponsorTierOptions = [
  { label: 'Platinum', value: 'platinum' },
  { label: 'Gold', value: 'gold' },
  { label: 'Silver', value: 'silver' },
  { label: 'Bronze', value: 'bronze' },
  { label: 'Partner', value: 'partner' },
]
const newSponsor = reactive<{ name: string; tier?: string; logoUrl: string; website?: string }>({
  name: '',
  tier: undefined,
  logoUrl: '',
  website: '',
})
function _addSponsor() {
  if (!event.value) return
  if (!event.value.sponsors) event.value.sponsors = []
  const sponsor = {
    id: Date.now(),
    name: newSponsor.name.trim(),
    tier: newSponsor.tier,
    logoUrl: newSponsor.logoUrl.trim(),
    website: newSponsor.website?.trim() || undefined,
  }
  if (!sponsor.name || !sponsor.logoUrl) return
  event.value.sponsors.push(sponsor)
  Object.assign(newSponsor, { name: '', tier: undefined, logoUrl: '', website: '' })
  useToast().add({ title: 'Sponsor added', color: 'success' })
}
function _removeSponsor(sponsorId: number) {
  if (!event.value?.sponsors) return
  event.value.sponsors = event.value.sponsors.filter((s: { id: number }) => s.id !== sponsorId)
  useToast().add({ title: 'Sponsor removed', color: 'neutral' })
}

// Gallery management is now handled in the GalleryTab component
const _mediaTypeOptions = [
  { label: 'Image', value: 'image' },
  { label: 'Video', value: 'video' },
]
const newMedia = reactive<{ url: string; caption?: string; type: 'image' | 'video' }>({
  url: '',
  caption: '',
  type: 'image',
})
function _addMedia() {
  if (!event.value) return
  if (!event.value.gallery) event.value.gallery = []
  const media = {
    id: Date.now(),
    url: newMedia.url.trim(),
    caption: newMedia.caption?.trim() || undefined,
    type: newMedia.type,
  }
  if (!media.url) return
  event.value.gallery.push(media)
  Object.assign(newMedia, { url: '', caption: '', type: 'image' })
  useToast().add({ title: 'Media added', color: 'success' })
}
function _removeMedia(mediaId: number) {
  if (!event.value?.gallery) return
  event.value.gallery = event.value.gallery.filter((m: { id: number }) => m.id !== mediaId)
  useToast().add({ title: 'Media removed', color: 'neutral' })
}

// Registrations (inline) - mock data & helpers
type RegistrationRow = {
  id: string
  name: string
  email: string
  event: string
  eventDate: string
  type: string
  date: string
  amount: number
  status: string
  reference: string
}

const regSearch = ref('')
const regPagination = ref({
  currentPage: 1,
  perPage: 5,
  total: 0,
  get from() {
    return this.total === 0 ? 0 : (this.currentPage - 1) * this.perPage + 1
  },
  get to() {
    return Math.min(this.currentPage * this.perPage, this.total)
  },
})

const allRegistrations = ref<RegistrationRow[]>([
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    event: 'Annual Conference 2024',
    eventDate: '2024-11-15',
    type: 'Member',
    date: '2023-08-15',
    amount: 50000,
    status: 'Paid',
    reference: 'TX123456789',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    event: 'Workshop on Data Analysis',
    eventDate: '2024-10-15',
    type: 'Non-Member',
    date: '2023-08-14',
    amount: 75000,
    status: 'Pending',
    reference: 'PS987654321',
  },
  {
    id: '3',
    name: 'Dr. Michael Brown',
    email: 'michael.brown@example.com',
    event: 'Public Health Forum',
    eventDate: '2024-09-20',
    type: 'Student',
    date: '2023-08-13',
    amount: 15000,
    status: 'Paid',
    reference: 'TX987654321',
  },
  {
    id: '4',
    name: 'Dr. Sarah Johnson',
    email: 'sarah.j@example.com',
    event: 'Annual Conference 2024',
    eventDate: '2024-11-15',
    type: 'Member',
    date: '2023-08-12',
    amount: 50000,
    status: 'Paid',
    reference: 'PS123456789',
  },
  {
    id: '5',
    name: 'Dr. David Wilson',
    email: 'david.w@example.com',
    event: 'Workshop on Data Analysis',
    eventDate: '2024-10-15',
    type: 'Non-Member',
    date: '2023-08-11',
    amount: 75000,
    status: 'Pending',
    reference: 'TX456789123',
  },
  {
    id: '6',
    name: 'Dr. Emily Davis',
    email: 'emily.d@example.com',
    event: 'Public Health Forum',
    eventDate: '2024-09-20',
    type: 'Speaker',
    date: '2023-08-10',
    amount: 0,
    status: 'Paid',
    reference: 'N/A',
  },
  {
    id: '7',
    name: 'Dr. Robert Thompson',
    email: 'robert.t@example.com',
    event: 'Annual Conference 2024',
    eventDate: '2024-11-15',
    type: 'Sponsor',
    date: '2023-08-09',
    amount: 150000,
    status: 'Paid',
    reference: 'TX789123456',
  },
  {
    id: '8',
    name: 'Dr. Jennifer Lee',
    email: 'jennifer.l@example.com',
    event: 'Workshop on Data Analysis',
    eventDate: '2024-10-15',
    type: 'Member',
    date: '2023-08-08',
    amount: 50000,
    status: 'Cancelled',
    reference: 'PS456789123',
  },
  {
    id: '9',
    name: 'Dr. James Wilson',
    email: 'james.w@example.com',
    event: 'Public Health Forum',
    eventDate: '2024-09-20',
    type: 'Non-Member',
    date: '2023-08-07',
    amount: 75000,
    status: 'Paid',
    reference: 'TX321654987',
  },
  {
    id: '10',
    name: 'Dr. Patricia Brown',
    email: 'patricia.b@example.com',
    event: 'Annual Conference 2024',
    eventDate: '2024-11-15',
    type: 'Student',
    date: '2023-08-06',
    amount: 15000,
    status: 'Paid',
    reference: 'PS789123456',
  },
])

const filteredEventRegistrations = computed(() => {
  const rows = allRegistrations.value.filter(r => r.event === (event.value?.title || ''))
  if (!regSearch.value) return rows
  const q = regSearch.value.toLowerCase()
  return rows.filter(
    r =>
      r.name.toLowerCase().includes(q) ||
      r.email.toLowerCase().includes(q) ||
      r.reference.toLowerCase().includes(q)
  )
})

const _paginatedEventRegistrations = computed(() => {
  const start = (regPagination.value.currentPage - 1) * regPagination.value.perPage
  const end = start + regPagination.value.perPage
  return filteredEventRegistrations.value.slice(start, end)
})

watch(
  filteredEventRegistrations,
  rows => {
    regPagination.value.total = rows.length
    // Reset to first page if the current one is now out of range
    if ((regPagination.value.currentPage - 1) * regPagination.value.perPage >= rows.length) {
      regPagination.value.currentPage = 1
    }
  },
  { immediate: true }
)

function _formatDate(dateString: string): string {
  if (!dateString) return ''
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' }
  return new Date(dateString).toLocaleDateString('en-US', options)
}

function _getStatusBadgeClass(status: string): string {
  const statusClasses: Record<string, string> = {
    Paid: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    Pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    Cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    Refunded: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  }
  return statusClasses[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
}

function _getTypeBadgeClass(type: string): string {
  const typeClasses: Record<string, string> = {
    Member: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    'Non-Member': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    Student: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    Speaker: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    Sponsor: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
  }
  return typeClasses[type] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
}

function _getRegActionItems(reg: RegistrationRow) {
  return [
    [{ label: 'View Details', icon: 'i-heroicons-eye', to: `/admin/registrations/${reg.id}` }],
    [
      {
        label: 'Send Confirmation',
        icon: 'i-heroicons-envelope',
        click: () => useToast().add({ title: 'Confirmation Sent', color: 'success' }),
      },
    ],
  ]
}

// Submissions management
const _submissionSearch = ref('')
const _submissionStatusFilter = ref('')
const _submissionCategoryFilter = ref('')

// Paginated response type is now defined in the API types

// Get submissions for the current event
const { data: submissionsData } = useAsyncData<AbstractSubmission[]>(
  `event-${id.value}-submissions`,
  async (): Promise<AbstractSubmission[]> => {
    try {
      const { data } = await submissions.getSubmissions({ q: `eventId:${id.value}` })

      if (!data.value) {
        return []
      }

      // Handle both direct array and paginated response
      if (Array.isArray(data.value)) {
        return data.value
      }

      // Handle paginated response
      if ('data' in data.value && Array.isArray(data.value.data)) {
        return data.value.data
      }

      return []
    } catch (error) {
      console.error('Error fetching submissions:', error)
      return []
    }
  },
  { watch: [id] }
)

const eventSubmissions = computed<AbstractSubmission[]>(() => {
  return submissionsData.value || []
})

const _submissionStatusOptions = [
  { label: 'All Status', value: '' },
  { label: 'Pending', value: 'pending' },
  { label: 'Under Review', value: 'under_review' },
  { label: 'Accepted', value: 'accepted' },
  { label: 'Rejected', value: 'rejected' },
  { label: 'Revision Required', value: 'revision_required' },
]

const _submissionCategoryOptions = [
  { label: 'All Categories', value: '' },
  { label: 'Oral Presentation', value: 'oral' },
  { label: 'Poster Presentation', value: 'poster' },
  { label: 'Workshop Proposal', value: 'workshop' },
]

const _filteredSubmissions = computed<AbstractSubmission[]>(() => {
  let filtered = eventSubmissions.value

  if (_submissionSearch.value) {
    const search = _submissionSearch.value.toLowerCase()
    filtered = filtered.filter(
      s =>
        s.title.toLowerCase().includes(search) ||
        s.authors.some(author => author.toLowerCase().includes(search)) ||
        s.keywords.some(keyword => keyword.toLowerCase().includes(search)) ||
        s.correspondingAuthor.name.toLowerCase().includes(search)
    )
  }

  if (_submissionStatusFilter.value) {
    filtered = filtered.filter(s => s.status === _submissionStatusFilter.value)
  }

  if (_submissionCategoryFilter.value) {
    filtered = filtered.filter(s => s.category === _submissionCategoryFilter.value)
  }

  return filtered
})

// Typed counters for status summaries
const _acceptedCount = computed<number>(
  () => eventSubmissions.value.filter((s: AbstractSubmission) => s.status === 'accepted').length
)
const _underReviewCount = computed<number>(
  () => eventSubmissions.value.filter((s: AbstractSubmission) => s.status === 'under_review').length
)
const _pendingCount = computed<number>(
  () => eventSubmissions.value.filter((s: AbstractSubmission) => s.status === 'pending').length
)
const _rejectedCount = computed<number>(
  () => eventSubmissions.value.filter((s: AbstractSubmission) => s.status === 'rejected').length
)

type BadgeColor = 'neutral' | 'success' | 'primary' | 'secondary' | 'info' | 'warning' | 'error'
function _getSubmissionStatusColor(status: AbstractSubmission['status']): BadgeColor {
  const colors: Record<AbstractSubmission['status'], BadgeColor> = {
    pending: 'secondary',
    under_review: 'warning',
    accepted: 'success',
    rejected: 'error',
    revision_required: 'info',
  }
  return colors[status] ?? 'neutral'
}

interface SubmissionAction {
  label: string
  icon: string
  click: () => void
  color?: string
}

type _SubmissionActionGroup = SubmissionAction[][]

function _viewSubmission(submission: AbstractSubmission) {
  // For now, just show a toast. In a real app, this would open a detailed modal
  useToast().add({
    title: 'View Submission',
    description: `Opening details for "${submission.title}"`,
    color: 'info',
  })
}

function _getSubmissionActions(submission: AbstractSubmission) {
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
</script>
