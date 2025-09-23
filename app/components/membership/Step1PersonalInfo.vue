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

    <UFormField
      label="Present Mailing Address"
      name="address"
      hint="Include Postal/Zip Code, City, Country"
      required
    >
      <UTextarea v-model="form.address" :rows="3" class="w-full" />
    </UFormField>
  </div>
</template>

<script setup lang="ts">
import type { MembershipFormData } from '~/schemas/membership'
interface Props {
  currentStepErrors: string[]
}

defineProps<Props>()

const form = defineModel<MembershipFormData>('form', { required: true })

const titles = ['Dr', 'Mr', 'Mrs', 'Miss', 'Prof', 'Engr', 'Chief', 'Ms']

function onEmailInput(e: Event) {
  const target = e.target as HTMLInputElement
  form.value.email = (target?.value || '').trim()
}
</script>
