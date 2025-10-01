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
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
            {{ member ? getFullName(member) : 'Member Details' }}
          </h1>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            View member information and membership details
          </p>
        </div>
      </div>
      <div class="flex space-x-3">
        <UButton
          color="neutral"
          variant="outline"
          icon="i-heroicons-pencil"
          :to="`/membership/apply?edit=1&id=${memberId}`"
        >
          Edit Member
        </UButton>
        <UDropdownMenu :items="memberActions">
          <UButton color="neutral" variant="outline" icon="i-heroicons-ellipsis-horizontal">
            Actions
          </UButton>
        </UDropdownMenu>
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

    <!-- Member Details -->
    <div v-else-if="member" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Main Column: Info + History -->
      <div class="lg:col-span-2">
        <!-- Main Info -->
        <UCard>
          <template #header>
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold">Member Information</h3>
              <div class="flex items-center space-x-2">
                <UButton
                  color="neutral"
                  variant="outline"
                  size="sm"
                  icon="i-heroicons-pencil"
                  :to="`/membership/apply?edit=1&id=${member.id}`"
                >
                  Edit
                </UButton>
                <UDropdown :items="memberActions">
                  <UButton
                    color="neutral"
                    variant="outline"
                    size="sm"
                    icon="i-heroicons-ellipsis-vertical"
                  />
                </UDropdown>
              </div>
            </div>
          </template>

          <div class="space-y-8">
            <!-- Header with avatar and basic info -->
            <div class="flex items-start space-x-4">
              <div class="flex-shrink-0">
                <div
                  class="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center"
                >
                  <span class="text-xl font-semibold text-primary-600 dark:text-primary-300">
                    {{
                      getFullName(member)
                        .split(' ')
                        .map((n: string) => n[0])
                        .join('')
                        .slice(0, 2)
                    }}
                  </span>
                </div>
              </div>
              <div class="flex-1">
                <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
                  {{ getFullName(member) }}
                </h2>
                <p class="text-gray-500 dark:text-gray-400">{{ member.email }}</p>
                <div class="flex items-center space-x-2 mt-1">
                  <UBadge :color="getStatusColor(member.status)" size="sm">
                    {{ member.status }}
                  </UBadge>
                  <UBadge :color="getTypeColor(member.membershipType)" size="sm">
                    {{ member.membershipType }}
                  </UBadge>
                </div>
              </div>
            </div>

            <!-- Personal Information Section -->
            <div>
              <h4
                class="text-base font-semibold text-gray-900 dark:text-white mb-4 border-b border-gray-200 dark:border-gray-700 pb-2"
              >
                Personal Information
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1"
                    >Full Name</label
                  >
                  <p class="text-gray-900 dark:text-white">
                    {{ getFullName(member) }}
                  </p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1"
                    >Sex</label
                  >
                  <p class="text-gray-900 dark:text-white">{{ member.sex }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1"
                    >Date of Birth</label
                  >
                  <p class="text-gray-900 dark:text-white">
                    {{ member.dob ? new Date(member.dob).toLocaleDateString() : 'Not provided' }}
                  </p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1"
                    >Email</label
                  >
                  <p class="text-gray-900 dark:text-white">{{ member.email }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1"
                    >Telephone</label
                  >
                  <p class="text-gray-900 dark:text-white">{{ member.telephone }}</p>
                </div>
                <div v-if="member.fax">
                  <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1"
                    >Fax</label
                  >
                  <p class="text-gray-900 dark:text-white">{{ member.fax }}</p>
                </div>
                <div class="md:col-span-2">
                  <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1"
                    >Address</label
                  >
                  <p class="text-gray-900 dark:text-white">{{ member.address }}</p>
                </div>
              </div>
            </div>

            <!-- Employment & Education Section -->
            <div>
              <h4
                class="text-base font-semibold text-gray-900 dark:text-white mb-4 border-b border-gray-200 dark:border-gray-700 pb-2"
              >
                Employment & Education
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1"
                    >Position</label
                  >
                  <p class="text-gray-900 dark:text-white">{{ member.position }}</p>
                </div>
                <div v-if="member.department">
                  <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1"
                    >Department</label
                  >
                  <p class="text-gray-900 dark:text-white">{{ member.department }}</p>
                </div>
                <div class="md:col-span-2">
                  <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1"
                    >Employer</label
                  >
                  <p class="text-gray-900 dark:text-white">{{ member.employer }}</p>
                </div>
                <div v-if="member.qualifications" class="md:col-span-2">
                  <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1"
                    >Qualifications</label
                  >
                  <p class="text-gray-900 dark:text-white">{{ member.qualifications }}</p>
                </div>
                <div v-if="member.experience" class="md:col-span-2">
                  <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1"
                    >Professional Experience</label
                  >
                  <p class="text-gray-900 dark:text-white">{{ member.experience }}</p>
                </div>
                <div v-if="member.publications && member.publications.length" class="md:col-span-2">
                  <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1"
                    >Publications</label
                  >
                  <ul
                    class="divide-y divide-gray-200 dark:divide-gray-800 rounded-md border border-gray-200 dark:border-gray-800"
                  >
                    <li
                      v-for="pub in member.publications"
                      :key="pub"
                      class="flex items-center justify-between p-3"
                    >
                      <div class="flex items-center gap-2 min-w-0">
                        <UIcon name="i-heroicons-document" class="w-5 h-5 text-gray-400 shrink-0" />
                        <p class="text-gray-900 dark:text-white text-sm truncate" :title="pub">
                          {{ getFileName(pub) }}
                        </p>
                      </div>
                      <div class="flex items-center gap-2">
                        <UButton
                          :href="pub"
                          target="_blank"
                          rel="noopener"
                          color="neutral"
                          variant="ghost"
                          size="xs"
                          icon="i-heroicons-eye"
                          title="View"
                        />
                        <UButton
                          color="neutral"
                          variant="outline"
                          size="xs"
                          icon="i-heroicons-arrow-down-tray"
                          title="Download"
                          @click="downloadPublication(pub)"
                        >
                          Download
                        </UButton>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <!-- Languages Section -->
            <div>
              <h4
                class="text-base font-semibold text-gray-900 dark:text-white mb-4 border-b border-gray-200 dark:border-gray-700 pb-2"
              >
                Languages
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div v-if="member.motherTongue">
                  <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1"
                    >Mother Tongue</label
                  >
                  <p class="text-gray-900 dark:text-white">{{ member.motherTongue }}</p>
                </div>
                <div v-if="member.otherLanguages && member.otherLanguages.length">
                  <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1"
                    >Other Languages</label
                  >
                  <p class="text-gray-900 dark:text-white">
                    {{ member.otherLanguages.join(', ') }}
                  </p>
                </div>
                <div v-if="member.otherLanguageText" class="md:col-span-2">
                  <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1"
                    >Additional Languages</label
                  >
                  <p class="text-gray-900 dark:text-white">{{ member.otherLanguageText }}</p>
                </div>
              </div>
            </div>

            <!-- Areas of Expertise Section -->
            <div>
              <h4
                class="text-base font-semibold text-gray-900 dark:text-white mb-4 border-b border-gray-200 dark:border-gray-700 pb-2"
              >
                Areas of Expertise
              </h4>
              <div class="space-y-4">
                <div v-if="member.expertiseDescription">
                  <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1"
                    >Description</label
                  >
                  <p class="text-gray-900 dark:text-white">{{ member.expertiseDescription }}</p>
                </div>
                <div v-if="member.expertise && member.expertise.length">
                  <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1"
                    >Selected Areas</label
                  >
                  <div class="flex flex-wrap gap-2">
                    <UBadge
                      v-for="area in member.expertise"
                      :key="area"
                      color="primary"
                      variant="soft"
                      size="sm"
                    >
                      {{ area }}
                    </UBadge>
                  </div>
                </div>
                <div v-if="member.expertiseOther">
                  <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1"
                    >Other Expertise</label
                  >
                  <p class="text-gray-900 dark:text-white">{{ member.expertiseOther }}</p>
                </div>
              </div>
            </div>

            <!-- Employment Classification Section -->
            <div>
              <h4
                class="text-base font-semibold text-gray-900 dark:text-white mb-4 border-b border-gray-200 dark:border-gray-700 pb-2"
              >
                Employment Classification
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1"
                    >Agency Type</label
                  >
                  <p class="text-gray-900 dark:text-white">{{ member.agency }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1"
                    >Type of Work</label
                  >
                  <p class="text-gray-900 dark:text-white">{{ member.typeOfWork }}</p>
                </div>
                <div v-if="member.typeOfWorkOther" class="md:col-span-2">
                  <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1"
                    >Other Work Type</label
                  >
                  <p class="text-gray-900 dark:text-white">{{ member.typeOfWorkOther }}</p>
                </div>
              </div>
            </div>

            <!-- Payment Information Section -->
            <div v-if="member.paymentReference">
              <h4
                class="text-base font-semibold text-gray-900 dark:text-white mb-4 border-b border-gray-200 dark:border-gray-700 pb-2"
              >
                Payment Information
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1"
                    >Payment Reference</label
                  >
                  <p class="text-gray-900 dark:text-white font-mono text-sm">
                    {{ member.paymentReference }}
                  </p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1"
                    >Membership Fee</label
                  >
                  <p class="text-gray-900 dark:text-white">₦{{ member.fees.toLocaleString() }}</p>
                </div>
              </div>
            </div>
          </div>
        </UCard>

        <!-- Membership History -->
        <UCard class="mt-6">
          <template #header>
            <h3 class="text-lg font-semibold">Membership History</h3>
          </template>

          <div v-if="historyPending" class="py-6 text-sm text-gray-500 dark:text-gray-400">
            Loading history...
          </div>
          <div
            v-else-if="!membershipHistory.length"
            class="py-6 text-sm text-gray-500 dark:text-gray-400"
          >
            No history yet.
          </div>
          <div v-else class="space-y-4">
            <div
              v-for="history in membershipHistory"
              :key="history.id"
              class="border-l-4 border-primary-500 pl-4"
            >
              <div class="flex items-center justify-between">
                <div>
                  <p class="font-medium text-gray-900 dark:text-white">{{ history.action }}</p>
                  <p class="text-sm text-gray-500 dark:text-gray-400">
                    {{ formatDate(history.date) }}
                  </p>
                </div>
                <UBadge :color="history.type === 'renewal' ? 'success' : 'info'" size="sm">
                  {{ history.type }}
                </UBadge>
              </div>
              <p v-if="history.notes" class="text-sm text-gray-600 dark:text-gray-300 mt-1">
                {{ history.notes }}
              </p>
            </div>
          </div>
        </UCard>

        <!-- Manage Publications -->
        <UCard class="mt-6">
          <template #header>
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold">Publications</h3>
              <div class="flex items-center gap-2">
                <UButton
                  color="primary"
                  variant="outline"
                  size="sm"
                  icon="i-heroicons-arrow-up-tray"
                  @click="triggerUpload()"
                >
                  Upload File
                </UButton>
                <input ref="fileInputRef" type="file" class="hidden" @change="onFileSelected" />
              </div>
            </div>
          </template>

          <div
            v-if="publicationsLocal.length === 0"
            class="text-sm text-gray-500 dark:text-gray-400"
          >
            No publications yet.
          </div>
          <ul v-else class="divide-y divide-gray-200 dark:divide-gray-800">
            <li
              v-for="url in publicationsLocal"
              :key="url"
              class="flex items-center justify-between py-2"
            >
              <div class="flex items-center gap-2 min-w-0">
                <UIcon name="i-heroicons-document" class="w-5 h-5 text-gray-400 shrink-0" />
                <a
                  :href="url"
                  target="_blank"
                  class="text-sm truncate text-primary-600 dark:text-primary-400"
                  :title="url"
                >
                  {{ getFileName(url) }}
                </a>
              </div>
              <div class="flex items-center gap-2">
                <UButton
                  color="neutral"
                  variant="ghost"
                  size="xs"
                  icon="i-heroicons-eye"
                  :href="url"
                  target="_blank"
                  title="View"
                />
                <UButton
                  color="error"
                  variant="outline"
                  size="xs"
                  icon="i-heroicons-trash"
                  :loading="isUpdatingPublications"
                  title="Remove"
                  @click="removePublication(url)"
                />
              </div>
            </li>
          </ul>
        </UCard>
      </div>

      <!-- Sidebar -->
      <div class="space-y-6">
        <!-- Membership Details -->
        <UCard>
          <template #header>
            <h3 class="text-lg font-semibold">Membership Details</h3>
          </template>

          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                Membership Type
              </label>
              <UBadge :color="getTypeColor(member.membershipType)" size="sm">
                {{ member.membershipType }}
              </UBadge>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                Status
              </label>
              <UBadge :color="getStatusColor(member.status)" size="sm">
                {{ member.status }}
              </UBadge>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                Join Date
              </label>
              <p class="text-gray-900 dark:text-white">{{ formatDate(member.joinedDate) }}</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                Expiry Date
              </label>
              <p class="text-gray-900 dark:text-white">{{ formatDate(member.expiryDate) }}</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                Membership Fees
              </label>
              <p class="text-lg font-semibold text-gray-900 dark:text-white">
                ₦{{ member.fees.toLocaleString() }}
              </p>
            </div>
          </div>
        </UCard>

        <!-- Quick Actions -->
        <UCard>
          <template #header>
            <h3 class="text-lg font-semibold">Quick Actions</h3>
          </template>

          <div class="space-y-3">
            <UButton
              color="primary"
              variant="outline"
              icon="i-heroicons-arrow-path"
              block
              @click="confirmRenewMembership"
            >
              Renew Membership
            </UButton>

            <UButton
              color="warning"
              variant="outline"
              icon="i-heroicons-no-symbol"
              block
              @click="confirmSuspendMember"
            >
              Suspend Member
            </UButton>

            <UButton
              color="error"
              variant="outline"
              icon="i-heroicons-trash"
              block
              @click="confirmDeleteMember"
            >
              Delete Member
            </UButton>
          </div>
        </UCard>
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
  </div>
</template>

<script setup lang="ts">
import type { MemberDetail } from '../../../../types/members'

definePageMeta({
  layout: 'admin',
})

interface MembershipHistory {
  id: number
  action: string
  date: string
  type: 'renewal' | 'status_change' | 'creation'
  notes?: string
}

const route = useRoute()
const memberId = route.params.id as string

// Use the composable for API calls
const {
  getMember,
  getMemberHistory,
  updateMember,
  deleteMember: deleteMemberAPI,
  activateMember,
  suspendMember: suspendMemberAPI,
  renewMember,
  remindMember,
} = useMembers()

const confirmationModal = ref({
  isOpen: false,
  title: '',
  message: '',
  confirmText: 'Confirm',
  confirmColor: 'primary' as 'primary' | 'warning' | 'error',
  onConfirm: () => {},
})

// Fetch member data using the composable
const { data: memberResponse, pending, error } = getMember(memberId)

// Extract member data from API response
const member = computed(() => {
  if (memberResponse.value?.success && memberResponse.value.data) {
    return memberResponse.value.data
  }
  return null
})

// Publications management state
const publicationsLocal = ref<string[]>([])
const isUpdatingPublications = ref(false)
const fileInputRef = ref<HTMLInputElement | null>(null)

watch(
  member,
  m => {
    publicationsLocal.value = m?.publications ? [...m.publications] : []
  },
  { immediate: true }
)

function triggerUpload() {
  fileInputRef.value?.click()
}

async function onFileSelected(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files && input.files[0]
  if (!file) return

  try {
    isUpdatingPublications.value = true
    const form = new FormData()
    form.append('file', file, file.name)
    form.append('folder', 'publications')

    const res = await $fetch<{ url: string }>('/api/uploads', { method: 'POST', body: form })
    publicationsLocal.value = [...publicationsLocal.value, res.url]
    await savePublications()
    useToast().add({ title: 'Uploaded', description: `${file.name} added`, color: 'success' })
  } catch (err: unknown) {
    useToast().add({
      title: 'Upload failed',
      description: extractApiMessage(err, 'Could not upload file'),
      color: 'error',
    })
  } finally {
    if (input) input.value = ''
    isUpdatingPublications.value = false
  }
}

function sendReminder() {
  if (!member.value) return

  confirmationModal.value = {
    isOpen: true,
    title: 'Send Renewal Reminder',
    message: `Send a renewal reminder email to ${getFullName(member.value)} (\n${member.value.email}\n)?`,
    confirmText: 'Send Reminder',
    confirmColor: 'primary',
    onConfirm: () => doSendReminder(),
  }
}

async function doSendReminder() {
  if (!member.value) return
  try {
    await remindMember(memberId)
    confirmationModal.value.isOpen = false
    useToast().add({
      title: 'Reminder sent',
      description: 'Renewal reminder email has been sent to the member',
      color: 'info',
    })
  } catch (error: unknown) {
    useToast().add({
      title: 'Error',
      description: extractApiMessage(error, 'Failed to send reminder'),
      color: 'error',
    })
  }
}

async function removePublication(url: string) {
  try {
    isUpdatingPublications.value = true
    publicationsLocal.value = publicationsLocal.value.filter(u => u !== url)
    await savePublications()
    useToast().add({ title: 'Removed', description: 'Publication removed', color: 'success' })
  } catch (err: unknown) {
    useToast().add({
      title: 'Update failed',
      description: extractApiMessage(err, 'Could not update publications'),
      color: 'error',
    })
  } finally {
    isUpdatingPublications.value = false
  }
}

async function savePublications() {
  if (!member.value) return
  await updateMember(memberId, { publications: publicationsLocal.value })
  await refreshCookie(`member-${memberId}`)
}

// Helper function to get full name
const getFullName = (member: MemberDetail) => {
  const parts = [member.title, member.nameFirst, member.nameMiddle, member.nameFamily].filter(
    Boolean
  )
  return parts.join(' ')
}

// Real membership history
const { data: historyResponse, pending: historyPending } = getMemberHistory(memberId)
const membershipHistory = computed<MembershipHistory[]>(() => {
  const items = historyResponse.value?.data as
    | Array<{ id: string; action: string; type: string; date: string; notes?: string }>
    | undefined
  if (!items || !Array.isArray(items)) return []
  return items.map((h, idx) => ({
    id: idx, // local numeric key; API id is string but not used elsewhere
    action: h.action,
    date: h.date,
    type: (h.type as MembershipHistory['type']) ?? 'status_change',
    notes: h.notes,
  }))
})

const memberActions = computed(() => [
  [
    {
      label: 'Renew Membership',
      icon: 'i-heroicons-arrow-path',
      onSelect: confirmRenewMembership,
    },
    {
      label: 'Send Reminder',
      icon: 'i-heroicons-envelope',
      onSelect: sendReminder,
    },
  ],
  [
    {
      label: 'Suspend Member',
      icon: 'i-heroicons-no-symbol',
      onSelect: confirmSuspendMember,
    },
    {
      label: 'Delete Member',
      icon: 'i-heroicons-trash',
      onSelect: confirmDeleteMember,
    },
  ],
])

function _getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
}

function getTypeColor(
  type: string
): 'neutral' | 'info' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' {
  if (type.includes('Joint IEA')) return 'primary'
  if (type.includes('Regular')) return 'success'
  if (type.includes('Early Career')) return 'warning'
  return 'neutral'
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
    month: 'long',
    day: 'numeric',
  })
}

// Extract a user-friendly filename from a URL or path
function getFileName(path: string): string {
  try {
    const u = new URL(path)
    const last = u.pathname.split('/')
    return decodeURIComponent(last[last.length - 1] || 'file')
  } catch {
    const parts = path.split('/')
    return decodeURIComponent(parts[parts.length - 1] || 'file')
  }
}

// Trigger file download; falls back to opening in a new tab if download is blocked
function downloadPublication(url: string) {
  try {
    const fileName = getFileName(url)
    const a = document.createElement('a')
    a.href = url
    a.download = fileName
    a.target = '_blank'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  } catch {
    useToast().add({
      title: 'Download failed',
      description: 'Unable to download the file. Please try again.',
      color: 'error',
    })
    window.open(url, '_blank')
  }
}

function confirmRenewMembership() {
  if (!member.value) return

  confirmationModal.value = {
    isOpen: true,
    title: 'Renew Membership',
    message: `Are you sure you want to renew the membership for ${getFullName(member.value)}? This will extend their membership period.`,
    confirmText: 'Renew',
    confirmColor: 'primary',
    onConfirm: () => renewMembership(),
  }
}

function confirmSuspendMember() {
  if (!member.value) return

  confirmationModal.value = {
    isOpen: true,
    title: 'Suspend Member',
    message: `Are you sure you want to suspend ${getFullName(member.value)}? They will lose access to member benefits.`,
    confirmText: 'Suspend',
    confirmColor: 'warning',
    onConfirm: () => suspendMember(),
  }
}

function confirmDeleteMember() {
  if (!member.value) return

  confirmationModal.value = {
    isOpen: true,
    title: 'Delete Member',
    message: `Are you sure you want to permanently delete ${getFullName(member.value)}? This action cannot be undone.`,
    confirmText: 'Delete',
    confirmColor: 'error',
    onConfirm: () => deleteMember(),
  }
}

async function renewMembership() {
  if (!member.value) return

  try {
    await renewMember(memberId, { reason: 'Renewed via admin panel', period: '1 year' })
    confirmationModal.value.isOpen = false
    await refreshCookie(`member-${memberId}`)
    useToast().add({
      title: 'Membership renewed',
      description: 'Membership has been renewed successfully',
      color: 'success',
    })
  } catch (error: unknown) {
    useToast().add({
      title: 'Error',
      description: extractApiMessage(error, 'Failed to renew membership'),
      color: 'error',
    })
  }
}

async function suspendMember() {
  if (!member.value) return

  try {
    await suspendMemberAPI(memberId, { reason: 'Suspended via admin panel' })
    confirmationModal.value.isOpen = false
    await refreshCookie(`member-${memberId}`)
    useToast().add({
      title: 'Member suspended',
      description: 'Member has been suspended',
      color: 'warning',
    })
  } catch (error: unknown) {
    useToast().add({
      title: 'Error',
      description: extractApiMessage(error, 'Failed to suspend member'),
      color: 'error',
    })
  }
}

async function deleteMember() {
  if (!member.value) return

  try {
    await deleteMemberAPI(memberId)
    confirmationModal.value.isOpen = false
    useToast().add({
      title: 'Member deleted',
      description: 'Member has been removed from the system',
      color: 'error',
    })
    // Redirect back to members list
    navigateTo('/admin/memberships')
  } catch (error: unknown) {
    useToast().add({
      title: 'Error',
      description: extractApiMessage(error, 'Failed to delete member'),
      color: 'error',
    })
  }
}

async function activateMemberAction() {
  if (!member.value) return

  try {
    await activateMember(memberId, { reason: 'Activated via admin panel' })
    confirmationModal.value.isOpen = false
    await refreshCookie(`member-${memberId}`)
    useToast().add({
      title: 'Member activated',
      description: 'Member has been activated successfully',
      color: 'success',
    })
  } catch {
    useToast().add({
      title: 'Error',
      description: extractApiMessage(undefined, 'Failed to activate member'),
      color: 'error',
    })
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

function _confirmActivateMember() {
  if (!member.value) return

  confirmationModal.value = {
    isOpen: true,
    title: 'Activate Member',
    message: `Are you sure you want to activate ${getFullName(member.value)}? They will regain access to member benefits.`,
    confirmText: 'Activate',
    confirmColor: 'primary',
    onConfirm: () => activateMemberAction(),
  }
}
</script>
