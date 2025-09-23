<template>
  <div class="space-y-8">
    <!-- Navigation -->
    <div class="pt-4 flex items-center justify-between">
      <UButton v-if="currentStep > 1" color="neutral" variant="outline" @click="prevStep">
        Back
      </UButton>
      <div v-if="currentStep === 1" class="w-20" />
      <!-- Spacer for alignment -->
      <div class="flex items-center gap-3">
        <UButton
          v-if="currentStep < steps.length"
          color="primary"
          :disabled="!isCurrentStepValid"
          @click="nextStep"
        >
          Next
        </UButton>
        <UButton
          v-else
          type="submit"
          color="primary"
          :loading="isSubmitting"
          :disabled="isSubmitting"
        >
          {{ isEditMode ? 'Save Changes' : 'Pay & Submit' }}
        </UButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  steps: Array<{ key: string; label: string }>
  currentStep: number
  isCurrentStepValid: boolean
  isEditMode: boolean
  isSubmitting: boolean
}

interface Emits {
  (e: 'goToStep' | 'nextStep' | 'prevStep', step?: number): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()

function nextStep() {
  emit('nextStep')
}

function prevStep() {
  emit('prevStep')
}
</script>

<style scoped>
/* Component styles can be added here if needed */
</style>
