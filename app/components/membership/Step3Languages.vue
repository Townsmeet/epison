<template>
  <div class="space-y-6">
    <h3 class="text-base font-medium text-gray-900 dark:text-white">Languages</h3>

    <UFormField label="Mother Tongue" name="motherTongue">
      <UInput v-model="form.motherTongue" class="w-full md:w-1/2" />
    </UFormField>

    <UFormField label="Other Languages" name="otherLanguages">
      <div class="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <UCheckbox
          v-for="lang in otherLanguages"
          :key="lang"
          :label="lang"
          :value="lang"
          :model-value="selectedOtherLangs.includes(lang)"
          @update:model-value="val => toggleLanguage(lang, val === true)"
        />
      </div>
      <div class="mt-3">
        <UCheckbox v-model="otherLanguageChecked" label="Others" />
        <div v-if="otherLanguageChecked" class="mt-2">
          <UInput v-model="form.otherLanguageText" placeholder="Specify other languages" />
        </div>
      </div>
    </UFormField>
  </div>
</template>

<script setup lang="ts">
import type { MembershipFormData } from '~/schemas/membership'
const form = defineModel<MembershipFormData>('form', { required: true })

const otherLanguages = ['English', 'French', 'German', 'Spanish', 'Russian', 'Japanese', 'Arabic']
const otherLanguageChecked = ref(false)

// Fallback to empty array if undefined to satisfy type checker
const selectedOtherLangs = computed<string[]>(() => form.value.otherLanguages ?? [])

function toggleLanguage(language: string, checked: boolean) {
  if (checked) {
    if (!(form.value.otherLanguages ?? []).includes(language)) {
      form.value.otherLanguages = [...(form.value.otherLanguages ?? []), language]
    }
  } else {
    const list = form.value.otherLanguages ?? []
    const index = list.indexOf(language)
    if (index > -1) form.value.otherLanguages = list.filter(l => l !== language)
  }
}
</script>
