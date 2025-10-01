<template>
  <div class="py-12 bg-white dark:bg-gray-900">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
          Membership Application
        </h1>
        <p class="mt-3 text-lg text-gray-500 dark:text-gray-400">
          Complete the form below to apply for EPISON membership
        </p>
      </div>

      <div class="mt-12 bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        <div class="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
          <h2 class="text-lg font-medium text-gray-900 dark:text-white">Application Details</h2>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Please fill in your information accurately
          </p>
        </div>

        <div class="px-6 py-6">
          <UForm :schema="membershipFormSchema" :state="state" class="space-y-8" @submit="onSubmit">
            <!-- Step Indicator -->
            <MembershipStepIndicator
              :steps="steps"
              :current-step="currentStep"
              @go-to-step="goToStep"
            />

            <!-- Step 1: Personal Information -->
            <MembershipStep1PersonalInfo
              v-show="currentStep === 1"
              v-model:form="state"
              :current-step-errors="currentStepErrors"
            />

            <!-- Step 2: Employment & Education -->
            <MembershipStep2Employment v-show="currentStep === 2" v-model:form="state" />

            <!-- Step 3: Languages -->
            <MembershipStep3Languages v-show="currentStep === 3" v-model:form="state" />

            <!-- Step 4: Areas of Expertise -->
            <MembershipStep4Expertise v-show="currentStep === 4" v-model:form="state" />

            <!-- Step 5: Employment Classification -->
            <MembershipStep5Classification v-show="currentStep === 5" v-model:form="state" />

            <!-- Step 6: Payment -->
            <MembershipStep6Payment
              v-show="currentStep === 6"
              :is-edit-mode="isEditMode"
              :membership-type="membershipType"
              :amount-naira="amountNaira"
            />

            <!-- Step Navigation Buttons -->
            <MembershipStepNavigation
              :steps="steps"
              :current-step="currentStep"
              :is-current-step-valid="isCurrentStepValid"
              :is-edit-mode="isEditMode"
              :is-submitting="isSubmitting"
              @go-to-step="goToStep"
              @next-step="nextStep"
              @prev-step="prevStep"
            />
          </UForm>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FormSubmitEvent } from '#ui/types'
import { membershipFormSchema, type MembershipFormData } from '~/schemas/membership'

definePageMeta({ layout: 'default' })

const route = useRoute()
const isEditMode = computed(() => route.query.edit === '1' || route.query.edit === 'true')
// Member IDs are strings (UUID/text). Do NOT coerce to number.
const memberId = computed(() => String(route.query.id || ''))

useHead(() => ({
  title: isEditMode.value ? 'Edit Member - EPISON' : 'Apply for Membership - EPISON',
  meta: [
    {
      name: 'description',
      content: isEditMode.value
        ? 'Edit your EPISON membership profile information.'
        : 'Apply for membership with the Epidemiological Society of Nigeria (EPISON) and join our community of public health professionals.',
    },
  ],
}))

const toast = useToast()
const router = useRouter()
const isSubmitting = ref(false)
const { createMember, updateMember, getMember } = useMembers()

// Form state with Zod schema
const state = reactive<MembershipFormData>({
  // Personal Information
  title: 'Dr',
  nameFamily: '',
  nameMiddle: '',
  nameFirst: '',
  sex: '',
  dob: '',
  address: '',
  state: 'Abia',
  telephone: '',
  fax: '',
  email: '',
  avatar: '',

  // Employment & Education
  position: '',
  employer: '',
  department: '',
  qualifications: '',
  experience: '',

  // Languages
  motherTongue: '',
  otherLanguages: [],
  otherLanguageText: '',

  // Areas of Expertise
  expertiseDescription: '',
  expertise: [],
  expertiseOther: '',

  // Employment Classification
  agency: 'Industry',
  typeOfWork: 'Clinical',
  typeOfWorkOther: '',
  retiredSince: '',

  // Payment Details
  membershipType: '',
  fees: 0,
  publications: [] as File[],
})

// Minimal Paystack types
type PaystackResponse = { reference: string }
type PaystackCustomField = {
  display_name: string
  variable_name: string
  value: string
}
type PaystackConfig = {
  key: string
  email: string
  amount: number
  ref: string
  metadata?: Record<string, unknown> | { custom_fields?: PaystackCustomField[] }
  callback: (response: PaystackResponse) => void
  onClose: () => void
}
type PaystackHandler = { openIframe: () => void }
type PaystackPop = { setup: (config: PaystackConfig) => PaystackHandler }

declare global {
  interface Window {
    PaystackPop?: PaystackPop
  }
}

const baseSteps = [
  { key: 'personal', label: 'Personal' },
  { key: 'employment', label: 'Employment' },
  { key: 'languages', label: 'Languages' },
  { key: 'expertise', label: 'Expertise' },
  { key: 'classification', label: 'Classification' },
  { key: 'payment', label: 'Payment' },
]
const steps = ref(baseSteps)
if (isEditMode.value) {
  steps.value = baseSteps.filter(s => s.key !== 'payment')
}

const currentStep = ref(1)

// Step validation functions
function isStep1Valid() {
  return !!(
    state.nameFamily.trim() &&
    state.nameFirst.trim() &&
    state.title &&
    state.sex &&
    state.dob &&
    state.telephone.trim() &&
    state.email.trim() &&
    state.address.trim()
  )
}

function isStep2Valid() {
  return !!(state.position.trim() && state.employer.trim())
}

function isStep3Valid() {
  return true // No required fields
}

function isStep4Valid() {
  return true // No required fields
}

function isStep5Valid() {
  return true // No required fields
}

function isStep6Valid() {
  return !!state.fees && state.fees > 0 // Need valid amount for payment
}

// Computed property to check if current step is valid
const isCurrentStepValid = computed(() => {
  switch (currentStep.value) {
    case 1:
      return isStep1Valid()
    case 2:
      return isStep2Valid()
    case 3:
      return isStep3Valid()
    case 4:
      return isStep4Valid()
    case 5:
      return isStep5Valid()
    case 6:
      return isStep6Valid()
    default:
      return false
  }
})

// Using UFileUpload slot's open() to trigger file dialog; no extra ref needed

// Payment: compute amount based on membership type from query
const feeMap: Record<string, number> = {
  regular: 30000,
  'regular iea': 50000,
  'early-career': 15000,
  'early-career iea': 20000,
}
const membershipType = computed(() => String((route.query.type as string) || '').toLowerCase())
const amountNaira = computed(() => feeMap[membershipType.value] ?? 0)

// formatNaira handled in Step6Payment component

async function loadPaystackScript() {
  if (typeof window === 'undefined') return
  if (window.PaystackPop) return
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
    ;(async () => {
      const amount = amountNaira.value
      if (!state.email) {
        toast.add({
          title: 'Email required',
          description: 'Enter your email to continue to payment.',
          color: 'warning',
        })
        throw new Error('EMAIL_REQUIRED')
      }
      if (!amount || amount <= 0) {
        toast.add({
          title: 'Select membership type',
          description: 'Open the membership page and choose a category to set the fee.',
          color: 'warning',
        })
        throw new Error('AMOUNT_INVALID')
      }

      await loadPaystackScript()
      const config = useRuntimeConfig()
      const publicKey = config.public.paystackKey as string | undefined
      if (!publicKey) {
        toast.add({
          title: 'Missing Paystack key',
          description:
            'Set PAYSTACK_PUBLIC_KEY in .env and expose it via runtimeConfig.public.paystackKey',
          color: 'error',
        })
        throw new Error('MISSING_KEY')
      }
      const ref = `EPISON-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
      const handler = window.PaystackPop!.setup({
        key: publicKey,
        email: state.email,
        amount: amount * 100, // kobo
        ref,
        metadata: {
          custom_fields: [
            {
              display_name: 'Membership Type',
              variable_name: 'membership_type',
              value: state.membershipType || 'unspecified',
            },
          ],
        },
        callback: (response: PaystackResponse) => {
          toast.add({
            title: 'Payment successful',
            description: `Reference: ${response.reference}`,
            color: 'success',
          })
          resolve({ reference: response.reference })
        },
        onClose: () => {
          toast.add({ title: 'Payment cancelled', color: 'info' })
          reject(new Error('CLOSED'))
        },
      })
      handler.openIframe()
    })().catch((e: unknown) => {
      console.error(e)
      toast.add({
        title: 'Payment error',
        description: 'Could not start Paystack payment.',
        color: 'error',
      })
      reject(e instanceof Error ? e : new Error('PAYMENT_ERROR'))
    })
  })
}

// Stepper auto-scroll to keep active step visible on mobile
const stepperRef = ref<HTMLElement | null>(null)
const stepEls = ref<HTMLElement[]>([])
async function scrollActiveStepIntoView() {
  await nextTick()
  const idx = currentStep.value - 1
  const el = stepEls.value[idx]
  const container = stepperRef.value
  if (el && container) {
    el.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
  }
}
watch(currentStep, () => {
  scrollActiveStepIntoView()
})
onMounted(() => {
  scrollActiveStepIntoView()
})

// Enforce max 5 files and 10MB per file
watch(
  () => state.publications,
  val => {
    const MAX_FILES = 5
    const MAX_SIZE = 10 * 1024 * 1024

    let changed = false
    // Filter oversize files
    const sizeFiltered = val.filter(f => f.size <= MAX_SIZE)
    if (sizeFiltered.length !== val.length) {
      changed = true
      toast.add({
        title: 'Some files skipped',
        description: 'Files over 10MB were skipped.',
        color: 'warning',
        icon: 'i-heroicons-exclamation-triangle',
      })
    }

    // Enforce max count
    if (sizeFiltered.length > MAX_FILES) {
      sizeFiltered.splice(MAX_FILES)
      changed = true
      toast.add({
        title: 'Limit exceeded',
        description: 'Only the first 5 files were kept for Major Publications.',
        color: 'warning',
        icon: 'i-heroicons-exclamation-circle',
      })
    }

    if (changed) {
      state.publications = sizeFiltered
    }
  },
  { deep: true }
)

function prevStep() {
  if (currentStep.value > 1) currentStep.value -= 1
}

function goToStep(n?: number) {
  if (typeof n === 'number' && n >= 1 && n <= steps.value.length) {
    currentStep.value = n
  }
}

function nextStep() {
  if (currentStep.value < steps.value.length) {
    currentStep.value += 1
  }
}

// onEmailInput handled within Step1 component

// Computed property to get validation errors for current step
const currentStepErrors = computed(() => {
  const errors: string[] = []
  switch (currentStep.value) {
    case 1:
      if (!state.nameFamily.trim()) errors.push('Family name is required')
      if (!state.nameFirst.trim()) errors.push('First name is required')
      if (!state.title) errors.push('Title is required')
      if (!state.sex) errors.push('Sex is required')
      if (!state.dob) errors.push('Date of birth is required')
      if (!state.telephone.trim()) errors.push('Telephone is required')
      if (!state.email.trim()) errors.push('Email is required')
      if (!state.address.trim()) errors.push('Address is required')
      break
    case 2:
      if (!state.position.trim()) errors.push('Position is required')
      if (!state.employer.trim()) errors.push('Employer is required')
      break
    case 6:
      if (!state.fees || state.fees <= 0)
        errors.push('Please select a membership type to proceed with payment')
      break
  }
  return errors
})

const onSubmit = async (_event: FormSubmitEvent<MembershipFormData>) => {
  isSubmitting.value = true
  try {
    if (isEditMode.value) {
      // Edit mode: save changes without payment
      const updateData = {
        id: memberId.value.toString(),
        // Personal Information
        title: state.title,
        nameFamily: state.nameFamily,
        nameMiddle: state.nameMiddle,
        nameFirst: state.nameFirst,
        sex: state.sex,
        dob: state.dob,
        address: state.address,
        telephone: state.telephone,
        fax: state.fax,
        email: state.email,

        // Employment & Education
        position: state.position,
        employer: state.employer,
        department: state.department,
        qualifications: state.qualifications,
        experience: state.experience,

        // Languages
        motherTongue: state.motherTongue,
        otherLanguages: state.otherLanguages,
        otherLanguageText: state.otherLanguageText,

        // Areas of Expertise
        expertiseDescription: state.expertiseDescription,
        expertise: state.expertise,
        expertiseOther: state.expertiseOther,

        // Employment Classification
        agency: state.agency,
        typeOfWork: state.typeOfWork,
        typeOfWorkOther: state.typeOfWorkOther,
      }

      const updateResponse = await updateMember(memberId.value, updateData)
      if (!updateResponse.success) {
        throw new Error(updateResponse.error || 'Failed to update member')
      }

      if (!updateResponse.data) {
        throw new Error('No data returned from server')
      }

      toast.add({
        title: 'Changes Saved',
        description: 'Membership details have been updated successfully.',
        icon: 'i-heroicons-check-circle',
        color: 'success',
      })

      // Redirect back to admin member detail if coming from admin
      const backTo = route.query.back as string | undefined
      if (backTo) {
        await router.push(backTo)
      } else if (memberId.value) {
        await router.push(`/admin/memberships/${memberId.value}`)
      }
      return
    }

    // Apply mode: Start Paystack and wait for success
    const { reference } = await startPaystackPayment()

    // Upload publications if any
    let publicationUrls: string[] = []
    if (state.publications.length > 0) {
      try {
        const uploadPromises = state.publications.map(async (file: File) => {
          const uploadForm = new FormData()
          // Include filename explicitly so multipart part has a filename
          uploadForm.append('file', file, file.name)
          uploadForm.append('folder', 'publications')

          const response = (await $fetch('/api/uploads', {
            method: 'POST',
            body: uploadForm,
          })) as { url: string }
          return response.url
        })

        publicationUrls = await Promise.all(uploadPromises)
      } catch (uploadError) {
        console.error('Failed to upload publications:', uploadError)
        toast.add({
          title: 'Upload Warning',
          description:
            'Some files could not be uploaded but your application will still be submitted.',
          color: 'warning',
        })
      }
    }

    // Prepare member data for API
    const createData: import('../../../types/members').CreateMemberRequest = {
      // Personal Information
      title: state.title,
      nameFamily: state.nameFamily,
      nameMiddle: state.nameMiddle,
      nameFirst: state.nameFirst,
      sex: state.sex,
      dob: state.dob,
      address: state.address,
      telephone: state.telephone,
      fax: state.fax,
      email: state.email,

      // Employment & Education
      position: state.position,
      employer: state.employer,
      department: state.department,
      qualifications: state.qualifications,
      experience: state.experience,

      // Languages
      motherTongue: state.motherTongue,
      otherLanguages: state.otherLanguages,
      otherLanguageText: state.otherLanguageText,

      // Areas of Expertise
      expertiseDescription: state.expertiseDescription,
      expertise: state.expertise,
      expertiseOther: state.expertiseOther,

      // Employment Classification
      agency: state.agency,
      typeOfWork: state.typeOfWork,
      typeOfWorkOther: state.typeOfWorkOther,

      // Membership Details
      membershipType: state.membershipType,
      fees: state.fees,
      paymentReference: reference,

      // Related data
      publications: publicationUrls,
    }

    const createResponse = await createMember(createData)
    if (!createResponse.success) {
      throw new Error(createResponse.error || 'Failed to create member')
    }

    if (!createResponse.data) {
      throw new Error('No data returned from server')
    }

    toast.add({
      title: 'Application Submitted',
      description: `We received your application and payment. Ref: ${reference}`,
      icon: 'i-heroicons-check-circle',
      color: 'success',
    })
    await router.push('/membership/success')
    return
  } catch (e) {
    // Payment cancelled or failed (apply mode) or save failed (edit mode)
    console.error(e)

    // Handle specific error types
    let errorTitle = 'Error'
    let errorDescription = 'An unexpected error occurred'
    let errorColor: 'error' | 'warning' = 'error'

    if (e instanceof Error) {
      if (e.message === 'EMAIL_REQUIRED') {
        errorTitle = 'Email Required'
        errorDescription = 'Please enter your email address to proceed with payment.'
        errorColor = 'warning'
      } else if (e.message === 'AMOUNT_INVALID') {
        errorTitle = 'Invalid Amount'
        errorDescription = 'Please select a membership type to determine the fee amount.'
        errorColor = 'warning'
      } else if (e.message === 'MISSING_KEY') {
        errorTitle = 'Payment Configuration Error'
        errorDescription = 'Payment system is not properly configured. Please contact support.'
        errorColor = 'error'
      } else if (e.message === 'CLOSED') {
        errorTitle = 'Payment Cancelled'
        errorDescription = 'You cancelled the payment process.'
        errorColor = 'warning'
      } else if (e.message === 'PAYMENT_ERROR') {
        errorTitle = 'Payment Error'
        errorDescription = 'Unable to process payment. Please try again or contact support.'
        errorColor = 'error'
      } else if (isEditMode.value) {
        errorTitle = 'Save Failed'
        errorDescription = 'Unable to save your changes. Please try again.'
        errorColor = 'error'
      } else {
        errorTitle = 'Application Failed'
        errorDescription =
          'Unable to submit your application. Please check your information and try again.'
        errorColor = 'error'
      }
    }

    toast.add({
      title: errorTitle,
      description: errorDescription,
      color: errorColor,
    })
  } finally {
    isSubmitting.value = false
  }
}

// Edit mode: Prefill the form
async function loadMemberForEdit() {
  if (!isEditMode.value || !memberId.value) return
  try {
    const { data: member, error, pending: _pending } = await getMember(memberId.value)
    if (error.value || !member.value) {
      let errorMessage = 'Failed to load member'
      if (error.value) {
        const val: unknown = error.value
        if (
          val &&
          typeof val === 'object' &&
          'message' in val &&
          typeof (val as { message: unknown }).message === 'string'
        ) {
          errorMessage = (val as { message: string }).message
        }
      }
      throw new Error(errorMessage)
    }

    // Map API response to form
    const memberData = member.value.data
    if (!memberData) {
      throw new Error('No member data found')
    }
    state.title = memberData.title || ''
    state.nameFamily = memberData.nameFamily
    state.nameMiddle = memberData.nameMiddle || ''
    state.nameFirst = memberData.nameFirst
    state.sex = memberData.sex || ''
    state.dob = memberData.dob || ''
    state.address = memberData.address || ''
    state.state = memberData.state || ''
    state.telephone = memberData.telephone || ''
    state.fax = memberData.fax || ''
    state.email = memberData.email
    state.avatar = memberData.avatar || ''
    state.position = memberData.position || ''
    state.department = memberData.department || ''
    state.employer = memberData.employer || ''
    state.qualifications = memberData.qualifications || ''
    state.experience = memberData.experience || ''
    state.motherTongue = memberData.motherTongue || ''
    state.otherLanguages = memberData.otherLanguages || []
    state.otherLanguageText = memberData.otherLanguageText || ''
    state.expertiseDescription = memberData.expertiseDescription || ''
    state.expertise = memberData.expertise || []
    state.expertiseOther = memberData.expertiseOther || ''
    state.agency = memberData.agency || ''
    state.typeOfWork = memberData.typeOfWork || ''
    state.typeOfWorkOther = memberData.typeOfWorkOther || ''
  } catch (e) {
    console.error('Failed to prefill member', e)
    let errorMessage = 'Could not load member details'

    if (e instanceof Error) {
      if (e.message.includes('not found')) {
        errorMessage = 'Member not found. Please check the URL and try again.'
      } else if (e.message.includes('unauthorized') || e.message.includes('forbidden')) {
        errorMessage = "You do not have permission to view this member's information."
      } else if (e.message.includes('network') || e.message.includes('fetch')) {
        errorMessage = 'Unable to connect to the server. Please check your internet connection.'
      }
    }

    toast.add({
      title: 'Load Error',
      description: errorMessage,
      color: 'warning',
    })
  }
}

// Watch for membership type changes and update state
watch(
  [membershipType, amountNaira],
  ([newType, newAmount]) => {
    state.membershipType = newType
    state.fees = newAmount
  },
  { immediate: true }
)

onMounted(() => {
  if (isEditMode.value) loadMemberForEdit()
})
</script>

<style>
/* Hide scrollbar but keep scroll functionality */
.no-scrollbar {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}
.no-scrollbar::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Opera */
}
</style>
