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
      <UButton color="primary" icon="i-heroicons-plus" @click="navigateTo('/membership/apply')">
        Add Member
      </UButton>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-2 md:grid-cols-5 gap-6 mb-6">
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
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Total</p>
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
              <UIcon name="i-heroicons-x-circle" class="w-5 h-5 text-red-600 dark:text-red-300" />
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Expired</p>
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">
              {{ membershipStats.expired }}
            </p>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div
              class="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center"
            >
              <UIcon
                name="i-heroicons-exclamation-circle"
                class="w-5 h-5 text-gray-700 dark:text-gray-300"
              />
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Inactive</p>
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">
              {{ membershipStats.inactive }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
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
        <USelectMenu
          v-model="selectedPaymentItem"
          :items="paymentStatusOptions"
          option-attribute="label"
          value-attribute="value"
          placeholder="Filter by payment"
          :popper="{ strategy: 'fixed', placement: 'bottom-start' }"
        />
        <UButton color="neutral" variant="outline" icon="i-heroicons-funnel" @click="clearFilters">
          Clear Filters
        </UButton>
      </div>
    </div>

    <!-- Memberships Table -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <!-- Loading state -->
      <div v-if="membersPending" class="p-8 text-center">
        <div class="inline-flex items-center space-x-2">
          <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600" />
          <span class="text-gray-600 dark:text-gray-400">Loading members...</span>
        </div>
      </div>

      <!-- Empty state -->
      <div v-else-if="!members.length" class="p-8 text-center">
        <div class="text-gray-500 dark:text-gray-400">
          <UIcon name="i-heroicons-users" class="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <h3 class="text-lg font-medium mb-2">No members found</h3>
          <p class="text-sm">Try adjusting your search filters or add a new member.</p>
        </div>
      </div>

      <!-- Table content -->
      <div v-else class="overflow-x-auto">
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
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                Payment
              </th>
              <th class="relative px-6 py-3">
                <span class="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr
              v-for="member in members"
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
                        getInitials(getFullName(member))
                      }}</span>
                    </div>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900 dark:text-white">
                      {{ getFullName(member) }}
                    </div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">{{ member.email }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <UBadge :color="getTypeColor(member.membershipType)" size="sm">{{
                  member.membershipType
                }}</UBadge>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center space-x-2">
                  <UBadge :color="getStatusColor(member.status)" size="sm">{{
                    member.status
                  }}</UBadge>
                  <UTooltip
                    v-if="member.status === 'pending' && !member.paymentReference"
                    text="Application without payment - may be duplicate"
                  >
                    <UIcon
                      name="i-heroicons-exclamation-triangle"
                      class="w-4 h-4 text-orange-500 cursor-help"
                    />
                  </UTooltip>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {{ formatDate(member.joinedDate) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                ₦{{ member.fees.toLocaleString() }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center space-x-2">
                  <UBadge :color="member.paymentReference ? 'success' : 'warning'" size="sm">
                    {{ member.paymentReference ? 'Paid' : 'Pending' }}
                  </UBadge>
                  <UTooltip
                    v-if="member.paymentReference"
                    :text="`Ref: ${member.paymentReference}`"
                  >
                    <UIcon
                      name="i-heroicons-information-circle"
                      class="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-help"
                    />
                  </UTooltip>
                </div>
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

      <!-- Pagination -->
      <div
        v-if="members.length"
        class="bg-white dark:bg-gray-800 px-4 py-3 border-t border-gray-200 dark:border-gray-700 sm:px-6"
      >
        <div class="flex items-center justify-between">
          <div class="flex-1 flex justify-between sm:hidden">
            <UButton
              :disabled="!pagination.hasPrev"
              color="neutral"
              variant="outline"
              @click="goToPage(currentPage - 1)"
            >
              Previous
            </UButton>
            <UButton
              :disabled="!pagination.hasNext"
              color="neutral"
              variant="outline"
              @click="goToPage(currentPage + 1)"
            >
              Next
            </UButton>
          </div>
          <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p class="text-sm text-gray-700 dark:text-gray-300">
                Showing
                <span class="font-medium">{{ (currentPage - 1) * pageSize + 1 }}</span>
                to
                <span class="font-medium">{{
                  Math.min(currentPage * pageSize, pagination.total)
                }}</span>
                of
                <span class="font-medium">{{ pagination.total }}</span>
                results
              </p>
            </div>
            <div>
              <UPagination
                v-model="currentPage"
                :page-count="pageSize"
                :total="pagination.total"
                :max="7"
                show-last
                show-first
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Confirmation Modal -->
    <UModal v-model:open="confirmationModal.isOpen">
      <template #content>
        <UCard>
          <template #header>
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold">{{ confirmationModal.title }}</h3>
              <UButton
                color="neutral"
                variant="ghost"
                icon="i-heroicons-x-mark"
                @click="confirmationModal.isOpen = false"
              />
            </div>
          </template>

          <div class="py-4">
            <p class="text-gray-600 dark:text-gray-400">{{ confirmationModal.message }}</p>
          </div>

          <template #footer>
            <div class="flex justify-end space-x-3">
              <UButton color="neutral" variant="ghost" @click="confirmationModal.isOpen = false">
                Cancel
              </UButton>
              <UButton :color="confirmationModal.confirmColor" @click="confirmationModal.onConfirm">
                {{ confirmationModal.confirmText }}
              </UButton>
            </div>
          </template>
        </UCard>
      </template>
    </UModal>

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
import type { MemberListItem } from '../../../../types/members'
import type { PaginatedResponse } from '../../../../types/api'

definePageMeta({
  layout: 'admin',
})

const isCreateMembershipOpen = ref(false)
const isCreating = ref(false)
const confirmationModal = ref({
  isOpen: false,
  title: '',
  message: '',
  confirmText: 'Confirm',
  confirmColor: 'primary' as const,
  onConfirm: () => {},
})
// Composable for API calls
const {
  getMembers,
  getMemberStats,
  deleteMember,
  activateMember,
  suspendMember,
  renewMember,
  remindMember,
  refreshStats,
} = useMembers()

// Filter state
const searchQuery = ref('')
const selectedTypeItem = ref<{ label: string; value: string } | undefined>(undefined)
const selectedStatusItem = ref<{ label: string; value: string } | undefined>(undefined)
const selectedPaymentItem = ref<{ label: string; value: string } | undefined>(undefined)
const currentPage = ref(1)
const pageSize = ref(20)

// Wizard state
const currentStep = ref(1)

const genderItems = ref<RadioGroupItem[]>([
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
])

const membershipTypeOptions = [
  { label: 'All Types', value: 'all' },
  { label: 'Regular Membership (Joint IEA - EPiSON)', value: 'regular iea' },
  { label: 'Regular Membership (EPiSON only)', value: 'regular' },
  { label: 'Early Career Membership (Joint IEA - EPiSON)', value: 'early-career iea' },
  { label: 'Early Career Membership (EPiSON only)', value: 'early-career' },
]

const statusOptions = [
  { label: 'All Status', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Pending', value: 'pending' },
  { label: 'Expired', value: 'expired' },
  { label: 'Suspended', value: 'suspended' },
]

const paymentStatusOptions = [
  { label: 'All Payments', value: 'all' },
  { label: 'Paid', value: 'paid' },
  { label: 'Pending Payment', value: 'unpaid' },
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

// Reactive query for members list
const membersQuery = computed(() => {
  const typeValue = selectedTypeItem.value?.value
  const statusValue = selectedStatusItem.value?.value
  const paymentValue = selectedPaymentItem.value?.value

  return {
    page: currentPage.value,
    limit: pageSize.value,
    search: searchQuery.value || undefined,
    status: statusValue && statusValue !== 'all' ? statusValue : undefined,
    membershipType: typeValue && typeValue !== 'all' ? typeValue : undefined,
    paymentStatus: paymentValue && paymentValue !== 'all' ? paymentValue : undefined,
    sortBy: 'nameFamily',
    sortOrder: 'asc' as const,
  }
})

// Fetch data using composables
const {
  data: membersData,
  pending: membersPending,
  refresh: refreshMembers,
} = getMembers(membersQuery)
const { data: statsData, pending: _statsPending, refresh: refreshStatsData } = getMemberStats()

// Computed properties for UI
const members = computed(() => membersData.value?.data || [])
const pagination = computed(
  () =>
    membersData.value?.pagination || {
      page: 1,
      limit: 20,
      total: 0,
      totalPages: 0,
      hasNext: false,
      hasPrev: false,
    }
)

const membershipStats = computed(() => {
  const stats = statsData.value?.data
  if (!stats) return { total: 0, active: 0, pending: 0, expired: 0, suspended: 0, inactive: 0 }
  return {
    total: stats.total,
    active: stats.byStatus.active || 0,
    pending: stats.byStatus.pending || 0,
    expired: stats.byStatus.expired || 0,
    suspended: stats.byStatus.suspended || 0,
    inactive: (stats.byStatus.inactive || 0) + (stats.byStatus.cancelled || 0),
  }
})

function confirmSendReminder(member: MemberListItem) {
  confirmationModal.value = {
    isOpen: true,
    title: 'Send Renewal Reminder',
    message: `Send a renewal reminder email to ${getFullName(member)} (\n${member.email}\n)?`,
    confirmText: 'Send Reminder',
    confirmColor: 'primary',
    onConfirm: () => sendReminderAction(member.id),
  }
}

async function sendReminderAction(id: string) {
  try {
    await remindMember(id)
    confirmationModal.value.isOpen = false
    useToast().add({
      title: 'Reminder sent',
      description: 'Renewal reminder email has been sent to the member',
      color: 'info',
    })
  } catch (error: unknown) {
    const description = extractApiMessage(error, 'Failed to send reminder')
    useToast().add({ title: 'Error', description, color: 'error' })
  }
}

// Set default status selection when the modal opens (after refs are initialized)
watch(isCreateMembershipOpen, open => {
  if (open) {
    const pending = statusOptions.find(s => s.value === 'pending')
    newMembership.value.statusItem = pending
      ? { label: pending.label, value: pending.value }
      : undefined
  }
})

// Watch for filter changes to reset page
watch([searchQuery, selectedTypeItem, selectedStatusItem, selectedPaymentItem], () => {
  currentPage.value = 1 // Reset to first page when filters change
})

function typeValueFromLabel(label: string): string {
  const found = membershipTypeOptions.find(o => o.label === label)
  return found ? found.value : label
}

// typeLabelFromValue not currently used

function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
}

function getFullName(member: MemberListItem): string {
  return `${member.nameFirst} ${member.nameFamily}`
}

function getTypeColor(
  type: string
): 'neutral' | 'info' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' {
  const value = typeValueFromLabel(type)
  const colors: Record<
    string,
    'neutral' | 'info' | 'primary' | 'secondary' | 'success' | 'warning' | 'error'
  > = {
    'regular iea': 'primary',
    regular: 'success',
    'early-career iea': 'info',
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

function getMemberActions(member: MemberListItem) {
  const isPendingApplication = member.status === 'pending'

  return [
    [{ label: 'View Profile', icon: 'i-heroicons-eye', click: () => viewMember(member.id) }],
    [
      {
        label: 'Activate Member',
        icon: 'i-heroicons-check-circle',
        click: () => confirmActivateMember(member),
        show: member.status !== 'active',
      },
      {
        label: 'Renew Membership',
        icon: 'i-heroicons-arrow-path',
        click: () => confirmRenewMembership(member),
        show: !isPendingApplication,
      },
      {
        label: 'Send Reminder',
        icon: 'i-heroicons-envelope',
        click: () => confirmSendReminder(member),
        show: !isPendingApplication,
      },
    ],
    [
      {
        label: 'Suspend Member',
        icon: 'i-heroicons-no-symbol',
        click: () => confirmSuspendMember(member),
        show: member.status === 'active',
      },
      {
        label: isPendingApplication ? 'Delete Application' : 'Delete Member',
        icon: 'i-heroicons-trash',
        click: () => confirmDeleteMember(member),
      },
    ],
  ]
}

function getMemberMenuItems(member: MemberListItem): DropdownMenuItem[][] {
  const groups = getMemberActions(member)
  return groups.map(group =>
    group
      .filter(item => item.show !== false)
      .map(item => ({
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
  selectedPaymentItem.value = paymentStatusOptions.find(o => o.value === 'all')
}

async function exportMemberships() {
  try {
    // Notify start
    useToast().add({
      title: 'Preparing export',
      description: 'Collecting membership data with current filters...',
    })

    // Reuse the exact same filters as the table and paginate (validator limit is 100)
    const pageSize = 100
    let page = 1
    let total = 0
    const rows: MemberListItem[] = []

    // First request to get total
    const firstRes = await $fetch<PaginatedResponse<MemberListItem>>('/api/members', {
      query: { ...membersQuery.value, page, limit: pageSize } as Record<string, unknown>,
      credentials: 'include',
    })
    total = firstRes.pagination?.total || (firstRes.data?.length ?? 0)
    rows.push(...(firstRes.data ?? []))

    // Fetch subsequent pages if needed
    const totalPages = Math.ceil(total / pageSize)
    while (page < totalPages) {
      page += 1
      const res = await $fetch<PaginatedResponse<MemberListItem>>('/api/members', {
        query: { ...membersQuery.value, page, limit: pageSize } as Record<string, unknown>,
        credentials: 'include',
      })
      rows.push(...(res.data ?? []))
    }

    if (!rows.length) {
      useToast().add({
        title: 'No data',
        description: 'No members match current filters',
        color: 'warning',
      })
      return
    }

    // Shape data for export
    const data: Array<Record<string, string | number>> = rows.map(m => ({
      ID: m.id,
      Name: `${m.nameFirst} ${m.nameFamily}`.trim(),
      Email: m.email,
      'Membership Type': m.membershipType,
      Status: m.status,
      'Joined Date': m.joinedDate,
      'Expiry Date': m.expiryDate,
      Fees: m.fees,
    }))

    // Try to export as real Excel via SheetJS (dynamic import)
    try {
      const XLSX = await import(/* @vite-ignore */ 'xlsx')
      const worksheet = XLSX.utils.json_to_sheet(data)
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Members')
      const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
      const blob = new Blob([wbout], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'members_export.xlsx'
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
      useToast().add({
        title: 'Exported',
        description: 'Excel file has been downloaded',
        color: 'success',
      })
      return
    } catch {
      // Fall back to CSV if SheetJS is unavailable
      const headers = Object.keys(data[0]!) as string[]
      const csv = [
        headers.join(','),
        ...data.map(row =>
          headers
            .map(h => {
              const v = row[h]
              const s = v == null ? '' : String(v)
              // escape quotes and commas/newlines
              const escaped = '"' + s.replace(/"/g, '""') + '"'
              return escaped
            })
            .join(',')
        ),
      ].join('\n')
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'members_export.csv'
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
      useToast().add({
        title: 'Exported (CSV fallback)',
        description: 'CSV file has been downloaded',
        color: 'info',
      })
    }
  } catch (error: unknown) {
    const description = extractApiMessage(error, 'Failed to export membership data')
    useToast().add({ title: 'Export failed', description, color: 'error' })
  }
}

function viewMember(id: string) {
  navigateTo(`/admin/memberships/${id}`)
}

function confirmActivateMember(member: MemberListItem) {
  confirmationModal.value = {
    isOpen: true,
    title: 'Activate Member',
    message: `Are you sure you want to activate ${getFullName(member)}? They will gain access to member benefits.`,
    confirmText: 'Activate',
    confirmColor: 'primary',
    onConfirm: () => activateMemberAction(member.id),
  }
}

function confirmRenewMembership(member: MemberListItem) {
  confirmationModal.value = {
    isOpen: true,
    title: 'Renew Membership',
    message: `Are you sure you want to renew the membership for ${getFullName(member)}? This will extend their membership period.`,
    confirmText: 'Renew',
    confirmColor: 'primary',
    onConfirm: () => renewMembershipAction(member.id),
  }
}

function confirmSuspendMember(member: MemberListItem) {
  confirmationModal.value = {
    isOpen: true,
    title: 'Suspend Member',
    message: `Are you sure you want to suspend ${getFullName(member)}? They will lose access to member benefits.`,
    confirmText: 'Suspend',
    confirmColor: 'primary',
    onConfirm: () => suspendMemberAction(member.id),
  }
}

function confirmDeleteMember(member: MemberListItem) {
  confirmationModal.value = {
    isOpen: true,
    title: 'Delete Member',
    message: `Are you sure you want to permanently delete ${getFullName(member)}? This action cannot be undone.`,
    confirmText: 'Delete',
    confirmColor: 'primary',
    onConfirm: () => deleteMemberAction(member.id),
  }
}

async function activateMemberAction(id: string) {
  try {
    await activateMember(id, { reason: 'Activated via admin panel' })
    confirmationModal.value.isOpen = false
    await refreshMembers()
    await refreshStats()
    await refreshStatsData()
    await refreshNuxtData('member-stats')
    useToast().add({
      title: 'Member activated',
      description: 'Member has been activated successfully',
      color: 'success',
    })
  } catch (error: unknown) {
    const description = extractApiMessage(error, 'Failed to activate member')
    useToast().add({
      title: 'Error',
      description,
      color: 'error',
    })
  }
}

async function renewMembershipAction(id: string) {
  try {
    await renewMember(id, { reason: 'Renewed via admin panel', period: '1 year' })
    confirmationModal.value.isOpen = false
    await refreshMembers()
    await refreshStats()
    await refreshStatsData()
    useToast().add({
      title: 'Membership renewed',
      description: 'Membership has been renewed successfully',
      color: 'success',
    })
  } catch (error: unknown) {
    const description = extractApiMessage(error, 'Failed to renew membership')
    useToast().add({
      title: 'Error',
      description,
      color: 'error',
    })
  }
}

async function suspendMemberAction(id: string) {
  try {
    await suspendMember(id, { reason: 'Suspended via admin panel' })
    confirmationModal.value.isOpen = false
    await refreshMembers()
    await refreshStats()
    await refreshStatsData()
    useToast().add({
      title: 'Member suspended',
      description: 'Member has been suspended',
      color: 'warning',
    })
  } catch (error: unknown) {
    const description = extractApiMessage(error, 'Failed to suspend member')
    useToast().add({
      title: 'Error',
      description,
      color: 'error',
    })
  }
}

async function deleteMemberAction(id: string) {
  try {
    await deleteMember(id)
    confirmationModal.value.isOpen = false
    await refreshMembers()
    await refreshStats()
    await refreshStatsData()
    useToast().add({
      title: 'Member deleted',
      description: 'Member has been removed from the system',
      color: 'error',
    })
  } catch (error: unknown) {
    const description = extractApiMessage(error, 'Failed to delete member')
    useToast().add({
      title: 'Error',
      description,
      color: 'error',
    })
  }
}

// Pagination functions
function goToPage(page: number) {
  if (page >= 1 && page <= pagination.value.totalPages) {
    currentPage.value = page
  }
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

function extractApiMessage(val: unknown, fallback: string): string {
  if (!val) return fallback
  if (val instanceof Error) return val.message || fallback
  if (typeof val === 'object') {
    const obj = val as Record<string, unknown>
    const data = obj['data'] as Record<string, unknown> | undefined
    const msg = data?.['message']
    if (typeof msg === 'string') return msg
  }
  return fallback
}
</script>
