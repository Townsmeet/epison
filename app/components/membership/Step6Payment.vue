<template>
  <div class="space-y-6">
    <h3 class="text-base font-medium text-gray-900 dark:text-white">Payment & Category</h3>

    <div
      class="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50/60 dark:bg-gray-800/50 p-4"
    >
      <p class="text-sm text-gray-700 dark:text-gray-300">
        Your application will be created first, then you'll be redirected to Paystack to complete
        payment. After successful payment, you'll receive a confirmation email and your application
        will be reviewed by our admin team.
      </p>
    </div>

    <div v-if="!isEditMode" class="space-y-4">
      <UFormField label="Select Membership Category" name="membershipType" required>
        <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div
            v-for="cat in membershipCategories"
            :key="cat.key"
            class="relative rounded-lg border p-4 cursor-pointer transition-all duration-200"
            :class="[
              form.membershipType === cat.key
                ? 'border-primary-500 ring-2 ring-primary-500 bg-primary-50/30 dark:bg-primary-950/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-800',
            ]"
            @click="selectCategory(cat)"
          >
            <div class="flex items-start justify-between">
              <div class="space-y-1">
                <p class="font-medium text-sm text-gray-900 dark:text-white">{{ cat.name }}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">{{ cat.description }}</p>
              </div>
              <span
                v-if="form.membershipType === cat.key"
                class="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-500 text-white"
              >
                <UIcon name="i-heroicons-check" class="h-3 w-3" />
              </span>
            </div>
            <div class="mt-3 pt-2 border-t border-gray-100 dark:border-gray-700/60">
              <p class="text-base font-bold text-gray-900 dark:text-white">
                ₦ {{ formatNaira(cat.fee) }}
                <span class="text-xs font-normal text-gray-500">/year</span>
              </p>
            </div>
          </div>
        </div>
      </UFormField>

      <!-- Fee Summary Card -->
      <div
        class="rounded-lg border border-gray-200 dark:border-gray-700 p-4 bg-gray-50/40 dark:bg-gray-800/40"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">Total Payable Fee</p>
            <p class="text-base font-semibold text-gray-900 dark:text-white">
              {{ selectedCategoryName || 'Please select a category above' }}
            </p>
          </div>
          <div class="text-right">
            <p class="text-2xl font-bold text-primary-600 dark:text-primary-400">
              ₦ {{ formatNaira(form.fees || 0) }}
            </p>
            <p v-if="!form.fees || form.fees <= 0" class="text-xs text-red-500 mt-1">
              Select a category to enable payment
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { MembershipFormData } from '~/schemas/membership'

interface Props {
  isEditMode: boolean
}

defineProps<Props>()

const form = defineModel<MembershipFormData>('form', { required: true })

const membershipCategories = [
  {
    key: 'regular',
    name: 'Regular Membership',
    fee: 30000,
    description: 'Individuals engaged in research, teaching or practice of epidemiology',
  },
  {
    key: 'regular iea',
    name: 'Regular Membership (+IEA)',
    fee: 70000,
    description: 'Combined EPiSON membership with International Epidemiological Association',
  },
  {
    key: 'early-career',
    name: 'Early Career Membership',
    fee: 15000,
    description: 'Students and individuals in epidemiology for not more than 10 years',
  },
  {
    key: 'early-career iea',
    name: 'Early Career Membership (+IEA)',
    fee: 40000,
    description: 'Joint EPiSON & International Epidemiological Association access',
  },
]

const selectedCategoryName = computed(() => {
  const found = membershipCategories.find(c => c.key === form.value.membershipType)
  return found ? found.name : ''
})

function selectCategory(cat: (typeof membershipCategories)[number]) {
  form.value.membershipType = cat.key
  form.value.fees = cat.fee
}

function formatNaira(n: number) {
  return new Intl.NumberFormat('en-NG').format(n)
}
</script>
