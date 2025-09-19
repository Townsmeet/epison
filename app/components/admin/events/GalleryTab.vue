<template>
  <UCard>
    <template #header>
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-semibold">Gallery</h3>
        <UBadge v-if="event.gallery?.length" color="neutral" variant="subtle">
          {{ event.gallery.length }} items
        </UBadge>
      </div>
    </template>
    <div class="space-y-6">
      <div
        v-if="event.gallery && event.gallery.length"
        class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        <div
          v-for="m in event.gallery"
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

const props = defineProps<{ event: EventItem }>()
type MediaItem = {
  id: number
  type: 'image' | 'video'
  url: string
  caption?: string
}

const emit = defineEmits<{
  'update:event': [event: EventItem]
  'media-added': [media: MediaItem]
  'media-removed': [id: number]
}>()
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

  // Emit an event to update the parent with an empty gallery if it doesn't exist
  if (!props.event.gallery) {
    emit('update:event', {
      ...props.event,
      gallery: [],
    })
  }

  isUploading.value = true

  try {
    // In a real app, you would upload the file to your server here
    // Example:
    // const formData = new FormData()
    // formData.append('file', newMedia.file)
    // formData.append('type', newMedia.type)
    // formData.append('caption', newMedia.caption)
    //
    // const { data } = await useFetch('/api/upload', {
    //   method: 'POST',
    //   body: formData
    // })

    // For demo purposes, we'll use the object URL
    // In production, you should use the URL returned from your server
    const fileUrl = newMedia.previewUrl

    const media = {
      id: Date.now(),
      type: newMedia.type,
      url: fileUrl,
      caption: newMedia.caption.trim() || undefined,
      // Add any additional metadata from the upload response
      // ...data.value
    }

    // Emit the media added event
    emit('media-added', media)
    emit('update:event', {
      ...props.event,
      gallery: [media, ...(props.event.gallery || [])],
    })

    useToast().add({
      title: 'Media added',
      description: 'Your media has been added to the gallery',
      color: 'success',
    })

    resetForm()
  } catch (error) {
    console.error('Error uploading file:', error)

    useToast().add({
      title: 'Upload failed',
      description: error instanceof Error ? error.message : 'An error occurred while uploading',
      color: 'error',
      icon: 'i-heroicons-exclamation-triangle',
    })
  } finally {
    isUploading.value = false
  }
}

function removeMedia(id: number) {
  if (!Array.isArray(props.event.gallery)) return

  // Revoke object URL if it's a local file
  const media = props.event.gallery.find(m => m.id === id)
  if (media?.url?.startsWith('blob:')) {
    URL.revokeObjectURL(media.url)
  }

  // Emit the media removed event
  const updatedGallery = props.event.gallery.filter(m => m.id !== id)
  emit('media-removed', id)
  emit('update:event', {
    ...props.event,
    gallery: updatedGallery,
  })
  useToast().add({ title: 'Media removed', color: 'neutral' })
}

function resetForm() {
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
</script>
