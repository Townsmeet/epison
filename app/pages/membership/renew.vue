<template>
  <div class="py-12 bg-white dark:bg-gray-900 min-h-screen">
    <div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
          Renew Your Membership
        </h1>
        <p class="mt-3 text-lg text-gray-500 dark:text-gray-400">
          Continue your EPISON membership for {{ currentYear }}
        </p>
      </div>

      <!-- Member Lookup Form (shown when no member ID) -->
      <div v-if="!memberId" class="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        <div class="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
          <h2 class="text-lg font-medium text-gray-900 dark:text-white">Find Your Membership</h2>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Enter your name or email address to find your membership record
          </p>
        </div>

        <div class="px-6 py-6">
          <div class="relative">
            <UInput
              v-model="searchQuery"
              placeholder="Search by first name or last name..."
              icon="i-heroicons-magnifying-glass"
              size="lg"
              class="w-full"
              :loading="isSearching"
            />
          </div>

          <!-- Loading State -->
          <div v-if="isSearching" class="mt-6 flex justify-center py-4">
            <UIcon name="i-heroicons-arrow-path" class="w-6 h-6 animate-spin text-primary-500" />
          </div>

          <!-- Search Results -->
          <div v-else-if="searchResults.length > 0" class="mt-6">
            <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              {{ searchResults.length }} member{{ searchResults.length > 1 ? 's' : '' }} found -
              select yours:
            </h3>
            <div class="space-y-2 max-h-80 overflow-y-auto">
              <button
                v-for="result in searchResults"
                :key="result.id"
                type="button"
                class="w-full text-left p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
                @click="selectMember(result.id)"
              >
                <div class="flex items-center justify-between">
                  <div class="min-w-0 flex-1">
                    <p class="font-medium text-gray-900 dark:text-white truncate">
                      {{ result.nameFirst }} {{ result.nameFamily }}
                    </p>
                    <p class="text-sm text-gray-500 dark:text-gray-400 truncate">
                      {{ result.email }}
                    </p>
                  </div>
                  <div class="text-right ml-4 flex-shrink-0">
                    <UBadge :color="getStatusColor(result.status)" variant="subtle" size="xs">
                      {{ result.status }}
                    </UBadge>
                    <p class="text-xs text-gray-500 dark:text-gray-400 mt-1 capitalize">
                      {{ formatMembershipType(result.membershipType) }}
                    </p>
                  </div>
                </div>
              </button>
            </div>
          </div>

          <!-- No Results Message -->
          <div v-else-if="hasSearched && searchResults.length === 0" class="mt-6 text-center py-6">
            <UIcon
              name="i-heroicons-user-circle"
              class="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-3"
            />
            <p class="text-gray-500 dark:text-gray-400">
              No membership found. Please check your details or contact support.
            </p>
          </div>

          <!-- Initial State Hint -->
          <div v-else-if="!searchQuery" class="mt-6 text-center py-6">
            <UIcon
              name="i-heroicons-magnifying-glass"
              class="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-3"
            />
            <p class="text-gray-500 dark:text-gray-400">
              Start typing to search for your membership
            </p>
          </div>
        </div>

        <div
          class="px-6 py-4 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700"
        >
          <p class="text-sm text-gray-500 dark:text-gray-400 text-center">
            Can't find your membership?
            <NuxtLink to="/contact" class="text-primary-600 dark:text-primary-400 hover:underline">
              Contact support
            </NuxtLink>
          </p>
        </div>
      </div>

      <!-- Loading State (when fetching member details) -->
      <div v-else-if="memberPending" class="flex justify-center py-12">
        <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-primary-500" />
      </div>

      <!-- Error State -->
      <div v-else-if="memberError || !memberData?.data" class="text-center py-12">
        <UIcon name="i-heroicons-exclamation-circle" class="w-16 h-16 mx-auto text-red-400 mb-4" />
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">Member Not Found</h2>
        <p class="text-gray-500 dark:text-gray-400 mb-6">
          We couldn't find your membership record. Please try searching again.
        </p>
        <UButton color="primary" @click="clearMemberSelection">Search Again</UButton>
      </div>

      <!-- Renewal Form (when member is found) -->
      <div v-else class="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        <!-- Back to Search Button -->
        <div
          class="px-6 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50"
        >
          <button
            type="button"
            class="text-sm text-primary-600 dark:text-primary-400 hover:underline flex items-center"
            @click="clearMemberSelection"
          >
            <UIcon name="i-heroicons-arrow-left" class="w-4 h-4 mr-1" />
            Search for different member
          </button>
        </div>

        <!-- Member Info Summary -->
        <div class="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
          <h2 class="text-lg font-medium text-gray-900 dark:text-white">Member Details</h2>
          <div class="mt-4 grid grid-cols-2 gap-4 text-sm">
            <div>
              <p class="text-gray-500 dark:text-gray-400">Name</p>
              <p class="font-medium text-gray-900 dark:text-white">
                {{ memberData.data.title }} {{ memberData.data.nameFirst }}
                {{ memberData.data.nameFamily }}
              </p>
            </div>
            <div>
              <p class="text-gray-500 dark:text-gray-400">Membership Type</p>
              <p class="font-medium text-gray-900 dark:text-white capitalize">
                {{ formatMembershipType(memberData.data.membershipType) }}
              </p>
            </div>
            <div v-if="isAlreadyRenewed" class="col-span-2">
              <p class="text-gray-500 dark:text-gray-400">Current Expiry Date</p>
              <p class="font-medium text-gray-900 dark:text-white">
                {{ formatDate(memberData.data.expiryDate) }}
              </p>
            </div>
          </div>
        </div>

        <!-- Already Renewed Message -->
        <div v-if="isAlreadyRenewed" class="px-6 py-12 text-center">
          <div
            class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/30 mb-4"
          >
            <UIcon
              name="i-heroicons-check-badge"
              class="h-10 w-10 text-green-600 dark:text-green-400"
            />
          </div>
          <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">Already Renewed</h3>
          <p class="text-gray-500 dark:text-gray-400 max-w-sm mx-auto mb-6">
            Your membership is already up to date for {{ currentYear }}. It is valid until
            {{ formatDate(memberData.data.expiryDate) }}.
          </p>
          <UButton color="neutral" variant="soft" to="/">Back to Home</UButton>
        </div>

        <!-- Renewal Form -->
        <div v-else class="px-6 py-6">
          <UForm
            :schema="renewalFormSchema"
            :state="formState"
            class="space-y-6"
            @submit="onSubmit"
          >
            <!-- Email Update -->
            <UFormField label="Email Address" name="email" required>
              <UInput
                v-model="formState.email"
                type="email"
                placeholder="your.email@example.com"
                class="w-full"
                icon="i-heroicons-envelope"
              />
              <template #hint>
                <span class="text-xs text-gray-500">Update your email if needed</span>
              </template>
            </UFormField>

            <!-- Fee Summary -->
            <div class="rounded-lg border border-gray-200 dark:border-gray-700 p-4">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm text-gray-500 dark:text-gray-400">Renewal Fee</p>
                  <p class="text-base font-semibold text-gray-900 dark:text-white capitalize">
                    {{ formatMembershipType(memberData.data.membershipType) }}
                  </p>
                </div>
                <div class="text-right">
                  <p class="text-2xl font-bold text-gray-900 dark:text-white">
                    ₦{{ formatNaira(renewalFee) }}
                  </p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">
                    Valid until Dec 31, {{ currentYear }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Submit Button -->
            <UButton
              type="submit"
              color="primary"
              size="lg"
              block
              :loading="isSubmitting"
              :disabled="isSubmitting || renewalFee <= 0"
            >
              <template #leading>
                <UIcon name="i-heroicons-credit-card" class="w-5 h-5" />
              </template>
              Pay ₦{{ formatNaira(renewalFee) }} & Renew
            </UButton>
          </UForm>
        </div>
      </div>

      <!-- Help Section -->
      <div class="mt-8 text-center">
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Having trouble renewing?
          <NuxtLink to="/contact" class="text-primary-600 dark:text-primary-400 hover:underline">
            Contact Support
          </NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FormSubmitEvent } from '#ui/types'
import { renewalFormSchema, type RenewalFormData } from '~/schemas/membership'
import type { MemberListItem } from '../../../types/members'

definePageMeta({ layout: 'default' })

useHead({
  title: 'Renew Membership - EPISON',
  meta: [
    {
      name: 'description',
      content: 'Renew your EPISON membership and continue enjoying member benefits.',
    },
  ],
})

const route = useRoute()
const router = useRouter()
const toast = useToast()
const config = useRuntimeConfig()

// Member ID from query (can be set via URL or after search)
const memberId = computed(() => String(route.query.id || ''))

// Current year for calendar-based renewal
const currentYear = new Date().getFullYear()

// Search state
const searchQuery = ref('')
const isSearching = ref(false)
const hasSearched = ref(false)
const debouncedSearch = ref('')

const searchResults = ref<MemberListItem[]>([])

// Debounce search
let searchTimeout: ReturnType<typeof setTimeout>
watch(searchQuery, newValue => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    debouncedSearch.value = newValue
    if (newValue.trim()) {
      searchForMembership()
    } else {
      searchResults.value = []
      hasSearched.value = false
    }
  }, 500)
})

// Search for membership by name or email using the members API
async function searchForMembership() {
  const query = debouncedSearch.value.trim()
  if (!query) return

  isSearching.value = true
  hasSearched.value = false
  searchResults.value = []

  try {
    const response = await searchMembers(query, 10)

    if (response.success && response.data && response.data.length > 0) {
      searchResults.value = response.data
    }
    hasSearched.value = true
  } catch (error) {
    console.error('Search error:', error)
    toast.add({
      title: 'Search Failed',
      description: 'Unable to search for membership. Please try again later.',
      color: 'error',
    })
  } finally {
    isSearching.value = false
  }
}

// Select a member from search results
function selectMember(id: string) {
  router.push({ path: '/membership/renew', query: { id } })
}

// Clear member selection and go back to search
function clearMemberSelection() {
  router.push({ path: '/membership/renew' })
}

// Fetch member data (only when memberId is set)
const { getMember, renewMember, searchMembers } = useMembers()

const { data: memberData, pending: memberPending, error: memberError } = await getMember(memberId)

// Status color mapping
function getStatusColor(status: string): 'success' | 'warning' | 'error' | 'neutral' {
  switch (status) {
    case 'active':
      return 'success'
    case 'expired':
      return 'warning'
    case 'suspended':
      return 'error'
    case 'pending':
    default:
      return 'neutral'
  }
}

// Fee mapping
const feeMap: Record<string, number> = {
  regular: 30000,
  'regular iea': 50000,
  'regular+iea': 50000,
  'early-career': 15000,
  'early-career iea': 20000,
  'early-career+iea': 20000,
}

// Computed renewal fee based on membership type
const renewalFee = computed(() => {
  const type = (memberData.value?.data?.membershipType || '').toLowerCase()
  return feeMap[type] ?? 30000 // Default to regular if unknown
})

// Check if membership is already renewed for the current year
const isAlreadyRenewed = computed(() => {
  if (!memberData.value?.data?.expiryDate) return false
  const expiry = new Date(memberData.value.data.expiryDate)
  const currentYearEnd = new Date(currentYear, 11, 31) // Dec 31 of current year
  return expiry >= currentYearEnd
})

// Check if membership is expired
// const isExpired = computed(() => {
//   if (!memberData.value?.data?.expiryDate) return true
//   return new Date(memberData.value.data.expiryDate) < new Date()
// })

// Form state
const formState = reactive<RenewalFormData>({
  email: memberData.value?.data?.email || '',
  fees: renewalFee.value,
  paymentReference: '',
})

// Sync email from member data when loaded
watch(
  () => memberData.value?.data?.email,
  email => {
    if (email) {
      formState.email = email
    }
  },
  { immediate: true }
)

// Update fees when renewal fee changes
watch(
  renewalFee,
  fee => {
    formState.fees = fee
  },
  { immediate: true }
)

const isSubmitting = ref(false)

// Paystack types (already declared globally in apply.vue, but we need local reference)
type PaystackResponse = { reference: string }
type PaystackConfig = {
  key: string
  email: string
  amount: number
  ref: string
  metadata?: Record<string, unknown>
  callback: (response: PaystackResponse) => void
  onClose: () => void
  subaccount?: string
}
type PaystackHandler = { openIframe: () => void }
type PaystackPopLocal = { setup: (config: PaystackConfig) => PaystackHandler }

async function loadPaystackScript() {
  if (typeof window === 'undefined') return
  if ((window as Window & { PaystackPop?: PaystackPopLocal }).PaystackPop) return
  await new Promise<void>((resolve, reject) => {
    const s = document.createElement('script')
    s.src = 'https://js.paystack.co/v1/inline.js'
    s.async = true
    s.onload = () => resolve()
    s.onerror = () => reject(new Error('Failed to load Paystack'))
    document.head.appendChild(s)
  })
}

function startPaystackPayment(): Promise<{ reference: string }> {
  return new Promise((resolve, reject) => {
    let isResolved = false
    ;(async () => {
      const amount = renewalFee.value
      if (!formState.email) {
        toast.add({
          title: 'Email required',
          description: 'Please enter your email address.',
          color: 'warning',
        })
        throw new Error('EMAIL_REQUIRED')
      }
      if (amount <= 0) {
        toast.add({
          title: 'Invalid fee',
          description: 'Unable to determine renewal fee.',
          color: 'error',
        })
        throw new Error('AMOUNT_INVALID')
      }

      await loadPaystackScript()
      const publicKey = config.public.paystackKey as string | undefined
      if (!publicKey) {
        toast.add({
          title: 'Configuration Error',
          description: 'Payment system is not configured properly.',
          color: 'error',
        })
        throw new Error('MISSING_KEY')
      }

      const ref = `EPISON-RENEW-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
      const w = window as Window & { PaystackPop?: PaystackPopLocal }
      const handler = w.PaystackPop!.setup({
        key: publicKey,
        email: formState.email,
        amount: amount * 100, // kobo
        ref,
        metadata: {
          custom_fields: [
            {
              display_name: 'Member ID',
              variable_name: 'member_id',
              value: memberId.value,
            },
            {
              display_name: 'Transaction Type',
              variable_name: 'transaction_type',
              value: 'membership_renewal',
            },
            {
              display_name: 'Membership Type',
              variable_name: 'membership_type',
              value: memberData.value?.data?.membershipType || 'unknown',
            },
          ],
        },
        callback: (response: PaystackResponse) => {
          isResolved = true
          toast.add({
            title: 'Payment successful',
            description: `Reference: ${response.reference}`,
            color: 'success',
          })
          resolve({ reference: response.reference })
        },
        onClose: () => {
          if (!isResolved) {
            toast.add({ title: 'Payment cancelled', color: 'info' })
            reject(new Error('CLOSED'))
          }
        },
        subaccount: config.public.paystackSubaccountCode as string | undefined,
      })
      handler.openIframe()
    })().catch((e: unknown) => {
      reject(e instanceof Error ? e : new Error('PAYMENT_ERROR'))
    })
  })
}

async function onSubmit(_event: FormSubmitEvent<RenewalFormData>) {
  if (isSubmitting.value) return
  isSubmitting.value = true

  try {
    // Start payment first
    const { reference } = await startPaystackPayment()
    formState.paymentReference = reference

    // Process renewal with backend
    console.log('Processing renewal for member:', memberId.value)
    const result = await renewMember(memberId.value, {
      email: formState.email,
      fees: formState.fees,
      paymentReference: reference,
    })
    console.log('Renewal result:', result)

    if (result.success) {
      toast.add({
        title: 'Membership Renewed!',
        description: `Your membership is now valid until December 31, ${currentYear}.`,
        color: 'success',
        icon: 'i-heroicons-check-circle',
      })

      // Redirect to success page
      console.log('Navigating to success page...')
      await router.push({
        path: '/membership/success',
        query: {
          type: 'renewal',
          id: memberId.value,
          ref: reference,
        },
      })
      console.log('Navigation call completed')
    } else {
      throw new Error(result.error || 'Failed to process renewal')
    }
  } catch (err) {
    if (err instanceof Error && err.message === 'CLOSED') {
      // User cancelled payment, no error needed
      isSubmitting.value = false
      return
    }
    console.error('Renewal error:', err)
    toast.add({
      title: 'Renewal Failed',
      description: err instanceof Error ? err.message : 'An error occurred during renewal.',
      color: 'error',
    })
    isSubmitting.value = false
  }
  // Note: We don't use finally here because we want isSubmitting to stay true
  // during the navigation process if successful.
}

// Utility functions
function formatNaira(n: number): string {
  return new Intl.NumberFormat('en-NG').format(n)
}

function formatDate(dateStr: string | undefined): string {
  if (!dateStr) return 'N/A'
  return new Date(dateStr).toLocaleDateString('en-NG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

// function formatDate(dateStr: string | undefined): string {
//   if (!dateStr) return 'N/A'
//   return new Date(dateStr).toLocaleDateString('en-NG', {
//     year: 'numeric',
//     month: 'long',
//     day: 'numeric',
//   })
// }

function formatMembershipType(type: string | undefined): string {
  if (!type) return 'Regular'
  return type.replace(/[+-]/g, ' ').replace(/iea/gi, '+ IEA').replace(/\s+/g, ' ').trim()
}
</script>
