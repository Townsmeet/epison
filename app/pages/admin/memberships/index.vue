<template>
  <div>
    <!-- Action buttons -->
    <div class="flex justify-end space-x-3 mb-6">
      <UButton
        color="neutral"
        variant="outline"
        icon="i-heroicons-arrow-down-tray"
        @click="exportMemberships"
      >
        Export
      </UButton>
      <UButton color="primary" icon="i-heroicons-plus" @click="isCreateMembershipOpen = true">
        Add Member
      </UButton>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div
              class="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center"
            >
              <UIcon name="i-heroicons-users" class="w-5 h-5 text-blue-600 dark:text-blue-300" />
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Total Members</p>
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">
              {{ membershipStats.total }}
            </p>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div
              class="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center"
            >
              <UIcon
                name="i-heroicons-check-circle"
                class="w-5 h-5 text-green-600 dark:text-green-300"
              />
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Active</p>
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">
              {{ membershipStats.active }}
            </p>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div
              class="w-8 h-8 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center"
            >
              <UIcon
                name="i-heroicons-clock"
                class="w-5 h-5 text-yellow-600 dark:text-yellow-300"
              />
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Pending</p>
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">
              {{ membershipStats.pending }}
            </p>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div
              class="w-8 h-8 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center"
            >
              <UIcon
                name="i-heroicons-exclamation-triangle"
                class="w-5 h-5 text-red-600 dark:text-red-300"
              />
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Inactive</p>
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">
              {{ membershipStats.expiringSoon }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <UInput
          v-model="searchQuery"
          placeholder="Search members..."
          icon="i-heroicons-magnifying-glass"
        />
        <USelectMenu
          v-model="selectedTypeItem"
          :items="membershipTypeOptions"
          option-attribute="label"
          value-attribute="value"
          placeholder="Filter by type"
          :popper="{ strategy: 'fixed', placement: 'bottom-start' }"
        />
        <USelectMenu
          v-model="selectedStatusItem"
          :items="statusOptions"
          option-attribute="label"
          value-attribute="value"
          placeholder="Filter by status"
          :popper="{ strategy: 'fixed', placement: 'bottom-start' }"
        />
        <UButton color="neutral" variant="outline" icon="i-heroicons-funnel" @click="clearFilters">
          Clear Filters
        </UButton>
      </div>
    </div>

    <!-- Memberships Table -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                Member
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                Type
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                Joined
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                Fees
              </th>
              <th class="relative px-6 py-3">
                <span class="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr
              v-for="member in filteredMemberships"
              :key="member.id"
              class="hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10">
                    <div
                      class="h-10 w-10 rounded-full bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center"
                    >
                      <span class="text-white font-semibold text-sm">{{
                        getInitials(member.name)
                      }}</span>
                    </div>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900 dark:text-white">
                      {{ member.name }}
                    </div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">{{ member.email }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <UBadge :color="getTypeColor(member.type)" size="sm">{{
                  typeLabelFromValue(typeValueFromLabel(member.type))
                }}</UBadge>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <UBadge :color="getStatusColor(member.status)" size="sm">{{
                  member.status
                }}</UBadge>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {{ formatDate(member.joinedDate) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                ₦{{ member.fees.toLocaleString() }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <UDropdownMenu :items="getMemberMenuItems(member)">
                  <UButton
                    color="neutral"
                    variant="ghost"
                    icon="i-heroicons-ellipsis-horizontal"
                    size="sm"
                  />
                </UDropdownMenu>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Create Membership Modal -->
    <UModal v-model:open="isCreateMembershipOpen">
      <template #content>
        <div class="h-[85vh] max-h-[85vh] flex flex-col">
          <UCard
            class="h-full flex flex-col"
            :ui="{
              body: 'flex-1 overflow-y-auto',
              header: 'sticky top-0 z-10 bg-white/90 dark:bg-gray-900/90 backdrop-blur',
              footer: 'sticky bottom-0 z-10 bg-white/90 dark:bg-gray-900/90 backdrop-blur',
            }"
          >
            <template #header>
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="text-lg font-semibold">Add New Member</h3>
                  <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Step {{ currentStep }} of 2:
                    {{ currentStep === 1 ? 'Personal Information' : 'Membership Details' }}
                  </p>
                </div>
                <UButton
                  color="neutral"
                  variant="ghost"
                  icon="i-heroicons-x-mark"
                  @click="closeModal"
                />
              </div>

              <!-- Progress Bar -->
              <div class="mt-4">
                <div class="flex items-center">
                  <div class="flex items-center flex-1">
                    <div class="flex items-center text-sm">
                      <div
                        class="flex items-center justify-center w-8 h-8 rounded-full border-2 transition-colors"
                        :class="
                          currentStep >= 1
                            ? 'bg-primary-500 border-primary-500 text-white'
                            : 'border-gray-300 text-gray-500'
                        "
                      >
                        <UIcon v-if="currentStep > 1" name="i-heroicons-check" class="w-4 h-4" />
                        <span v-else>1</span>
                      </div>
                      <span
                        class="ml-2 font-medium"
                        :class="
                          currentStep >= 1
                            ? 'text-primary-600 dark:text-primary-400'
                            : 'text-gray-500'
                        "
                      >
                        Personal Info
                      </span>
                    </div>
                    <div
                      class="flex-1 h-0.5 mx-4 transition-colors"
                      :class="currentStep >= 2 ? 'bg-primary-500' : 'bg-gray-300'"
                    />
                    <div class="flex items-center text-sm">
                      <div
                        class="flex items-center justify-center w-8 h-8 rounded-full border-2 transition-colors"
                        :class="
                          currentStep >= 2
                            ? 'bg-primary-500 border-primary-500 text-white'
                            : 'border-gray-300 text-gray-500'
                        "
                      >
                        <span>2</span>
                      </div>
                      <span
                        class="ml-2 font-medium"
                        :class="
                          currentStep >= 2
                            ? 'text-primary-600 dark:text-primary-400'
                            : 'text-gray-500'
                        "
                      >
                        Membership Details
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </template>

            <div class="min-h-[400px] pr-1 pb-24">
              <!-- Step 1: Personal Information -->
              <div v-if="currentStep === 1" class="space-y-6">
                <div>
                  <h4 class="text-sm font-semibold text-gray-900 dark:text-white mb-4">
                    Personal Information
                  </h4>
                  <div class="space-y-4">
                    <UFormField label="Full Name" required>
                      <UInput
                        v-model="newMembership.fullName"
                        placeholder="Enter full name"
                        class="w-full"
                      />
                    </UFormField>

                    <UFormField label="Gender">
                      <URadioGroup
                        v-model="newMembership.gender"
                        orientation="horizontal"
                        variant="list"
                        :items="genderItems"
                      />
                    </UFormField>

                    <UFormField label="Email Address" required>
                      <UInput
                        v-model="newMembership.email"
                        type="email"
                        placeholder="Enter email address"
                        class="w-full"
                      />
                    </UFormField>

                    <UFormField label="Phone Number">
                      <UInput
                        v-model="newMembership.phone"
                        placeholder="Enter phone number"
                        class="w-full"
                      />
                    </UFormField>

                    <UFormField label="Organization">
                      <UInput
                        v-model="newMembership.organization"
                        placeholder="Enter organization name"
                        class="w-full"
                      />
                    </UFormField>

                    <UFormField label="Brief Bio">
                      <UTextarea
                        v-model="newMembership.bio"
                        placeholder="Write a short bio"
                        class="w-full"
                        :rows="3"
                      />
                    </UFormField>
                  </div>
                </div>
              </div>

              <!-- Step 2: Membership Details -->
              <div v-else-if="currentStep === 2" class="space-y-6">
                <div>
                  <h4 class="text-sm font-semibold text-gray-900 dark:text-white mb-4">
                    Membership Details
                  </h4>
                  <div class="space-y-4">
                    <UFormField label="Membership Type" required>
                      <USelectMenu
                        v-model="newMembership.typeItem"
                        :items="membershipTypeOptions.filter(t => t.value !== 'all')"
                        option-attribute="label"
                        value-attribute="value"
                        placeholder="Select membership type"
                        :popper="{ strategy: 'fixed', placement: 'bottom-start' }"
                        class="w-full"
                      />
                    </UFormField>

                    <UFormField label="Status" required>
                      <USelectMenu
                        v-model="newMembership.statusItem"
                        :items="statusOptions.filter(s => s.value !== 'all')"
                        option-attribute="label"
                        value-attribute="value"
                        placeholder="Select status"
                        :popper="{ strategy: 'fixed', placement: 'bottom-start' }"
                        class="w-full"
                      />
                    </UFormField>

                    <UFormField label="Join Date" required>
                      <UInput v-model="newMembership.joinDate" type="date" class="w-full" />
                    </UFormField>

                    <UFormField label="Membership Fees (₦)" required>
                      <UInput
                        v-model="newMembership.fees"
                        type="number"
                        placeholder="Enter membership fees"
                        class="w-full"
                      />
                    </UFormField>
                  </div>
                </div>
              </div>
            </div>

            <template #footer>
              <div class="flex justify-between">
                <div>
                  <UButton
                    v-if="currentStep > 1"
                    color="neutral"
                    variant="ghost"
                    icon="i-heroicons-arrow-left"
                    @click="previousStep"
                  >
                    Previous
                  </UButton>
                </div>

                <div class="flex space-x-3">
                  <UButton color="neutral" variant="ghost" @click="closeModal"> Cancel </UButton>

                  <UButton
                    v-if="currentStep < 2"
                    color="primary"
                    trailing-icon="i-heroicons-arrow-right"
                    :disabled="!canProceedToStep2"
                    @click="nextStep"
                  >
                    Next
                  </UButton>

                  <UButton
                    v-else
                    color="primary"
                    :loading="isCreating"
                    :disabled="!canSubmit"
                    @click="createMembership"
                  >
                    Add Member
                  </UButton>
                </div>
              </div>
            </template>
          </UCard>
        </div>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import type { RadioGroupItem, DropdownMenuItem } from '@nuxt/ui'

definePageMeta({
  layout: 'admin',
})

// Local types
interface Member {
  id: number
  name: string
  email: string
  type: string
  status: string
  joinedDate: string
  expiryDate: string
  fees: number
  organization: string
}

const isCreateMembershipOpen = ref(false)
const isCreating = ref(false)
const searchQuery = ref('')
const selectedTypeItem = ref<{ label: string; value: string } | undefined>(undefined)
const selectedStatusItem = ref<{ label: string; value: string } | undefined>(undefined)

// Wizard state
const currentStep = ref(1)

const genderItems = ref<RadioGroupItem[]>([
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
])

const membershipTypeOptions = [
  { label: 'All Types', value: 'all' },
  { label: 'Regular Membership (Joint IEA - EPiSON)', value: 'regular+iea' },
  { label: 'Regular Membership (EPiSON only)', value: 'regular' },
  { label: 'Early Career Membership (Joint IEA - EPiSON)', value: 'early-career+iea' },
  { label: 'Early Career Membership (EPiSON only)', value: 'early-career' },
]

const statusOptions = [
  { label: 'All Status', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Pending', value: 'pending' },
  { label: 'Expired', value: 'expired' },
  { label: 'Suspended', value: 'suspended' },
]

const newMembership = ref({
  fullName: '',
  email: '',
  type: '',
  status: 'pending',
  typeItem: undefined as { label: string; value: string } | undefined,
  statusItem: undefined as { label: string; value: string } | undefined,
  gender: '',
  phone: '',
  organization: '',
  bio: '',
  joinDate: '',
  fees: '',
})

const membershipStats = ref({
  total: 856,
  active: 734,
  pending: 45,
  expiringSoon: 23,
})

// Set default status selection when the modal opens (after refs are initialized)
watch(isCreateMembershipOpen, open => {
  if (open) {
    const pending = statusOptions.find(s => s.value === 'pending')
    newMembership.value.statusItem = pending
      ? { label: pending.label, value: pending.value }
      : undefined
  }
})

// Mock memberships data
const memberships = ref<Member[]>([
  {
    id: 1,
    name: 'Dr. John Doe',
    email: 'john.doe@example.com',
    type: 'Regular Membership (EPiSON only)',
    status: 'active',
    joinedDate: '2023-01-15',
    expiryDate: '2024-01-15',
    fees: 30000,
    organization: 'Lagos University Teaching Hospital',
  },
  {
    id: 2,
    name: 'Dr. Jane Smith',
    email: 'jane.smith@example.com',
    type: 'Regular Membership (Joint IEA - EPiSON)',
    status: 'active',
    joinedDate: '2023-03-20',
    expiryDate: '2024-03-20',
    fees: 50000,
    organization: 'University of Ibadan',
  },
  {
    id: 3,
    name: 'Michael Brown',
    email: 'michael.brown@student.edu',
    type: 'Early Career Membership (EPiSON only)',
    status: 'pending',
    joinedDate: '2024-08-01',
    expiryDate: '2025-08-01',
    fees: 15000,
    organization: 'University of Lagos',
  },
])

const selectedTypeValue = computed(() => selectedTypeItem.value?.value ?? 'all')
const selectedStatusValue = computed(() => selectedStatusItem.value?.value ?? 'all')

function typeValueFromLabel(label: string): string {
  const found = membershipTypeOptions.find(o => o.label === label)
  return found ? found.value : label
}

function typeLabelFromValue(value: string): string {
  const found = membershipTypeOptions.find(o => o.value === value)
  return found ? found.label : value
}

const filteredMemberships = computed(() => {
  let filtered = memberships.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(
      member =>
        member.name.toLowerCase().includes(query) ||
        member.email.toLowerCase().includes(query) ||
        member.organization.toLowerCase().includes(query)
    )
  }

  if (selectedTypeValue.value !== 'all') {
    filtered = filtered.filter(
      member => typeValueFromLabel(member.type) === selectedTypeValue.value
    )
  }

  if (selectedStatusValue.value !== 'all') {
    filtered = filtered.filter(member => member.status === selectedStatusValue.value)
  }

  return filtered
})

function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
}

function getTypeColor(
  type: string
): 'neutral' | 'info' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' {
  const value = typeValueFromLabel(type)
  const colors: Record<
    string,
    'neutral' | 'info' | 'primary' | 'secondary' | 'success' | 'warning' | 'error'
  > = {
    'regular+iea': 'primary',
    regular: 'success',
    'early-career+iea': 'info',
    'early-career': 'warning',
  }
  return colors[value] || 'neutral'
}

function getStatusColor(
  status: string
): 'neutral' | 'info' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' {
  const colors: Record<
    string,
    'neutral' | 'info' | 'primary' | 'secondary' | 'success' | 'warning' | 'error'
  > = {
    active: 'success',
    pending: 'warning',
    expired: 'error',
    suspended: 'neutral',
  }
  return colors[status] || 'neutral'
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function getMemberActions(member: Member) {
  return [
    [
      { label: 'View Profile', icon: 'i-heroicons-eye', click: () => viewMember(member.id) },
      { label: 'Edit Member', icon: 'i-heroicons-pencil', click: () => editMember(member.id) },
    ],
    [
      {
        label: 'Renew Membership',
        icon: 'i-heroicons-arrow-path',
        click: () => renewMembership(member.id),
      },
      {
        label: 'Send Reminder',
        icon: 'i-heroicons-envelope',
        click: () => sendReminder(member.id),
      },
    ],
    [
      {
        label: 'Suspend Member',
        icon: 'i-heroicons-no-symbol',
        click: () => suspendMember(member.id),
      },
      { label: 'Delete Member', icon: 'i-heroicons-trash', click: () => deleteMember(member.id) },
    ],
  ]
}

function getMemberMenuItems(member: Member): DropdownMenuItem[][] {
  const groups = getMemberActions(member)
  return groups.map(group =>
    group.map(item => ({
      label: item.label,
      icon: item.icon,
      onSelect: (_e: Event) => {
        if (item.click) item.click()
      },
    }))
  )
}

function clearFilters() {
  searchQuery.value = ''
  selectedTypeItem.value = membershipTypeOptions.find(o => o.value === 'all')
  selectedStatusItem.value = statusOptions.find(o => o.value === 'all')
}

function exportMemberships() {
  useToast().add({
    title: 'Export started',
    description: 'Membership data is being exported...',
    color: 'info',
  })
}

function viewMember(id: number) {
  navigateTo(`/admin/memberships/${id}`)
}

function editMember(id: number) {
  navigateTo(`/admin/memberships/${id}/edit`)
}

function renewMembership(_id: number) {
  useToast().add({
    title: 'Membership renewed',
    description: 'Membership has been renewed successfully',
    color: 'success',
  })
}

function sendReminder(_id: number) {
  useToast().add({
    title: 'Reminder sent',
    description: 'Renewal reminder has been sent to the member',
    color: 'info',
  })
}

function suspendMember(_id: number) {
  useToast().add({
    title: 'Member suspended',
    description: 'Member has been suspended',
    color: 'warning',
  })
}

function deleteMember(_id: number) {
  useToast().add({
    title: 'Member deleted',
    description: 'Member has been removed from the system',
    color: 'error',
  })
}

// Wizard validation
const canProceedToStep2 = computed(() => {
  return newMembership.value.fullName.trim() && newMembership.value.email.trim()
})

const canSubmit = computed(() => {
  return (
    canProceedToStep2.value &&
    newMembership.value.typeItem &&
    newMembership.value.statusItem &&
    newMembership.value.joinDate &&
    newMembership.value.fees
  )
})

// Wizard navigation
function nextStep() {
  if (currentStep.value < 2 && canProceedToStep2.value) {
    currentStep.value++
  }
}

function previousStep() {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

function closeModal() {
  isCreateMembershipOpen.value = false
  currentStep.value = 1
  // Reset form
  newMembership.value = {
    fullName: '',
    email: '',
    type: '',
    status: 'pending',
    typeItem: undefined,
    statusItem: undefined,
    gender: '',
    phone: '',
    organization: '',
    bio: '',
    joinDate: '',
    fees: '',
  }
}

async function createMembership() {
  isCreating.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))
    // Map selected objects to string values before closing/resetting
    newMembership.value.type = newMembership.value.typeItem?.value || ''
    newMembership.value.status = newMembership.value.statusItem?.value || ''

    closeModal()

    useToast().add({
      title: 'Member added',
      description: 'New member has been added successfully',
      color: 'success',
    })
  } catch {
    useToast().add({
      title: 'Error',
      description: 'Failed to add member',
      color: 'error',
    })
  } finally {
    isCreating.value = false
  }
}
</script>
