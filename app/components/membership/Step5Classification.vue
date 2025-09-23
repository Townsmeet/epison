<template>
  <div class="space-y-6">
    <h3 class="text-base font-medium text-gray-900 dark:text-white">Employment Classification</h3>

    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <UFormField label="Employing Agency/Institution/Organization" name="agency">
        <USelect
          v-model="form.agency"
          :items="agencyOptions"
          placeholder="Select agency"
          class="w-full"
        />
      </UFormField>

      <div class="flex flex-col gap-2">
        <UFormField label="Type of Work" name="typeOfWork">
          <USelect
            v-model="form.typeOfWork"
            :items="typeOfWorkOptions"
            placeholder="Select type of work"
            class="w-full"
          />
        </UFormField>
        <div v-if="form.typeOfWork === 'Others'">
          <UFormField label="Please specify" name="typeOfWorkOther">
            <UInput v-model="form.typeOfWorkOther" class="w-full" />
          </UFormField>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { MembershipFormData } from '~/schemas/membership'
const form = defineModel<MembershipFormData>('form', { required: true })

const agencyOptions = [
  'Health Service Administration',
  'Social Security Administration',
  'University/Higher Institution (or similar)',
  'Other Research Establishment',
  'Hospital',
  'Health Centre or other Primary Care Facility',
  'Industry',
  'Self-Employed or Private',
]

const typeOfWorkOptions = [
  'Administration & Management',
  'Planning & Information',
  'Teaching & Research',
  'Clinical',
  'Laboratory',
  'Other Practical Work',
  'Others',
]
</script>
