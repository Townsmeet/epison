<template>
  <div class="space-y-6">
    <!-- Add Committee Member -->
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-base font-semibold">Committee Members</h3>
        </div>
      </template>
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <UFormField label="Name" required>
          <UInput v-model="newMember.name" placeholder="Full name" />
        </UFormField>
        <UFormField label="Role">
          <UInput v-model="newMember.role" placeholder="Chair, Secretary, Logistics..." />
        </UFormField>
        <UFormField label="Email">
          <UInput v-model="newMember.email" type="email" placeholder="name@example.com" />
        </UFormField>
        <UFormField label="Phone">
          <UInput v-model="newMember.phone" placeholder="+234 ..." />
        </UFormField>
        <div class="md:col-span-4">
          <label class="text-xs text-gray-600 dark:text-gray-300 mb-1 block"
            >Photo (optional)</label
          >
          <input
            type="file"
            accept="image/*"
            class="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 dark:file:bg-gray-700 dark:file:text-gray-200"
            @change="onNewPhotoSelected"
          />
          <div v-if="newPhotoPreview" class="mt-2">
            <img
              :src="newPhotoPreview"
              alt="Photo preview"
              class="h-16 w-16 object-cover rounded-full border border-gray-200 dark:border-gray-700"
            />
          </div>
        </div>
      </div>
      <div class="mt-4 flex justify-end">
        <UButton
          :disabled="!canAdd"
          :loading="isCreating"
          icon="i-heroicons-plus"
          @click="addMember"
          >Add Member</UButton
        >
      </div>
    </UCard>

    <!-- List -->
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <h3 class="text-base font-semibold">Current Committee</h3>
            <UIcon
              v-if="isSyncing"
              name="i-heroicons-arrow-path"
              class="w-4 h-4 animate-spin text-gray-400"
            />
          </div>
          <span class="text-sm text-gray-500">{{ list.length }} total</span>
        </div>
      </template>

      <!-- Loading State -->
      <div v-if="committeeLoading" class="flex justify-center py-8">
        <UIcon name="i-heroicons-arrow-path" class="w-6 h-6 animate-spin" />
      </div>

      <div v-else-if="list.length === 0" class="p-6 text-sm text-gray-500">
        No committee members yet.
      </div>

      <div v-else class="divide-y divide-gray-200 dark:divide-gray-700">
        <div
          v-for="m in list"
          :key="m.id"
          class="flex flex-col md:flex-row md:items-center justify-between gap-3 p-4"
        >
          <div class="flex items-center gap-3">
            <img
              v-if="m.photoUrl"
              :src="m.photoUrl"
              :alt="m.name"
              class="h-12 w-12 rounded-full object-cover border border-gray-200 dark:border-gray-700"
            />
            <div
              v-else
              class="h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center"
            >
              <UIcon name="i-heroicons-user" class="w-6 h-6 text-gray-400" />
            </div>
            <div>
              <div class="font-medium text-gray-900 dark:text-white">{{ m.name }}</div>
              <div class="text-sm text-gray-500 dark:text-gray-300 break-words">
                <span v-if="m.role">{{ m.role }}</span>
                <span v-if="m.role && (m.email || m.phone)" class="mx-2">•</span>
                <span v-if="m.email" class="break-all">{{ m.email }}</span>
                <span v-if="m.phone" class="ml-2 break-all">{{ m.phone }}</span>
              </div>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <UButton
              color="neutral"
              variant="outline"
              icon="i-heroicons-pencil"
              @click="startEdit(m)"
            >
              Edit
            </UButton>
            <UButton
              color="error"
              variant="ghost"
              icon="i-heroicons-trash"
              @click="removeMember(m.id)"
            >
              Remove
            </UButton>
          </div>
        </div>
      </div>
    </UCard>

    <!-- Edit Modal -->
    <UModal v-model:open="isEditing">
      <template #content>
        <UCard>
          <template #header>
            <div class="flex items-center justify-between">
              <h3 class="text-base font-semibold">Edit Committee Member</h3>
              <UButton
                color="neutral"
                variant="ghost"
                icon="i-heroicons-x-mark"
                @click="isEditing = false"
              />
            </div>
          </template>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <UFormField label="Name" required>
              <UInput v-model="editMember.name" />
            </UFormField>
            <UFormField label="Role">
              <UInput v-model="editMember.role" />
            </UFormField>
            <UFormField label="Email">
              <UInput v-model="editMember.email" type="email" />
            </UFormField>
            <UFormField label="Phone">
              <UInput v-model="editMember.phone" />
            </UFormField>
            <div class="md:col-span-2">
              <label class="text-xs text-gray-600 dark:text-gray-300 mb-1 block"
                >Photo (optional)</label
              >
              <div class="flex items-center gap-4">
                <div v-if="editPhotoPreview || editMember.photoUrl" class="relative">
                  <img
                    :src="editPhotoPreview || editMember.photoUrl"
                    alt="Member photo"
                    class="h-16 w-16 object-cover rounded-full border border-gray-200 dark:border-gray-700"
                  />
                  <button
                    v-if="editPhotoPreview || editMember.photoUrl"
                    type="button"
                    class="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600"
                    @click="removeEditPhoto"
                  >
                    <UIcon name="i-heroicons-x-mark" class="w-3 h-3" />
                  </button>
                </div>
                <div
                  v-else
                  class="h-16 w-16 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center"
                >
                  <UIcon name="i-heroicons-user" class="w-8 h-8 text-gray-400" />
                </div>
                <input
                  type="file"
                  accept="image/*"
                  class="block flex-1 text-sm file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 dark:file:bg-gray-700 dark:file:text-gray-200"
                  @change="onEditPhotoSelected"
                />
              </div>
            </div>
          </div>

          <template #footer>
            <div class="flex justify-end gap-2">
              <UButton
                color="neutral"
                variant="ghost"
                :disabled="isUpdating"
                @click="isEditing = false"
                >Cancel</UButton
              >
              <UButton
                color="primary"
                :loading="isUpdating"
                :disabled="!editMember.name?.trim()"
                @click="applyEdit"
                >Save</UButton
              >
            </div>
          </template>
        </UCard>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import type { EventItem } from '~/composables/useEvents'
import type { EventCommitteeMember } from '../../../../types/event'

const props = defineProps<{ event: EventItem }>()

// Use the events API composable
const {
  getEventCommittee,
  createEventCommitteeMember,
  updateEventCommitteeMember,
  deleteEventCommitteeMember,
  refreshEventCommittee,
} = useEvents()

// Fetch committee data from API
const { data: committeeResponse, pending: committeeLoading } = await getEventCommittee(
  props.event.id
)
const list = computed(() => committeeResponse.value?.data || [])

const newMember = reactive({
  name: '',
  role: '',
  email: '',
  phone: '',
})

// Photo upload for new member
const newPhotoFile = ref<File | null>(null)
const newPhotoPreview = ref<string | null>(null)

function onNewPhotoSelected(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) {
    newPhotoFile.value = null
    newPhotoPreview.value = null
    return
  }
  newPhotoFile.value = file
  newPhotoPreview.value = URL.createObjectURL(file)
}

function _slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}

async function uploadPhoto(file: File, memberName: string): Promise<string | undefined> {
  const ext = file.name.includes('.') ? file.name.slice(file.name.lastIndexOf('.')) : ''
  const base = props.event.slug || _slugify(props.event.title)
  const key = `committee-${base}-${_slugify(memberName)}-${Date.now()}${ext}`
  const form = new FormData()
  form.append('file', file)
  form.append('folder', 'events/committee')
  form.append('key', key)

  try {
    const uploadResp = await $fetch<{ url: string }>(`/api/uploads`, {
      method: 'POST',
      body: form,
      credentials: 'include',
    })
    return uploadResp.url
  } catch (err) {
    console.error('Photo upload failed:', err)
    useToast().add({
      title: 'Upload failed',
      description: 'Could not upload photo. Please try again.',
      color: 'error',
    })
    return undefined
  }
}

const canAdd = computed(() => newMember.name.trim().length > 0)

const isCreating = ref(false)
const isSyncing = ref(false)

async function addMember() {
  if (!canAdd.value || isCreating.value) return

  isCreating.value = true
  try {
    // Upload photo if provided
    let photoUrl: string | undefined
    if (newPhotoFile.value) {
      photoUrl = await uploadPhoto(newPhotoFile.value, newMember.name)
    }

    const memberData = {
      name: newMember.name.trim(),
      role: newMember.role?.trim() || undefined,
      email: newMember.email?.trim() || undefined,
      phone: newMember.phone?.trim() || undefined,
      photoUrl,
    }

    const created = await createEventCommitteeMember(props.event.id, memberData)
    // Optimistically update local list
    if (committeeResponse.value) {
      const current = Array.isArray(committeeResponse.value.data)
        ? committeeResponse.value.data
        : []
      committeeResponse.value.data = [created as unknown as EventCommitteeMember, ...current]
    }
    // Refresh from API for consistency
    isSyncing.value = true
    await refreshEventCommittee(props.event.id)
    // Additionally force Nuxt to refresh this key in case cookie-based trigger isn't immediate
    if (typeof refreshNuxtData === 'function') {
      await refreshNuxtData(`event-committee-${props.event.id}`)
    }
    isSyncing.value = false

    Object.assign(newMember, { name: '', role: '', email: '', phone: '' })
    newPhotoFile.value = null
    newPhotoPreview.value = null
    useToast().add({ title: 'Member added', color: 'success' })
  } catch (error) {
    console.error('Error adding committee member:', error)
    useToast().add({ title: 'Error adding member', color: 'error' })
  } finally {
    isCreating.value = false
  }
}

async function removeMember(id: string) {
  try {
    await deleteEventCommitteeMember(props.event.id, id)
    // Optimistically remove from local list
    if (committeeResponse.value && Array.isArray(committeeResponse.value.data)) {
      committeeResponse.value.data = committeeResponse.value.data.filter(
        m => String(m.id) !== String(id)
      )
    }
    isSyncing.value = true
    await refreshEventCommittee(props.event.id)
    isSyncing.value = false
    useToast().add({ title: 'Member removed', color: 'success' })
  } catch (error) {
    console.error('Error removing committee member:', error)
    useToast().add({ title: 'Error removing member', color: 'error' })
  }
}

const isEditing = ref(false)
const editMember = reactive<{
  id?: string
  name: string
  role?: string
  email?: string
  phone?: string
  photoUrl?: string
}>({
  id: undefined,
  name: '',
  role: '',
  email: '',
  phone: '',
  photoUrl: undefined,
})

// Photo upload for edit member
const editPhotoFile = ref<File | null>(null)
const editPhotoPreview = ref<string | null>(null)
const removeExistingPhoto = ref(false)

function onEditPhotoSelected(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) {
    editPhotoFile.value = null
    editPhotoPreview.value = null
    return
  }
  editPhotoFile.value = file
  editPhotoPreview.value = URL.createObjectURL(file)
  removeExistingPhoto.value = false
}

function removeEditPhoto() {
  editPhotoFile.value = null
  editPhotoPreview.value = null
  editMember.photoUrl = undefined
  removeExistingPhoto.value = true
}

function startEdit(m: EventCommitteeMember) {
  Object.assign(editMember, m)
  editPhotoFile.value = null
  editPhotoPreview.value = null
  removeExistingPhoto.value = false
  isEditing.value = true
}

const isUpdating = ref(false)

async function applyEdit() {
  if (!editMember.id || isUpdating.value) return

  isUpdating.value = true
  try {
    // Upload new photo if provided
    let photoUrl: string | undefined = editMember.photoUrl
    if (editPhotoFile.value) {
      photoUrl = await uploadPhoto(editPhotoFile.value, editMember.name)
    } else if (removeExistingPhoto.value) {
      photoUrl = undefined
    }

    const updateData = {
      name: editMember.name.trim(),
      role: editMember.role?.trim() || undefined,
      email: editMember.email?.trim() || undefined,
      phone: editMember.phone?.trim() || undefined,
      photoUrl,
    }

    await updateEventCommitteeMember(editMember.id, updateData)

    // Optimistically update local list
    if (committeeResponse.value && Array.isArray(committeeResponse.value.data)) {
      const index = committeeResponse.value.data.findIndex(
        m => String(m.id) === String(editMember.id)
      )
      if (index !== -1) {
        committeeResponse.value.data[index] = {
          ...committeeResponse.value.data[index],
          ...updateData,
        }
      }
    }

    // Refresh from API for consistency
    isSyncing.value = true
    await refreshEventCommittee(props.event.id)
    isSyncing.value = false

    isEditing.value = false
    useToast().add({ title: 'Member updated', color: 'success' })
  } catch (error) {
    console.error('Error updating committee member:', error)
    useToast().add({ title: 'Error updating member', color: 'error' })
  } finally {
    isUpdating.value = false
  }
}
</script>
