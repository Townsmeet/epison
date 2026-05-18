<template>
  <UCard>
    <template #header>
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <h3 class="text-lg font-semibold">Speakers</h3>
          <UIcon
            v-if="isSyncing"
            name="i-heroicons-arrow-path"
            class="w-4 h-4 animate-spin text-gray-400"
          />
        </div>
        <UBadge v-if="speakers.length" color="neutral" variant="subtle">
          {{ speakers.length }} total
        </UBadge>
      </div>
    </template>

    <div class="space-y-6">
      <!-- Loading State -->
      <div v-if="speakersLoading" class="flex justify-center py-8">
        <UIcon name="i-heroicons-arrow-path" class="w-6 h-6 animate-spin" />
      </div>

      <div v-else-if="speakers.length" class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="s in speakers"
          :key="s.id"
          class="flex items-start gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700"
        >
          <img
            v-if="s.photoUrl"
            :src="s.photoUrl"
            :alt="s.name"
            class="w-16 h-16 object-cover bg-white rounded-full shrink-0"
          />
          <div
            v-else
            class="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center shrink-0"
          >
            <UIcon name="i-heroicons-user" class="w-8 h-8 text-gray-400" />
          </div>
          <div class="min-w-0 flex-1">
            <div class="flex items-center justify-between">
              <p class="font-medium truncate" :title="s.name">{{ s.name }}</p>
              <div class="flex items-center gap-1">
                <UButton
                  size="xs"
                  color="neutral"
                  variant="ghost"
                  icon="i-heroicons-pencil"
                  @click="openEditModal(s)"
                />
                <UButton
                  size="xs"
                  color="error"
                  variant="ghost"
                  icon="i-heroicons-trash"
                  @click="removeSpeaker(s.id)"
                />
              </div>
            </div>
            <p
              v-if="s.title"
              class="text-xs text-gray-600 dark:text-gray-400 truncate"
              :title="s.title"
            >
              {{ s.title }}
            </p>
            <p
              v-if="s.org"
              class="text-xs text-primary-600 dark:text-primary-400 truncate"
              :title="s.org"
            >
              {{ s.org }}
            </p>
          </div>
        </div>
      </div>

      <div class="border-t border-gray-200 dark:border-gray-700 pt-4">
        <h4 class="text-sm font-semibold mb-3">Add Speaker</h4>
        <div class="grid md:grid-cols-2 gap-3">
          <UInput v-model="newSpeaker.name" placeholder="Speaker name" required />
          <UInput v-model="newSpeaker.title" placeholder="Job Title / Position (optional)" />
          <UInput v-model="newSpeaker.org" placeholder="Organization (optional)" />

          <div>
            <label class="text-xs text-gray-600 dark:text-gray-300 mb-1 block"
              >Photo (upload image)</label
            >
            <input
              type="file"
              accept="image/*"
              class="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 dark:file:bg-gray-700 dark:file:text-gray-200"
              @change="onPhotoSelected"
            />
            <div v-if="photoPreview" class="mt-2">
              <img
                :src="photoPreview"
                alt="Photo preview"
                class="h-16 w-16 object-cover bg-white rounded-full border border-gray-200 dark:border-gray-700"
              />
            </div>
          </div>
          <div class="md:col-span-2">
            <UTextarea v-model="newSpeaker.bio" placeholder="Speaker Bio (optional)" :rows="3" />
          </div>
        </div>
        <div class="mt-3 flex justify-end">
          <UButton
            :disabled="!newSpeaker.name"
            :loading="isCreating"
            icon="i-heroicons-plus"
            @click="addSpeaker"
          >
            Add Speaker
          </UButton>
        </div>
      </div>
    </div>
  </UCard>

  <!-- Edit Speaker Modal -->
  <UModal v-model:open="showEditModal">
    <template #content>
      <UCard :ui="{ divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
              Edit Speaker
            </h3>
            <UButton
              color="neutral"
              variant="ghost"
              icon="i-heroicons-x-mark"
              @click="showEditModal = false"
            />
          </div>
        </template>

        <div class="space-y-4">
          <UInput v-model="editingSpeaker.name" placeholder="Speaker name" required />
          <UInput v-model="editingSpeaker.title" placeholder="Job Title / Position (optional)" />
          <UInput v-model="editingSpeaker.org" placeholder="Organization (optional)" />

          <div>
            <label class="text-xs text-gray-600 dark:text-gray-300 mb-1 block"
              >Photo (upload new image to replace)</label
            >
            <input
              type="file"
              accept="image/*"
              class="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 dark:file:bg-gray-700 dark:file:text-gray-200"
              @change="onEditPhotoSelected"
            />
            <div v-if="editPhotoPreview || editingSpeaker.photoUrl" class="mt-2">
              <img
                :src="editPhotoPreview || editingSpeaker.photoUrl"
                alt="Photo preview"
                class="h-16 w-16 object-cover bg-white rounded-full border border-gray-200 dark:border-gray-700"
              />
            </div>
          </div>
          <UTextarea v-model="editingSpeaker.bio" placeholder="Speaker Bio (optional)" :rows="3" />
        </div>

        <template #footer>
          <div class="flex justify-end gap-2">
            <UButton color="neutral" variant="ghost" @click="showEditModal = false">Cancel</UButton>
            <UButton
              color="primary"
              :loading="isUpdating"
              :disabled="!editingSpeaker.name"
              @click="updateSpeaker"
              >Save Changes</UButton
            >
          </div>
        </template>
      </UCard>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import type { EventItem } from '../../../composables/useEvents'
import type { EventSpeaker } from '../../../../types/event'

const props = defineProps<{ event: EventItem }>()

const emit = defineEmits<{
  'update:event': [event: EventItem]
  'speaker-added': [speaker: EventSpeaker]
  'speaker-removed': [id: string]
}>()

// Use the events API composable
const {
  getEventSpeakers,
  createEventSpeaker,
  updateEventSpeaker,
  deleteEventSpeaker,
  refreshEventSpeakers,
} = useEvents()

// Fetch speakers data from API
const { data: speakersResponse, pending: speakersLoading } = await getEventSpeakers(props.event.id)
const isSyncing = ref(false)
const speakers = computed(() => speakersResponse.value?.data || [])

const newSpeaker = reactive<{ name: string; title?: string; org?: string; bio?: string }>({
  name: '',
  title: '',
  org: '',
  bio: '',
})

const photoFile = ref<File | null>(null)
const photoPreview = ref<string | null>(null)

const showEditModal = ref(false)
const isUpdating = ref(false)
const editPhotoFile = ref<File | null>(null)
const editPhotoPreview = ref<string | null>(null)

const editingSpeaker = reactive<{
  id: string
  name: string
  title?: string
  org?: string
  bio?: string
  photoUrl?: string
}>({
  id: '',
  name: '',
  title: '',
  org: '',
  bio: '',
  photoUrl: '',
})

function openEditModal(speaker: EventSpeaker) {
  Object.assign(editingSpeaker, {
    id: speaker.id,
    name: speaker.name,
    title: speaker.title || '',
    org: speaker.org || '',
    bio: speaker.bio || '',
    photoUrl: speaker.photoUrl || '',
  })
  editPhotoFile.value = null
  editPhotoPreview.value = null
  showEditModal.value = true
}

function onEditPhotoSelected(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) {
    editPhotoFile.value = null
    editPhotoPreview.value = null
    return
  }
  editPhotoFile.value = file
  const url = URL.createObjectURL(file)
  editPhotoPreview.value = url
}

function onPhotoSelected(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) {
    photoFile.value = null
    photoPreview.value = null
    return
  }
  photoFile.value = file
  const url = URL.createObjectURL(file)
  photoPreview.value = url
}

const isCreating = ref(false)

function _slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}

async function addSpeaker() {
  if (!newSpeaker.name || isCreating.value) return

  isCreating.value = true
  try {
    let uploadedUrl = ''

    // Upload photo to S3 via uploads endpoint if a file is selected
    if (photoFile.value) {
      const file = photoFile.value
      const ext = file.name.includes('.') ? file.name.slice(file.name.lastIndexOf('.')) : ''
      const base = props.event.slug || _slugify(props.event.title)
      const key = `speaker-${base}-${Date.now()}${ext}`
      const form = new FormData()
      form.append('file', file)
      form.append('folder', 'events/speakers')
      form.append('key', key)

      try {
        const uploadResp = await $fetch<{ url: string }>(`/api/uploads`, {
          method: 'POST',
          body: form,
          credentials: 'include',
        })
        uploadedUrl = uploadResp.url
      } catch (err) {
        console.error('Speaker photo upload failed:', err)
        useToast().add({
          title: 'Upload failed',
          description: 'Could not upload speaker photo. Please try again.',
          color: 'error',
        })
        throw err
      }
    }

    const speakerData = {
      name: newSpeaker.name.trim(),
      title: newSpeaker.title?.trim() || undefined,
      org: newSpeaker.org?.trim() || undefined,
      bio: newSpeaker.bio?.trim() || undefined,
      photoUrl: uploadedUrl || undefined,
    }

    if (!speakerData.name) return

    // Create speaker via API
    const createdSpeaker = await createEventSpeaker(props.event.id, speakerData)

    // Optimistically update local list
    if (speakersResponse.value) {
      const current = Array.isArray(speakersResponse.value.data) ? speakersResponse.value.data : []
      speakersResponse.value.data = [...current, createdSpeaker as unknown as EventSpeaker]
    }

    // Refresh speakers data from API (ensure consistency)
    isSyncing.value = true
    await refreshEventSpeakers(props.event.id)
    if (typeof refreshNuxtData === 'function') {
      await refreshNuxtData(`event-speakers-${props.event.id}`)
    }
    isSyncing.value = false

    // Emit events
    emit('speaker-added', createdSpeaker)

    // Reset form
    Object.assign(newSpeaker, { name: '', title: '', org: '', bio: '' })
    photoFile.value = null
    photoPreview.value = null
    // Also reset file input visually if possible (a bit hacky in Vue without ref on input, but fine for now)

    useToast().add({ title: 'Speaker added', color: 'success' })
  } catch (error) {
    console.error('Error adding speaker:', error)
    useToast().add({ title: 'Error adding speaker', color: 'error' })
  } finally {
    isCreating.value = false
  }
}

async function removeSpeaker(id: string) {
  try {
    await deleteEventSpeaker(props.event.id, id)
    // Optimistically remove from local list
    if (speakersResponse.value && Array.isArray(speakersResponse.value.data)) {
      speakersResponse.value.data = speakersResponse.value.data.filter(
        s => String(s.id) !== String(id)
      )
    }
    isSyncing.value = true
    await refreshEventSpeakers(props.event.id)
    if (typeof refreshNuxtData === 'function') {
      await refreshNuxtData(`event-speakers-${props.event.id}`)
    }
    isSyncing.value = false
    emit('speaker-removed', id)
    useToast().add({ title: 'Speaker removed', color: 'success' })
  } catch (error) {
    console.error('Error removing speaker:', error)
    useToast().add({ title: 'Error removing speaker', color: 'error' })
  }
}

async function updateSpeaker() {
  if (!editingSpeaker.name || !editingSpeaker.id || isUpdating.value) return

  isUpdating.value = true
  try {
    let uploadedUrl = editingSpeaker.photoUrl

    // Upload photo to S3 via uploads endpoint if a new file is selected
    if (editPhotoFile.value) {
      const file = editPhotoFile.value
      const ext = file.name.includes('.') ? file.name.slice(file.name.lastIndexOf('.')) : ''
      const base = props.event.slug || _slugify(props.event.title)
      const key = `speaker-${base}-${Date.now()}${ext}`
      const form = new FormData()
      form.append('file', file)
      form.append('folder', 'events/speakers')
      form.append('key', key)

      try {
        const uploadResp = await $fetch<{ url: string }>(`/api/uploads`, {
          method: 'POST',
          body: form,
          credentials: 'include',
        })
        uploadedUrl = uploadResp.url
      } catch (err) {
        console.error('Speaker photo upload failed:', err)
        useToast().add({
          title: 'Upload failed',
          description: 'Could not upload speaker photo. Please try again.',
          color: 'error',
        })
        throw err
      }
    }

    const speakerData = {
      name: editingSpeaker.name.trim(),
      title: editingSpeaker.title?.trim() || undefined,
      org: editingSpeaker.org?.trim() || undefined,
      bio: editingSpeaker.bio?.trim() || undefined,
      photoUrl: uploadedUrl || undefined,
    }

    // Update speaker via API
    const updatedSpeaker = await updateEventSpeaker(props.event.id, editingSpeaker.id, speakerData)

    // Optimistically update local list
    if (speakersResponse.value && Array.isArray(speakersResponse.value.data)) {
      const index = speakersResponse.value.data.findIndex(s => s.id === editingSpeaker.id)
      if (index !== -1) {
        speakersResponse.value.data[index] = updatedSpeaker as unknown as EventSpeaker
      }
    }

    // Refresh speakers data from API (ensure consistency)
    isSyncing.value = true
    await refreshEventSpeakers(props.event.id)
    if (typeof refreshNuxtData === 'function') {
      await refreshNuxtData(`event-speakers-${props.event.id}`)
    }
    isSyncing.value = false

    showEditModal.value = false
    useToast().add({ title: 'Speaker updated', color: 'success' })
  } catch (error) {
    console.error('Error updating speaker:', error)
    useToast().add({ title: 'Error updating speaker', color: 'error' })
  } finally {
    isUpdating.value = false
  }
}
</script>
