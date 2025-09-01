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
          <UForm :state="form" class="space-y-8" @submit="submitApplication">
            <!-- Stepper -->
            <div ref="stepperRef" class="overflow-x-auto no-scrollbar">
              <div class="min-w-max inline-flex items-center gap-4">
                <template v-for="(s, i) in steps" :key="s.key">
                  <div class="inline-flex items-center gap-4 shrink-0">
                    <button
                      :ref="el => el && (stepEls[i] = el as HTMLElement)"
                      type="button"
                      class="inline-flex items-center gap-3 group shrink-0"
                      @click="goToStep(i + 1)"
                    >
                      <span
                        :class="[
                          'h-8 w-8 rounded-full flex items-center justify-center text-sm font-semibold',
                          currentStep === i + 1
                            ? 'bg-primary-600 text-white'
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300',
                        ]"
                      >
                        {{ i + 1 }}
                      </span>
                      <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {{ s.label }}
                      </span>
                    </button>
                    <div
                      v-if="i < steps.length - 1"
                      class="h-0.5 w-10 bg-gray-200 dark:bg-gray-700"
                    />
                  </div>
                </template>
              </div>
            </div>

            <!-- Section 1: Personal Information -->
            <div v-show="currentStep === 1" class="space-y-6">
              <h3 class="text-base font-medium text-gray-900 dark:text-white">
                Personal Information
              </h3>

              <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <UFormField label="Family Name" name="nameFamily" required>
                  <UInput v-model="form.nameFamily" class="w-full" />
                </UFormField>
                <UFormField label="Middle Name" name="nameMiddle">
                  <UInput v-model="form.nameMiddle" class="w-full" />
                </UFormField>
                <UFormField label="First Name" name="nameFirst" required>
                  <UInput v-model="form.nameFirst" class="w-full" />
                </UFormField>
              </div>

              <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <UFormField label="Title" name="title" required>
                  <USelect
                    v-model="form.title"
                    :items="titles"
                    placeholder="Select title"
                    class="w-full"
                  />
                </UFormField>

                <UFormField label="Sex" name="sex" required>
                  <URadioGroup
                    v-model="form.sex"
                    orientation="horizontal"
                    variant="list"
                    :items="[
                      { label: 'Male', value: 'Male' },
                      { label: 'Female', value: 'Female' },
                    ]"
                  />
                </UFormField>

                <UFormField label="Date of Birth" name="dob" required>
                  <UInput v-model="form.dob" type="date" class="w-full" />
                </UFormField>
              </div>

              <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <UFormField label="Telephone" name="telephone" required>
                  <UInput v-model="form.telephone" class="w-full" />
                </UFormField>
                <UFormField label="Fax" name="fax">
                  <UInput v-model="form.fax" class="w-full" />
                </UFormField>
                <UFormField label="Email" name="email" required>
                  <UInput v-model="form.email" type="email" class="w-full" @input="onEmailInput" />
                </UFormField>
              </div>

              <UFormField
                label="Present Mailing Address"
                name="address"
                hint="Include Postal/Zip Code, City, Country"
                required
              >
                <UTextarea v-model="form.address" :rows="3" class="w-full" />
              </UFormField>
            </div>

            <!-- Section 2: Employment & Education -->
            <div v-show="currentStep === 2" class="space-y-6">
              <h3 class="text-base font-medium text-gray-900 dark:text-white">
                Employment & Education
              </h3>

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

              <UFormField
                label="Major Publications (up to 5 files)"
                name="publications"
                hint="Optional"
              >
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
                        <span class="font-medium text-gray-900 dark:text-white"
                          >Click to upload</span
                        >
                        or drag and drop
                      </div>
                      <div class="text-xs text-gray-500">
                        PDF, DOC, DOCX, PNG, JPG up to 10MB each
                      </div>
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
                          <p
                            class="font-medium text-gray-900 dark:text-white truncate max-w-[40ch]"
                          >
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

            <!-- Section 3: Languages -->
            <div v-show="currentStep === 3" class="space-y-6">
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
                    :model-value="form.otherLanguages.includes(lang)"
                    @update:model-value="val => toggleLanguage(lang, val === true)"
                  />
                </div>
                <div class="mt-3">
                  <UCheckbox v-model="otherLanguageChecked" label="Others" />
                  <div v-if="otherLanguageChecked" class="mt-2">
                    <UInput
                      v-model="form.otherLanguageText"
                      placeholder="Specify other languages"
                    />
                  </div>
                </div>
              </UFormField>
            </div>

            <!-- Section 4: Areas of Expertise -->
            <div v-show="currentStep === 4" class="space-y-6">
              <h3 class="text-base font-medium text-gray-900 dark:text-white">
                Areas of Expertise
              </h3>

              <UFormField
                label="Describe areas of expertise (3–4 major fields)"
                name="expertiseDescription"
              >
                <UTextarea v-model="form.expertiseDescription" :rows="3" class="w-full" />
              </UFormField>

              <UFormField label="Select up to 5 areas" name="expertise">
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  <UCheckbox
                    v-for="opt in expertiseOptions"
                    :key="opt"
                    :label="opt"
                    :value="opt"
                    :model-value="form.expertise.includes(opt)"
                    @update:model-value="val => onToggleExpertise(opt, val === true)"
                  />
                </div>
                <p class="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  Selected: {{ form.expertise.length }}/5
                </p>
                <div class="mt-3">
                  <UInput v-model="form.expertiseOther" placeholder="Others (specify)" />
                </div>
              </UFormField>
            </div>

            <!-- Section 5: Employment Classification -->
            <div v-show="currentStep === 5" class="space-y-6">
              <h3 class="text-base font-medium text-gray-900 dark:text-white">
                Employment Classification
              </h3>
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

            <!-- Section 6: Payment -->
            <div v-show="currentStep === 6" class="space-y-6">
              <h3 class="text-base font-medium text-gray-900 dark:text-white">Payment</h3>

              <div
                class="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50/60 dark:bg-gray-800/50 p-4"
              >
                <p class="text-sm text-gray-700 dark:text-gray-300">
                  Review your details and proceed to payment to complete your membership
                  application.
                </p>
              </div>

              <div class="rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-sm text-gray-500">Application</p>
                    <p class="text-base font-semibold text-gray-900 dark:text-white">
                      Membership Fee
                    </p>
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
              <!-- Pay handled on submit button below -->
            </div>

            <!-- Navigation -->
            <div class="pt-4 flex items-center justify-between">
              <UButton
                color="neutral"
                variant="outline"
                :disabled="currentStep === 1"
                @click="prevStep"
              >
                Back
              </UButton>
              <div class="flex items-center gap-3">
                <UButton v-if="currentStep < steps.length" color="primary" @click="nextStep">
                  Next
                </UButton>
                <UButton
                  v-else
                  type="submit"
                  color="primary"
                  :loading="isSubmitting"
                  :disabled="isSubmitting"
                >
                  Pay & Submit
                </UButton>
              </div>
            </div>
          </UForm>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })

useHead({
  title: 'Apply for Membership - EPISON',
  meta: [
    {
      name: 'description',
      content:
        'Apply for membership with the Epidemiological Society of Nigeria (EPISON) and join our community of public health professionals.',
    },
  ],
})

const toast = useToast()
const router = useRouter()
const isSubmitting = ref(false)

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

const steps = [
  { key: 'personal', label: 'Personal' },
  { key: 'employment', label: 'Employment' },
  { key: 'languages', label: 'Languages' },
  { key: 'expertise', label: 'Expertise' },
  { key: 'classification', label: 'Classification' },
  { key: 'payment', label: 'Payment' },
]

const currentStep = ref(1)
const titles = ['Dr', 'Mr', 'Mrs', 'Miss', 'Prof', 'Engr', 'Chief', 'Ms']
const otherLanguages = ['English', 'French', 'German', 'Spanish', 'Russian', 'Japanese', 'Arabic']
const otherLanguageChecked = ref(false)

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

const form = reactive({
  // Section 1
  title: 'Dr',
  nameFamily: '',
  nameMiddle: '',
  nameFirst: '',
  sex: '',
  dob: '',
  address: '',
  telephone: '',
  fax: '',
  email: '',

  // Section 2
  position: '',
  employer: '',
  department: '',
  qualifications: '',
  experience: '',
  publications: [] as File[],

  // Section 3
  motherTongue: '',
  otherLanguages: [] as string[],
  otherLanguageText: '',

  // Section 4
  expertiseDescription: '',
  expertise: [] as string[],
  expertiseOther: '',

  // Section 5
  agency: 'Industry',
  typeOfWork: 'Clinical',
  typeOfWorkOther: '',
  retiredSince: '',

  // Section 6 (no extra fields; Paystack inline only)
})

// ... rest of the code remains the same ...

// File helpers for publications
function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`
}

function removePublication(index: number) {
  if (index >= 0 && index < form.publications.length) {
    form.publications.splice(index, 1)
  }
}

// Using UFileUpload slot's open() to trigger file dialog; no extra ref needed

// Payment: compute amount based on membership type from query
const route = useRoute()
const feeMap: Record<string, number> = {
  regular: 30000,
  'regular iea': 50000,
  'early-career': 15000,
  'early-career iea': 20000,
}
const membershipType = computed(() => String((route.query.type as string) || '').toLowerCase())
const amountNaira = computed(() => feeMap[membershipType.value] ?? 0)

function formatNaira(n: number) {
  return new Intl.NumberFormat('en-NG').format(n)
}

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
      if (!form.email) {
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
        email: form.email,
        amount: amount * 100, // kobo
        ref,
        metadata: {
          custom_fields: [
            {
              display_name: 'Membership Type',
              variable_name: 'membership_type',
              value: membershipType.value || 'unspecified',
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
  () => form.publications,
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
      form.publications = sizeFiltered
    }
  },
  { deep: true }
)

function toggleLanguage(language: string, checked: boolean) {
  if (checked) {
    if (!form.otherLanguages.includes(language)) {
      form.otherLanguages.push(language)
    }
  } else {
    const index = form.otherLanguages.indexOf(language)
    if (index > -1) {
      form.otherLanguages.splice(index, 1)
    }
  }
}

function onToggleExpertise(opt: string, checked: boolean) {
  const exists = form.expertise.includes(opt)
  if (checked && !exists) {
    if (form.expertise.length >= 5) {
      toast.add({
        title: 'Selection limit',
        description: 'You can select up to 5 areas of expertise.',
        color: 'warning',
      })
      return
    }
    form.expertise.push(opt)
  } else if (!checked && exists) {
    form.expertise = form.expertise.filter(x => x !== opt)
  }
}

function goToStep(n: number) {
  if (n >= 1 && n <= steps.length) currentStep.value = n
}
function nextStep() {
  if (currentStep.value < steps.length) currentStep.value += 1
}
function prevStep() {
  if (currentStep.value > 1) currentStep.value -= 1
}

function onEmailInput(e: Event) {
  const target = e.target as HTMLInputElement
  form.email = (target?.value || '').trim()
}

const submitApplication = async () => {
  isSubmitting.value = true
  try {
    // Start Paystack and wait for success
    const { reference } = await startPaystackPayment()

    // TODO: submit to API (include Paystack reference and form data)
    await new Promise(resolve => setTimeout(resolve, 1200))

    toast.add({
      title: 'Application Submitted',
      description: `We received your application and payment. Ref: ${reference}`,
      icon: 'i-heroicons-check-circle',
      color: 'success',
    })
    await router.push('/membership/success')
    return
  } catch (e) {
    // Payment cancelled or failed; keep user on the page
    console.error(e)
  } finally {
    isSubmitting.value = false
  }
}
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
