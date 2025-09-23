<template>
  <div class="space-y-6">
    <h3 class="text-base font-medium text-gray-900 dark:text-white">Payment</h3>

    <div
      class="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50/60 dark:bg-gray-800/50 p-4"
    >
      <p class="text-sm text-gray-700 dark:text-gray-300">
        Review your details and proceed to payment to complete your membership application.
      </p>
    </div>

    <div v-if="!isEditMode" class="rounded-lg border border-gray-200 dark:border-gray-700 p-4">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm text-gray-500">Application</p>
          <p class="text-base font-semibold text-gray-900 dark:text-white">Membership Fee</p>
        </div>
        <div class="text-right">
          <p class="text-2xl font-bold text-gray-900 dark:text-white">
            ₦ {{ formatNaira(amountNaira) }}
          </p>
          <p class="text-xs text-gray-500">
            {{ membershipType || 'Select on previous page' }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  isEditMode: boolean
  membershipType: string
  amountNaira: number
}

defineProps<Props>()

function formatNaira(n: number) {
  return new Intl.NumberFormat('en-NG').format(n)
}
</script>
