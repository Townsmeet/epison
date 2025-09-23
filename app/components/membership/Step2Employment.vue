<template>
  <div class="space-y-6">
    <h3 class="text-base font-medium text-gray-900 dark:text-white">Employment & Education</h3>

    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <UFormField label="Present Position (Exact designation)" name="position" required>
        <UInput v-model="form.position" class="w-full" />
      </UFormField>

      <UFormField label="Department/Unit/Division" name="department">
        <UInput v-model="form.department" class="w-full" />
      </UFormField>
    </div>

    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <UFormField
        label="Employing Institution/Organization (full address)"
        name="employer"
        required
      >
        <UTextarea v-model="form.employer" :rows="3" class="w-full" />
      </UFormField>

      <UFormField
        label="Personal Qualifications (degrees/diplomas with dates)"
        name="qualifications"
      >
        <UTextarea v-model="form.qualifications" :rows="3" class="w-full" />
      </UFormField>
    </div>

    <UFormField
      label="Professional Experience (relevant to Epidemiology, key positions and dates)"
      name="experience"
    >
      <UTextarea v-model="form.experience" :rows="3" class="w-full" />
    </UFormField>

    <UFormField label="Major Publications (up to 5 files)" name="publications" hint="Optional">
      <div class="space-y-3">
        <UFileUpload
          v-slot="{ open }"
          v-model="form.publications"
          multiple
          accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
          :ui="{
            base: 'w-full',
            wrapper:
              'border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-primary-400 transition-colors',
          }"
        >
          <div
            class="flex flex-col items-center justify-center gap-2 text-gray-600 dark:text-gray-300 cursor-pointer select-none"
            role="button"
            aria-label="Open file dialog"
            @click.stop="open()"
          >
            <UIcon name="i-heroicons-arrow-up-on-square" class="h-8 w-8" />
            <div class="text-sm">
              <span class="font-medium text-gray-900 dark:text-white">Click to upload</span>
              or drag and drop
            </div>
            <div class="text-xs text-gray-500">PDF, DOC, DOCX, PNG, JPG up to 10MB each</div>
          </div>
        </UFileUpload>

        <p class="text-xs text-gray-500 dark:text-gray-400">
          Selected: {{ form.publications.length }}/5 file(s)
        </p>

        <div
          v-if="form.publications.length"
          class="rounded-lg border border-gray-200 dark:border-gray-700 divide-y divide-gray-200 dark:divide-gray-700 overflow-hidden"
        >
          <div
            v-for="(file, i) in form.publications"
            :key="file.name + i"
            class="flex items-center justify-between px-4 py-3 bg-gray-50/60 dark:bg-gray-800/50"
          >
            <div class="flex items-center gap-3">
              <UIcon name="i-heroicons-document" class="h-5 w-5 text-gray-500" />
              <div class="text-sm">
                <p class="font-medium text-gray-900 dark:text-white truncate max-w-[40ch]">
                  {{ file.name }}
                </p>
                <p class="text-xs text-gray-500">{{ formatBytes(file.size) }}</p>
              </div>
            </div>
            <UButton
              icon="i-heroicons-x-mark"
              color="neutral"
              variant="ghost"
              size="xs"
              aria-label="Remove file"
              @click="removePublication(i)"
            />
          </div>
        </div>
      </div>
    </UFormField>
  </div>
</template>

<script setup lang="ts">
import type { MembershipFormData } from '~/schemas/membership'
const form = defineModel<MembershipFormData>('form', { required: true })

// File helpers for publications
function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`
}

function removePublication(index: number) {
  if (index >= 0 && index < form.value.publications.length) {
    form.value.publications.splice(index, 1)
  }
}
</script>
