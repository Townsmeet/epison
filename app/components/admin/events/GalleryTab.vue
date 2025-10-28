<template>
  <UCard>
    <template #header>
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <h3 class="text-lg font-semibold">Gallery</h3>
          <UIcon
            v-if="isSyncing"
            name="i-heroicons-arrow-path"
            class="w-4 h-4 animate-spin text-gray-400"
          />
        </div>
        <UBadge v-if="gallery.length" color="neutral" variant="subtle">
          {{ gallery.length }} items
        </UBadge>
      </div>
    </template>
    <div class="space-y-6">
      <!-- Loading State -->
      <div v-if="mediaLoading" class="flex justify-center py-8">
        <UIcon name="i-heroicons-arrow-path" class="w-6 h-6 animate-spin" />
      </div>
      <div v-else-if="gallery.length" class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="m in gallery"
          :key="m.id"
          class="group relative overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700"
        >
          <img
            v-if="m.type !== 'video'"
            :src="m.url"
            :alt="m.caption || 'Media'"
            class="w-full h-40 object-cover"
          />
          <div class="p-2 text-sm flex items-center justify-between">
            <p class="truncate">{{ m.caption || '—' }}</p>
            <UButton
              size="xs"
              color="error"
              variant="ghost"
              icon="i-heroicons-trash"
              @click="removeMedia(m.id)"
            />
          </div>
        </div>
      </div>

      <div class="border-t border-gray-200 dark:border-gray-700 pt-4">
        <h4 class="text-sm font-semibold mb-3">Add Media</h4>
        <div class="space-y-4">
          <!-- File Preview -->
          <div v-if="newMedia.previewUrl" class="relative group">
            <div
              class="relative aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden"
            >
              <img
                v-if="newMedia.type === 'image'"
                :src="newMedia.previewUrl"
                :alt="newMedia.caption || 'Preview'"
                class="w-full h-full object-contain"
              />
              <video
                v-else
                :src="newMedia.previewUrl"
                class="w-full h-full object-contain"
                controls
              />
              <button
                class="absolute top-2 right-2 p-1.5 bg-white/80 dark:bg-gray-900/80 rounded-full shadow hover:bg-white dark:hover:bg-gray-800 transition-colors"
                title="Remove file"
                @click="resetForm"
              >
                <UIcon name="i-heroicons-x-mark" class="w-4 h-4" />
              </button>
            </div>
            <p class="mt-1 text-xs text-gray-500 dark:text-gray-400 truncate">
              {{ newMedia.file?.name }}
            </p>
          </div>

          <!-- Upload Form -->
          <div class="grid md:grid-cols-3 gap-3">
            <div class="md:col-span-3">
              <UInput
                ref="fileInput"
                type="file"
                accept="image/*,video/*"
                :disabled="!!newMedia.previewUrl"
                class="file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100 dark:file:bg-gray-700 dark:file:text-primary-300 dark:hover:file:bg-gray-600"
                @change="handleFileUpload"
              />
              <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Upload an image or video file (max 10MB)
              </p>
            </div>

            <UInput
              v-model="newMedia.caption"
              placeholder="Caption (optional)"
              :disabled="!newMedia.previewUrl"
            />
          </div>

          <div class="flex justify-end gap-2">
            <UButton v-if="newMedia.previewUrl" color="neutral" variant="ghost" @click="resetForm">
              Cancel
            </UButton>
            <UButton
              :disabled="!newMedia.previewUrl"
              icon="i-heroicons-plus"
              :loading="isUploading"
              @click="addMedia"
            >
              Add to Gallery
            </UButton>
          </div>
        </div>
      </div>
    </div>
  </UCard>
</template>

<script setup lang="ts">
import type { EventItem } from '../../../composables/useEvents'
import type { EventMedia } from '../../../../types/event'

const props = defineProps<{ event: EventItem }>()

const emit = defineEmits<{
  'update:event': [event: EventItem]
  'media-added': [media: EventMedia]
  'media-removed': [id: string]
}>()

// Use the events API composable
const { getEventMedia, createEventMedia, deleteEventMedia, refreshEventMedia } = useEvents()

// Fetch media data from API
const { data: mediaResponse, pending: mediaLoading } = await getEventMedia(props.event.id)
const isSyncing = ref(false)
const gallery = computed(() => mediaResponse.value?.data || [])
const fileInput = ref<HTMLInputElement | null>(null)
const isUploading = ref(false)

// This is unused but keeping it in case it's needed in the future
// const mediaTypeOptions = [
//   { label: 'Image', value: 'image' },
//   { label: 'Video', value: 'video' },
// ]

const newMedia = reactive<{
  type: 'image' | 'video'
  url: string
  caption: string
  file: File | null
  previewUrl: string | null
}>({
  type: 'image',
  url: '',
  caption: '',
  file: null,
  previewUrl: null,
})

function handleFileUpload(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]

  if (!file) {
    useToast().add({
      title: 'No file selected',
      color: 'warning',
    })
    return
  }

  const fileType = file.type.split('/')[0] as 'image' | 'video' | undefined

  if (!fileType || !['image', 'video'].includes(fileType)) {
    useToast().add({
      title: 'Invalid file type',
      description: 'Please upload an image or video file',
      color: 'error',
    })
    return
  }

  // Clean up previous preview URL if it exists
  if (newMedia.previewUrl) {
    URL.revokeObjectURL(newMedia.previewUrl)
  }

  newMedia.file = file
  newMedia.type = fileType
  newMedia.previewUrl = URL.createObjectURL(file)
  newMedia.url = file.name // Use filename as initial URL (will be replaced with actual URL after upload)
}

async function addMedia() {
  if (!newMedia.file || !newMedia.previewUrl) {
    useToast().add({
      title: 'No file selected',
      description: 'Please select a file to upload',
      color: 'warning',
    })
    return
  }

  isUploading.value = true

  try {
    // Upload file to S3 first
    const formData = new FormData()
    formData.append('file', newMedia.file, newMedia.file.name)
    formData.append('folder', 'events/gallery')
    formData.append(
      'key',
      `${props.event.slug || props.event.id}-${Date.now()}-${newMedia.file.name}`
    )

    const uploadResponse = await $fetch<{
      url: string
      key: string
      contentType: string
      size: number
      filename: string
    }>('/api/uploads', {
      method: 'POST',
      body: formData,
    })

    // Use the uploaded S3 URL
    const fileUrl = uploadResponse.url

    const mediaData = {
      type: newMedia.type,
      url: fileUrl,
      caption: newMedia.caption.trim() || undefined,
    }

    // Create media via API
    const createdMedia = await createEventMedia(props.event.id, mediaData)

    // Optimistically update local list
    if (mediaResponse.value) {
      const current = Array.isArray(mediaResponse.value.data) ? mediaResponse.value.data : []
      mediaResponse.value.data = [createdMedia as unknown as EventMedia, ...current]
    }

    // Refresh media data from API (ensure consistency)
    isSyncing.value = true
    await refreshEventMedia(props.event.id)
    // Additionally force Nuxt to refresh this key in case cookie-based trigger isn't immediate
    if (typeof refreshNuxtData === 'function') {
      await refreshNuxtData(`event-media-${props.event.id}`)
    }
    isSyncing.value = false

    // Emit the media added event
    emit('media-added', createdMedia)

    useToast().add({
      title: 'Media added',
      description: 'Your media has been added to the gallery',
      color: 'success',
    })

    resetForm()
  } catch (error) {
    console.error('Error adding media:', error)

    let errorMessage = 'An error occurred while adding media'

    if (error instanceof Error) {
      errorMessage = error.message
    } else if (typeof error === 'object' && error && 'data' in error) {
      const errorData = error.data as { statusMessage?: string; message?: string }
      if (errorData?.statusMessage) {
        errorMessage = errorData.statusMessage
      } else if (errorData?.message) {
        errorMessage = errorData.message
      }
    }

    useToast().add({
      title: 'Upload failed',
      description: errorMessage,
      color: 'error',
      icon: 'i-heroicons-exclamation-triangle',
    })
  } finally {
    isUploading.value = false
  }
}

async function removeMedia(id: string) {
  try {
    // Revoke object URL if it's a local file
    const media = gallery.value.find(m => m.id === id)
    if (media?.url?.startsWith('blob:')) {
      URL.revokeObjectURL(media.url)
    }

    await deleteEventMedia(props.event.id, id)
    // Optimistically remove from local list
    if (mediaResponse.value && Array.isArray(mediaResponse.value.data)) {
      mediaResponse.value.data = mediaResponse.value.data.filter(m => String(m.id) !== String(id))
    }
    isSyncing.value = true
    await refreshEventMedia(props.event.id)
    isSyncing.value = false

    emit('media-removed', id)
    useToast().add({ title: 'Media removed', color: 'success' })
  } catch (error) {
    console.error('Error removing media:', error)
    useToast().add({ title: 'Error removing media', color: 'error' })
  }
}

function resetForm() {
  // Clean up blob URL to prevent memory leaks
  if (newMedia.previewUrl) {
    URL.revokeObjectURL(newMedia.previewUrl)
  }

  newMedia.type = 'image'
  newMedia.url = ''
  newMedia.caption = ''
  newMedia.file = null
  newMedia.previewUrl = null

  // Reset file input
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

// Cleanup on component unmount
onUnmounted(() => {
  if (newMedia.previewUrl) {
    URL.revokeObjectURL(newMedia.previewUrl)
  }
})
</script>
