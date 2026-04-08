<template>
  <UModal v-model:open="isOpen" :title="title" :ui="{ width: 'sm:max-w-md' }">
    <template #body>
      <div class="text-center py-4">
        <div
          class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 dark:bg-red-900/30 mb-4"
        >
          <UIcon name="i-heroicons-exclamation-triangle" class="h-8 w-8 text-red-600" />
        </div>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          {{ title }}
        </h3>
        <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">
          {{ message }}
        </p>
        <p v-if="attemptInfo" class="text-xs text-gray-500 dark:text-gray-500">
          {{ attemptInfo }}
        </p>
      </div>
    </template>

    <template #footer>
      <div class="flex justify-end gap-3">
        <UButton color="neutral" variant="outline" :disabled="isRetrying" @click="handleCancel">
          {{ cancelLabel }}
        </UButton>
        <UButton color="primary" :loading="isRetrying" @click="handleRetry">
          <UIcon name="i-heroicons-arrow-path" class="h-4 w-4 mr-1" />
          {{ retryLabel }}
        </UButton>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
interface Props {
  title?: string
  message?: string
  attemptInfo?: string
  retryLabel?: string
  cancelLabel?: string
  isRetrying?: boolean
}

withDefaults(defineProps<Props>(), {
  title: 'Submission Failed',
  message: 'We encountered an error while processing your request. Please try again.',
  attemptInfo: '',
  retryLabel: 'Try Again',
  cancelLabel: 'Cancel',
  isRetrying: false,
})

const isOpen = defineModel<boolean>('open', { default: false })

const emit = defineEmits<{
  (e: 'retry' | 'cancel'): void
}>()

function handleRetry() {
  emit('retry')
}

function handleCancel() {
  isOpen.value = false
  emit('cancel')
}
</script>
