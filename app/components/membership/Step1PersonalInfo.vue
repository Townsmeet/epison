<template>
  <div class="space-y-6">
    <h3 class="text-base font-medium text-gray-900 dark:text-white">Personal Information</h3>

    <!-- Validation errors for this step -->
    <div
      v-if="false && currentStepErrors.length > 0"
      class="rounded-md bg-red-50 dark:bg-red-900/20 p-4 border border-red-200 dark:border-red-800"
    >
      <div class="flex">
        <div class="flex-shrink-0">
          <UIcon name="i-heroicons-exclamation-triangle" class="h-5 w-5 text-red-400" />
        </div>
        <div class="ml-3">
          <h3 class="text-sm font-medium text-red-800 dark:text-red-200">
            Please complete the following fields:
          </h3>
          <div class="mt-2 text-sm text-red-700 dark:text-red-300">
            <ul class="list-disc pl-5 space-y-1">
              <li v-for="error in currentStepErrors" :key="error">{{ error }}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- Profile Photo -->
    <UFormField label="Profile Photo" name="avatar" hint="Upload your profile picture (optional)">
      <div class="flex items-center space-x-4">
        <div
          v-if="form.avatar"
          class="flex-shrink-0 w-20 h-20 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700"
        >
          <img :src="form.avatar" alt="Profile" class="w-full h-full object-cover" />
        </div>
        <div
          v-else
          class="flex-shrink-0 w-20 h-20 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center"
        >
          <UIcon name="i-heroicons-user" class="w-10 h-10 text-gray-400" />
        </div>
        <div class="flex-1">
          <input
            ref="fileInput"
            type="file"
            accept="image/*"
            class="hidden"
            @change="handleFileUpload"
          />
          <UButton
            color="neutral"
            variant="solid"
            icon="i-heroicons-photo"
            @click="fileInput?.click()"
          >
            {{ form.avatar ? 'Change Photo' : 'Upload Photo' }}
          </UButton>
          <p v-if="uploadError" class="mt-2 text-sm text-red-600 dark:text-red-400">
            {{ uploadError }}
          </p>
          <p v-if="isUploading" class="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Uploading...
          </p>
        </div>
      </div>
    </UFormField>

    <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <UFormField label="Family Name" name="nameFamily" required>
        <UInput v-model="form.nameFamily" class="w-full" />
      </UFormField>
      <UFormField label="Middle Name" name="nameMiddle">
        <UInput v-model="form.nameMiddle" class="w-full" />
      </UFormField>
      <UFormField label="First Name" name="nameFirst" required>
        <UInput v-model="form.nameFirst" class="w-full" />
      </UFormField>
    </div>

    <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <UFormField label="Title" name="title" required>
        <USelect v-model="form.title" :items="titles" placeholder="Select title" class="w-full" />
      </UFormField>

      <UFormField label="Sex" name="sex" required>
        <URadioGroup
          v-model="form.sex"
          orientation="horizontal"
          variant="list"
          :items="[
            { label: 'Male', value: 'Male' },
            { label: 'Female', value: 'Female' },
          ]"
        />
      </UFormField>

      <UFormField label="Date of Birth" name="dob" required>
        <UInput v-model="form.dob" type="date" class="w-full" />
      </UFormField>
    </div>

    <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <UFormField label="Telephone" name="telephone" required>
        <UInput v-model="form.telephone" class="w-full" />
      </UFormField>
      <UFormField label="Fax" name="fax">
        <UInput v-model="form.fax" class="w-full" />
      </UFormField>
      <UFormField label="Email" name="email" required>
        <UInput v-model="form.email" type="email" class="w-full" @input="onEmailInput" />
      </UFormField>
    </div>

    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <UFormField
        label="Present Mailing Address"
        name="address"
        hint="Include Postal/Zip Code, City, Country"
        required
      >
        <UTextarea v-model="form.address" :rows="3" class="w-full" />
      </UFormField>

      <UFormField
        label="Geopolitical Zone"
        name="geopoliticalZone"
        hint="Select your geopolitical zone"
        required
      >
        <USelect
          v-model="form.geopoliticalZone"
          :items="geopoliticalZones"
          placeholder="Select zone"
          class="w-full"
        />
      </UFormField>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { MembershipFormData } from '~/schemas/membership'
interface Props {
  currentStepErrors: string[]
}

defineProps<Props>()

const form = defineModel<MembershipFormData>('form', { required: true })
const fileInput = ref<HTMLInputElement>()
const isUploading = ref(false)
const uploadError = ref('')

const titles = ['Dr', 'Mr', 'Mrs', 'Miss', 'Prof', 'Engr', 'Chief', 'Ms']

const geopoliticalZones = [
  'South South',
  'South West',
  'South East',
  'North Central',
  'North West',
  'North East',
  'Not Applicable',
]

function onEmailInput(e: Event) {
  const target = e.target as HTMLInputElement
  form.value.email = (target?.value || '').trim()
}

async function handleFileUpload(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (!file) return

  // Validate file type
  if (!file.type.startsWith('image/')) {
    uploadError.value = 'Please select an image file'
    return
  }

  // Validate file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    uploadError.value = 'Image size must be less than 5MB'
    return
  }

  uploadError.value = ''
  isUploading.value = true

  try {
    const formData = new FormData()
    formData.append('file', file)

    const response = await $fetch<{ url: string }>('/api/uploads', {
      method: 'POST',
      body: formData,
    })

    form.value.avatar = response.url
  } catch (error) {
    console.error('Upload error:', error)
    uploadError.value = 'Failed to upload image. Please try again.'
  } finally {
    isUploading.value = false
  }
}
</script>
