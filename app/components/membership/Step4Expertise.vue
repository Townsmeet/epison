<template>
  <div class="space-y-6">
    <h3 class="text-base font-medium text-gray-900 dark:text-white">Areas of Expertise</h3>

    <UFormField label="Describe areas of expertise (3–4 major fields)" name="expertiseDescription">
      <UTextarea v-model="form.expertiseDescription" :rows="3" class="w-full" />
    </UFormField>

    <UFormField label="Select up to 5 areas" name="expertise">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        <UCheckbox
          v-for="opt in expertiseOptions"
          :key="opt"
          :label="opt"
          :value="opt"
          :model-value="selectedExpertise.includes(opt)"
          @update:model-value="val => onToggleExpertise(opt, val === true)"
        />
      </div>
      <p class="mt-2 text-xs text-gray-500 dark:text-gray-400">
        Selected: {{ selectedExpertise.length }}/5
      </p>
      <div class="mt-3">
        <UInput v-model="form.expertiseOther" placeholder="Others (specify)" />
      </div>
    </UFormField>
  </div>
</template>

<script setup lang="ts">
import type { MembershipFormData } from '~/schemas/membership'
const form = defineModel<MembershipFormData>('form', { required: true })

const expertiseOptions = [
  'Accidents',
  'HIV/AIDS',
  'Arthritis (including Musculoskeletal)',
  'Behaviour',
  'Cancer',
  'Cardiovascular',
  'Cerebrovascular',
  'Chronic Respiratory Conditions',
  'Dementia',
  'Developing Countries',
  'Diabetes',
  'Disability',
  'Disasters',
  'Diet',
  'Drugs (including Alcohol)',
  'Elderly',
  'Endocrine',
  'Environment',
  'Evaluation',
  'Genetics',
  'Growth',
  'Handicap',
  'Health Economics',
  'Health Education',
  'Health Promotion',
  'Health Services',
  'Hearing',
  'Hypertension',
  'Infectious Disease',
  'Information Systems',
  'Injuries',
  'Lipids',
  'Malnutrition',
  'Measurement',
  'Methods',
  'Mental',
  'Neurological',
  'Nutrition',
  'Obstetrics, Gynecology',
  'Occupational Health',
  'Perinatal, Neonatal',
  'Pharmacological',
  'Physical Activity',
  'Psychiatry',
  'Planning',
  'Policy',
  'Screening',
  'Social Work',
  'Social Security & Health Insurance',
  'Suicide',
  'Surveys',
  'Toxicology (including Chemical)',
  'Vaccination',
  'Vision',
  'Tobacco Consumption',
]

const selectedExpertise = computed<string[]>(() => form.value.expertise ?? [])

function onToggleExpertise(opt: string, checked: boolean) {
  const list = form.value.expertise ?? []
  const exists = list.includes(opt)
  if (checked && !exists) {
    if (list.length >= 5) {
      // This would normally show a toast, but we'll handle it in the parent component
      return
    }
    form.value.expertise = [...list, opt]
  } else if (!checked && exists) {
    form.value.expertise = list.filter((x: string) => x !== opt)
  }
}
</script>
