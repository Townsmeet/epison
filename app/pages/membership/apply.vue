<template>
  <div class="py-12 bg-white dark:bg-gray-900">
    <div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
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
          <UForm :state="form" class="space-y-6" @submit="submitApplication">
            <!-- Personal Information -->
            <div class="space-y-4">
              <h3 class="text-base font-medium text-gray-900 dark:text-white">
                Personal Information
              </h3>

              <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <UFormGroup label="First Name" name="firstName" required>
                  <UInput v-model="form.firstName" />
                </UFormGroup>

                <UFormGroup label="Last Name" name="lastName" required>
                  <UInput v-model="form.lastName" />
                </UFormGroup>
              </div>

              <UFormGroup label="Email Address" name="email" required>
                <UInput v-model="form.email" type="email" />
              </UFormGroup>

              <UFormGroup label="Phone Number" name="phone" required>
                <UInput v-model="form.phone" type="tel" />
              </UFormGroup>

              <UFormGroup label="Date of Birth" name="dob" required>
                <UPopover :popper="{ placement: 'bottom-start' }">
                  <UButton
                    color="neutral"
                    :label="form.dob ? dayjs(form.dob).format('D MMM, YYYY') : 'Select date'"
                    icon="i-heroicons-calendar"
                    trailing-icon="i-heroicons-chevron-down"
                  />
                  <template #panel="{ close }">
                    <DatePicker v-model="form.dob" is-required @close="close" />
                  </template>
                </UPopover>
              </UFormGroup>
            </div>

            <!-- Address Information -->
            <div class="pt-6 border-t border-gray-200 dark:border-gray-700 space-y-4">
              <h3 class="text-base font-medium text-gray-900 dark:text-white">
                Address Information
              </h3>

              <UFormGroup label="Address Line 1" name="address1" required>
                <UInput v-model="form.address1" />
              </UFormGroup>

              <UFormGroup label="Address Line 2 (Optional)" name="address2">
                <UInput v-model="form.address2" />
              </UFormGroup>

              <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <UFormGroup label="City" name="city" required>
                  <UInput v-model="form.city" />
                </UFormGroup>

                <UFormGroup label="State" name="state" required>
                  <USelect
                    v-model="form.state"
                    :options="nigerianStates"
                    placeholder="Select state"
                  />
                </UFormGroup>

                <UFormGroup label="Postal Code" name="postalCode" required>
                  <UInput v-model="form.postalCode" />
                </UFormGroup>
              </div>

              <UFormGroup label="Country" name="country" required>
                <USelect v-model="form.country" :options="['Nigeria']" disabled />
              </UFormGroup>
            </div>

            <!-- Professional Information -->
            <div class="pt-6 border-t border-gray-200 dark:border-gray-700 space-y-4">
              <h3 class="text-base font-medium text-gray-900 dark:text-white">
                Professional Information
              </h3>

              <UFormGroup label="Profession" name="profession" required>
                <UInput v-model="form.profession" />
              </UFormGroup>

              <UFormGroup label="Current Position" name="position" required>
                <UInput v-model="form.position" />
              </UFormGroup>

              <UFormGroup label="Organization" name="organization" required>
                <UInput v-model="form.organization" />
              </UFormGroup>

              <UFormGroup
                v-if="form.membershipType === 'student'"
                label="Institution"
                name="institution"
                required
              >
                <UInput v-model="form.institution" />
              </UFormGroup>

              <UFormGroup
                v-if="form.membershipType === 'student'"
                label="Student ID"
                name="studentId"
                required
              >
                <UInput v-model="form.studentId" />
              </UFormGroup>

              <UFormGroup
                v-if="form.membershipType === 'student'"
                label="Expected Graduation Year"
                name="graduationYear"
                required
              >
                <UInput v-model="form.graduationYear" type="number" />
              </UFormGroup>

              <UFormGroup
                v-if="form.membershipType === 'institutional'"
                label="Number of Staff to Register"
                name="staffCount"
                required
              >
                <UInput v-model="form.staffCount" type="number" min="1" max="5" />
              </UFormGroup>

              <UFormGroup
                v-if="form.membershipType === 'institutional'"
                label="Organization Website"
                name="website"
                required
              >
                <UInput v-model="form.website" type="url" />
              </UFormGroup>
            </div>

            <!-- Payment Information -->
            <div class="pt-6 border-t border-gray-200 dark:border-gray-700 space-y-4">
              <h3 class="text-base font-medium text-gray-900 dark:text-white">
                Payment Information
              </h3>

              <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <div class="flex justify-between">
                  <span class="text-sm font-medium text-gray-700 dark:text-gray-300"
                    >Membership Type</span
                  >
                  <span class="text-sm text-gray-900 dark:text-white capitalize"
                    >{{ form.membershipType }} Membership</span
                  >
                </div>
                <div class="mt-2 flex justify-between">
                  <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Amount</span>
                  <span class="text-sm font-medium text-gray-900 dark:text-white">
                    {{ formatCurrency(calculateAmount()) }}
                  </span>
                </div>
                <div
                  v-if="form.membershipType === 'institutional'"
                  class="mt-2 flex justify-between"
                >
                  <span class="text-sm font-medium text-gray-700 dark:text-gray-300"
                    >Staff Members ({{ form.staffCount || 1 }})</span
                  >
                  <span class="text-sm text-gray-900 dark:text-white"
                    >x {{ form.staffCount || 1 }}</span
                  >
                </div>
                <div
                  class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600 flex justify-between"
                >
                  <span class="text-base font-bold text-gray-900 dark:text-white">Total</span>
                  <span class="text-base font-bold text-primary-600 dark:text-primary-400">
                    {{ formatCurrency(calculateTotal()) }}
                  </span>
                </div>
              </div>

              <UFormGroup label="Payment Method" name="paymentMethod" required>
                <USelect
                  v-model="form.paymentMethod"
                  :options="['Bank Transfer', 'Credit/Debit Card', 'Paystack', 'Flutterwave']"
                  placeholder="Select payment method"
                />
              </UFormGroup>

              <div
                v-if="form.paymentMethod === 'Bank Transfer'"
                class="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg"
              >
                <h4 class="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                  Bank Transfer Details
                </h4>
                <div class="mt-2 space-y-1 text-sm text-yellow-700 dark:text-yellow-300">
                  <p>Bank: <span class="font-mono">Guaranty Trust Bank (GTB)</span></p>
                  <p>
                    Account Name: <span class="font-mono">Epidemiological Society of Nigeria</span>
                  </p>
                  <p>Account Number: <span class="font-mono">0123456789</span></p>
                  <p class="mt-2">
                    Please use your full name as reference when making the transfer.
                  </p>
                </div>
              </div>
            </div>

            <!-- Terms and Conditions -->
            <div class="pt-6 border-t border-gray-200 dark:border-gray-700">
              <UFormGroup name="terms" required>
                <UCheckbox
                  v-model="form.terms"
                  label="I agree to the terms and conditions and privacy policy"
                />
              </UFormGroup>

              <UFormGroup name="newsletter" class="mt-4">
                <UCheckbox
                  v-model="form.newsletter"
                  label="Subscribe to our newsletter for updates and announcements"
                />
              </UFormGroup>
            </div>

            <!-- Submit Button -->
            <div class="pt-6">
              <UButton
                type="submit"
                color="primary"
                size="lg"
                :loading="isSubmitting"
                :disabled="isSubmitting"
                block
              >
                {{ isSubmitting ? 'Submitting...' : 'Submit Application' }}
              </UButton>

              <p class="mt-3 text-center text-sm text-gray-500 dark:text-gray-400">
                By submitting this form, you agree to our
                <NuxtLink
                  to="/privacy"
                  class="text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
                >
                  Privacy Policy
                </NuxtLink>
                and
                <NuxtLink
                  to="/terms"
                  class="text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
                >
                  Terms of Service </NuxtLink
                >.
              </p>
            </div>
          </UForm>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'

definePageMeta({
  layout: 'default',
})

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

const route = useRoute()
const toast = useToast()
const isSubmitting = ref(false)

// Initialize form with default values
const form = reactive({
  // Personal Information
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  dob: new Date(new Date().setFullYear(new Date().getFullYear() - 25)),

  // Address Information
  address1: '',
  address2: '',
  city: '',
  state: '',
  postalCode: '',
  country: 'Nigeria',

  // Professional Information
  profession: '',
  position: '',
  organization: '',
  membershipType: 'regular',
  institution: '',
  studentId: '',
  graduationYear: new Date().getFullYear() + 1,
  staffCount: 1,
  website: '',

  // Payment Information
  paymentMethod: '',

  // Terms
  terms: false,
  newsletter: true,
})

// Set membership type from URL query parameter
if (route.query.type) {
  form.membershipType = route.query.type.toString()
}

// Nigerian states for the dropdown
const nigerianStates = [
  'Abia',
  'Adamawa',
  'Akwa Ibom',
  'Anambra',
  'Bauchi',
  'Bayelsa',
  'Benue',
  'Borno',
  'Cross River',
  'Delta',
  'Ebonyi',
  'Edo',
  'Ekiti',
  'Enugu',
  'Gombe',
  'Imo',
  'Jigawa',
  'Kaduna',
  'Kano',
  'Katsina',
  'Kebbi',
  'Kogi',
  'Kwara',
  'Lagos',
  'Nasarawa',
  'Niger',
  'Ogun',
  'Ondo',
  'Osun',
  'Oyo',
  'Plateau',
  'Rivers',
  'Sokoto',
  'Taraba',
  'Yobe',
  'Zamfara',
  'FCT',
]

// Calculate membership amount based on type
const calculateAmount = () => {
  switch (form.membershipType) {
    case 'student':
      return 10000
    case 'institutional':
      return 100000
    case 'regular':
    default:
      return 25000
  }
}

// Calculate total amount (for institutional members)
const calculateTotal = () => {
  const amount = calculateAmount()
  if (form.membershipType === 'institutional') {
    return amount * (form.staffCount || 1)
  }
  return amount
}

// Format currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

// Form submission
const submitApplication = async () => {
  isSubmitting.value = true

  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Show success message
    toast.add({
      title: 'Application Submitted',
      description:
        'Thank you for applying to EPISON. We will review your application and get back to you soon.',
      icon: 'i-heroicons-check-circle',
      color: 'primary',
    })

    // Reset form
    Object.assign(form, {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address1: '',
      address2: '',
      city: '',
      state: '',
      postalCode: '',
      profession: '',
      position: '',
      organization: '',
      terms: false,
      paymentMethod: '',
    })

    // Redirect to success page or dashboard
    navigateTo('/membership/success')
  } catch (error) {
    console.error('Error submitting application:', error)
    toast.add({
      title: 'Error',
      description: 'There was an error submitting your application. Please try again.',
      icon: 'i-heroicons-exclamation-circle',
      color: 'error',
    })
  } finally {
    isSubmitting.value = false
  }
}
</script>
