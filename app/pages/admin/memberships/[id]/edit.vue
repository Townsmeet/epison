<template>
  <div>
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center space-x-4">
        <UButton
          color="neutral"
          variant="ghost"
          icon="i-heroicons-arrow-left"
          @click="$router.back()"
        >
          Back
        </UButton>
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Edit Member</h1>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Update member information and membership details
          </p>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="pending" class="flex justify-center py-12">
      <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-primary-500" />
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-12">
      <UIcon name="i-heroicons-exclamation-triangle" class="w-12 h-12 text-red-500 mx-auto mb-4" />
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Member Not Found</h3>
      <p class="text-gray-500 dark:text-gray-400 mb-4">
        The member you're looking for doesn't exist or has been removed.
      </p>
      <UButton @click="$router.push('/admin/memberships')"> Back to Members </UButton>
    </div>

    <!-- Edit Form -->
    <div v-else-if="member" class="max-w-4xl">
      <UCard>
        <template #header>
          <h3 class="text-lg font-semibold">Member Information</h3>
        </template>

        <UForm :state="formData" class="space-y-6" @submit="updateMember">
          <!-- Personal Information Section -->
          <div>
            <h4 class="text-sm font-semibold text-gray-900 dark:text-white mb-4">
              Personal Information
            </h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <UFormField label="Full Name" required>
                <UInput
                  v-model="formData.name"
                  placeholder="Enter full name"
                  :disabled="isUpdating"
                />
              </UFormField>

              <UFormField label="Email Address" required>
                <UInput
                  v-model="formData.email"
                  type="email"
                  placeholder="Enter email address"
                  :disabled="isUpdating"
                />
              </UFormField>

              <UFormField label="Phone Number">
                <UInput
                  v-model="formData.phone"
                  placeholder="Enter phone number"
                  :disabled="isUpdating"
                />
              </UFormField>

              <UFormField label="Gender">
                <USelectMenu
                  v-model="formData.genderItem"
                  :items="genderOptions"
                  option-attribute="label"
                  value-attribute="value"
                  placeholder="Select gender"
                  :disabled="isUpdating"
                />
              </UFormField>

              <UFormField label="Organization" class="md:col-span-2">
                <UInput
                  v-model="formData.organization"
                  placeholder="Enter organization name"
                  :disabled="isUpdating"
                />
              </UFormField>

              <UFormField label="Bio" class="md:col-span-2">
                <UTextarea
                  v-model="formData.bio"
                  placeholder="Write a short bio"
                  :rows="3"
                  :disabled="isUpdating"
                />
              </UFormField>
            </div>
          </div>

          <!-- Membership Details Section -->
          <div class="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h4 class="text-sm font-semibold text-gray-900 dark:text-white mb-4">
              Membership Details
            </h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <UFormField label="Membership Type" required>
                <USelectMenu
                  v-model="formData.typeItem"
                  :items="membershipTypeOptions"
                  option-attribute="label"
                  value-attribute="value"
                  placeholder="Select membership type"
                  :disabled="isUpdating"
                />
              </UFormField>

              <UFormField label="Status" required>
                <USelectMenu
                  v-model="formData.statusItem"
                  :items="statusOptions"
                  option-attribute="label"
                  value-attribute="value"
                  placeholder="Select status"
                  :disabled="isUpdating"
                />
              </UFormField>

              <UFormField label="Join Date" required>
                <UInput v-model="formData.joinedDate" type="date" :disabled="isUpdating" />
              </UFormField>

              <UFormField label="Expiry Date" required>
                <UInput v-model="formData.expiryDate" type="date" :disabled="isUpdating" />
              </UFormField>

              <UFormField label="Membership Fees (₦)" required>
                <UInput
                  v-model="formData.fees"
                  type="number"
                  placeholder="Enter membership fees"
                  :disabled="isUpdating"
                />
              </UFormField>
            </div>
          </div>

          <!-- Form Actions -->
          <div
            class="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700"
          >
            <UButton color="neutral" variant="ghost" :disabled="isUpdating" @click="$router.back()">
              Cancel
            </UButton>
            <UButton type="submit" color="primary" :loading="isUpdating" :disabled="!canSubmit">
              Update Member
            </UButton>
          </div>
        </UForm>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
})

interface Member {
  id: number
  name: string
  email: string
  phone?: string
  type: string
  status: string
  joinedDate: string
  expiryDate: string
  fees: number
  organization: string
  gender?: string
  bio?: string
}

const route = useRoute()
const memberId = parseInt(route.params.id as string)
const isUpdating = ref(false)

const genderOptions = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
  { label: 'Other', value: 'other' },
  { label: 'Prefer not to say', value: 'not_specified' },
]

const membershipTypeOptions = [
  { label: 'Regular Membership (Joint IEA - EPiSON)', value: 'regular+iea' },
  { label: 'Regular Membership (EPiSON only)', value: 'regular' },
  { label: 'Early Career Membership (Joint IEA - EPiSON)', value: 'early-career+iea' },
  { label: 'Early Career Membership (EPiSON only)', value: 'early-career' },
]

const statusOptions = [
  { label: 'Active', value: 'active' },
  { label: 'Pending', value: 'pending' },
  { label: 'Expired', value: 'expired' },
  { label: 'Suspended', value: 'suspended' },
]

// Mock data - replace with actual API call
const {
  data: member,
  pending,
  error,
} = await useLazyAsyncData(`member-${memberId}`, async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500))

  // Mock member data
  const mockMembers: Member[] = [
    {
      id: 1,
      name: 'Dr. John Doe',
      email: 'john.doe@example.com',
      phone: '+234 801 234 5678',
      type: 'Regular Membership (EPiSON only)',
      status: 'active',
      joinedDate: '2023-01-15',
      expiryDate: '2024-01-15',
      fees: 30000,
      organization: 'Lagos University Teaching Hospital',
      gender: 'male',
      bio: 'Experienced epidemiologist with over 10 years in public health research and disease surveillance.',
    },
    {
      id: 2,
      name: 'Dr. Jane Smith',
      email: 'jane.smith@example.com',
      phone: '+234 802 345 6789',
      type: 'Regular Membership (Joint IEA - EPiSON)',
      status: 'active',
      joinedDate: '2023-03-20',
      expiryDate: '2024-03-20',
      fees: 50000,
      organization: 'University of Ibadan',
      gender: 'female',
      bio: 'Public health specialist focusing on infectious disease epidemiology and health policy.',
    },
    {
      id: 3,
      name: 'Michael Brown',
      email: 'michael.brown@student.edu',
      phone: '+234 803 456 7890',
      type: 'Early Career Membership (EPiSON only)',
      status: 'pending',
      joinedDate: '2024-08-01',
      expiryDate: '2025-08-01',
      fees: 15000,
      organization: 'University of Lagos',
      gender: 'male',
      bio: 'Graduate student in epidemiology with interest in environmental health and chronic disease prevention.',
    },
  ]

  const foundMember = mockMembers.find(m => m.id === memberId)
  if (!foundMember) {
    throw createError({ statusCode: 404, statusMessage: 'Member not found' })
  }

  return foundMember
})

// Form data
const formData = ref({
  name: '',
  email: '',
  phone: '',
  organization: '',
  bio: '',
  joinedDate: '',
  expiryDate: '',
  fees: '',
  genderItem: undefined as { label: string; value: string } | undefined,
  typeItem: undefined as { label: string; value: string } | undefined,
  statusItem: undefined as { label: string; value: string } | undefined,
})

// Initialize form data when member is loaded
watch(
  member,
  newMember => {
    if (newMember) {
      formData.value = {
        name: newMember.name,
        email: newMember.email,
        phone: newMember.phone || '',
        organization: newMember.organization,
        bio: newMember.bio || '',
        joinedDate: newMember.joinedDate,
        expiryDate: newMember.expiryDate,
        fees: newMember.fees.toString(),
        genderItem: genderOptions.find(g => g.value === newMember.gender),
        typeItem: membershipTypeOptions.find(t => t.label === newMember.type),
        statusItem: statusOptions.find(s => s.value === newMember.status),
      }
    }
  },
  { immediate: true }
)

const canSubmit = computed(() => {
  return (
    formData.value.name.trim() &&
    formData.value.email.trim() &&
    formData.value.organization.trim() &&
    formData.value.joinedDate &&
    formData.value.expiryDate &&
    formData.value.fees &&
    formData.value.typeItem &&
    formData.value.statusItem
  )
})

async function updateMember() {
  if (!canSubmit.value) return

  isUpdating.value = true

  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    useToast().add({
      title: 'Member updated',
      description: 'Member information has been updated successfully',
      color: 'success',
    })

    // Navigate back to member detail page
    navigateTo(`/admin/memberships/${memberId}`)
  } catch {
    useToast().add({
      title: 'Update failed',
      description: 'Failed to update member information',
      color: 'error',
    })
  } finally {
    isUpdating.value = false
  }
}
</script>
