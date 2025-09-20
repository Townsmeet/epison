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
            {{ member?.name || 'Member Details' }}
          </h1>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            View member information and membership details
          </p>
        </div>
      </div>
      <div class="flex space-x-3">
        <UButton color="neutral" variant="outline" icon="i-heroicons-pencil" @click="editMember">
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
                      member.name
                        .split(' ')
                        .map(n => n[0])
                        .join('')
                        .slice(0, 2)
                    }}
                  </span>
                </div>
              </div>
              <div class="flex-1">
                <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
                  {{ member.name }}
                </h2>
                <p class="text-gray-500 dark:text-gray-400">{{ member.email }}</p>
                <div class="flex items-center space-x-2 mt-1">
                  <UBadge :color="getStatusColor(member.status)" size="sm">
                    {{ member.status }}
                  </UBadge>
                  <UBadge :color="getTypeColor(member.type)" size="sm">
                    {{ member.type }}
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
                    {{ member.title }} {{ member.nameFirst }} {{ member.nameMiddle }}
                    {{ member.nameFamily }}
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
                    {{ new Date(member.dob).toLocaleDateString() }}
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
                  <div class="space-y-1">
                    <div
                      v-for="pub in member.publications"
                      :key="pub"
                      class="flex items-center gap-2"
                    >
                      <UIcon name="i-heroicons-document" class="w-4 h-4 text-gray-400" />
                      <span class="text-gray-900 dark:text-white text-sm">{{ pub }}</span>
                    </div>
                  </div>
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
        <UCard>
          <template #header>
            <h3 class="text-lg font-semibold">Membership History</h3>
          </template>

          <div class="space-y-4">
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
              <UBadge :color="getTypeColor(member.type)" size="sm">
                {{ member.type }}
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
definePageMeta({
  layout: 'admin',
})

interface Member {
  id: number
  // Personal Information
  title: string
  nameFamily: string
  nameMiddle?: string
  nameFirst: string
  name: string // computed full name
  sex: string
  dob: string
  address: string
  telephone: string
  fax?: string
  email: string

  // Employment & Education
  position: string
  employer: string
  department?: string
  qualifications?: string
  experience?: string
  publications?: string[] // file names/paths

  // Languages
  motherTongue?: string
  otherLanguages: string[]
  otherLanguageText?: string

  // Areas of Expertise
  expertiseDescription?: string
  expertise: string[]
  expertiseOther?: string

  // Employment Classification
  agency: string
  typeOfWork: string
  typeOfWorkOther?: string

  // Membership Details
  type: string
  status: string
  joinedDate: string
  expiryDate: string
  fees: number
  paymentReference?: string
}

interface MembershipHistory {
  id: number
  action: string
  date: string
  type: 'renewal' | 'status_change' | 'creation'
  notes?: string
}

const route = useRoute()
const memberId = parseInt(route.params.id as string)

const confirmationModal = ref({
  isOpen: false,
  title: '',
  message: '',
  confirmText: 'Confirm',
  confirmColor: 'primary' as 'primary' | 'warning' | 'error',
  onConfirm: () => {},
})

// Mock data - replace with actual API call
const {
  data: member,
  pending,
  error,
} = await useLazyAsyncData(`member-${memberId}`, async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500))

  // Mock member data with full application details
  const mockMembers: Member[] = [
    {
      id: 1,
      title: 'Dr',
      nameFamily: 'Doe',
      nameMiddle: 'Johnson',
      nameFirst: 'John',
      name: 'Dr. John Johnson Doe',
      sex: 'Male',
      dob: '1985-03-15',
      address: '123 Victoria Island, Lagos, Nigeria 101001',
      telephone: '+234 801 234 5678',
      fax: '+234 1 234 5678',
      email: 'john.doe@example.com',
      position: 'Senior Epidemiologist',
      employer: 'Lagos University Teaching Hospital, Idi-Araba, Lagos, Nigeria',
      department: 'Department of Community Health',
      qualifications: 'MBBS (2008), MPH (2012), PhD Epidemiology (2016)',
      experience:
        'Over 10 years in public health research, disease surveillance, and outbreak investigation. Led multiple epidemiological studies on infectious diseases.',
      publications: ['outbreak-investigation-2023.pdf', 'malaria-surveillance-study.pdf'],
      motherTongue: 'Yoruba',
      otherLanguages: ['English', 'French'],
      otherLanguageText: 'Hausa (conversational)',
      expertiseDescription:
        'Infectious disease epidemiology, outbreak investigation, surveillance systems, and public health emergency response',
      expertise: ['Infectious Disease', 'Evaluation', 'Surveillance', 'Health Services'],
      expertiseOther: 'Outbreak Investigation',
      agency: 'Hospital',
      typeOfWork: 'Clinical',
      type: 'Regular Membership (EPiSON only)',
      status: 'active',
      joinedDate: '2023-01-15',
      expiryDate: '2024-01-15',
      fees: 30000,
      paymentReference: 'EPISON-2023-ABC123',
    },
    {
      id: 2,
      title: 'Prof',
      nameFamily: 'Smith',
      nameFirst: 'Jane',
      name: 'Prof. Jane Smith',
      sex: 'Female',
      dob: '1978-07-22',
      address: 'University of Ibadan, Ibadan, Oyo State, Nigeria',
      telephone: '+234 802 345 6789',
      email: 'jane.smith@example.com',
      position: 'Professor of Epidemiology',
      employer: 'University of Ibadan, Faculty of Public Health, Ibadan, Nigeria',
      department: 'Department of Epidemiology and Medical Statistics',
      qualifications: 'MBBS (1999), MSc Epidemiology (2003), PhD Public Health (2007)',
      experience:
        'Professor with 20+ years experience in epidemiological research, teaching, and policy development. Published over 50 peer-reviewed articles.',
      publications: [
        'health-policy-framework-2024.pdf',
        'chronic-disease-burden-nigeria.pdf',
        'epidemiology-textbook-chapter.pdf',
      ],
      motherTongue: 'English',
      otherLanguages: ['French', 'Spanish'],
      expertiseDescription:
        'Chronic disease epidemiology, health policy, biostatistics, and research methodology',
      expertise: ['Cardiovascular', 'Diabetes', 'Policy', 'Methods', 'Teaching & Research'],
      agency: 'University/Higher Institution (or similar)',
      typeOfWork: 'Teaching & Research',
      type: 'Regular Membership (Joint IEA - EPiSON)',
      status: 'active',
      joinedDate: '2023-03-20',
      expiryDate: '2024-03-20',
      fees: 50000,
      paymentReference: 'EPISON-2023-DEF456',
    },
    {
      id: 3,
      title: 'Mr',
      nameFamily: 'Brown',
      nameFirst: 'Michael',
      name: 'Mr. Michael Brown',
      sex: 'Male',
      dob: '1995-11-08',
      address: 'University of Lagos, Akoka, Lagos, Nigeria',
      telephone: '+234 803 456 7890',
      email: 'michael.brown@student.edu',
      position: 'Graduate Research Assistant',
      employer: 'University of Lagos, College of Medicine, Lagos, Nigeria',
      department: 'Department of Community Health and Primary Care',
      qualifications: 'BSc Public Health (2018), MSc Epidemiology (in progress)',
      experience:
        'Early career researcher with focus on environmental health and chronic disease prevention. Currently pursuing MSc in Epidemiology.',
      motherTongue: 'Igbo',
      otherLanguages: ['English'],
      expertiseDescription:
        'Environmental health, chronic disease prevention, and community health research',
      expertise: ['Environment', 'Chronic Respiratory Conditions', 'Health Promotion'],
      expertiseOther: 'Community Health Research',
      agency: 'University/Higher Institution (or similar)',
      typeOfWork: 'Teaching & Research',
      type: 'Early Career Membership (EPiSON only)',
      status: 'pending',
      joinedDate: '2024-08-01',
      expiryDate: '2025-08-01',
      fees: 15000,
      paymentReference: 'EPISON-2024-GHI789',
    },
  ]

  const foundMember = mockMembers.find(m => m.id === memberId)
  if (!foundMember) {
    throw createError({ statusCode: 404, statusMessage: 'Member not found' })
  }

  return foundMember
})

// Mock membership history
const membershipHistory = ref<MembershipHistory[]>([
  {
    id: 1,
    action: 'Membership Renewed',
    date: '2024-01-15',
    type: 'renewal',
    notes: 'Annual membership renewal processed successfully',
  },
  {
    id: 2,
    action: 'Status Updated',
    date: '2023-06-10',
    type: 'status_change',
    notes: 'Status changed from pending to active after payment confirmation',
  },
  {
    id: 3,
    action: 'Member Joined',
    date: '2023-01-15',
    type: 'creation',
    notes: 'Initial membership application approved',
  },
])

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

function editMember() {
  navigateTo(`/admin/memberships/${memberId}/edit`)
}

function confirmRenewMembership() {
  if (!member.value) return

  confirmationModal.value = {
    isOpen: true,
    title: 'Renew Membership',
    message: `Are you sure you want to renew the membership for ${member.value.name}? This will extend their membership period.`,
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
    message: `Are you sure you want to suspend ${member.value.name}? They will lose access to member benefits.`,
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
    message: `Are you sure you want to permanently delete ${member.value.name}? This action cannot be undone.`,
    confirmText: 'Delete',
    confirmColor: 'error',
    onConfirm: () => deleteMember(),
  }
}

function renewMembership() {
  confirmationModal.value.isOpen = false
  useToast().add({
    title: 'Membership renewed',
    description: 'Membership has been renewed successfully',
    color: 'success',
  })
}

function suspendMember() {
  confirmationModal.value.isOpen = false
  useToast().add({
    title: 'Member suspended',
    description: 'Member has been suspended',
    color: 'warning',
  })
}

function sendReminder() {
  useToast().add({
    title: 'Reminder sent',
    description: 'Renewal reminder has been sent to the member',
    color: 'info',
  })
}

function deleteMember() {
  confirmationModal.value.isOpen = false
  useToast().add({
    title: 'Member deleted',
    description: 'Member has been removed from the system',
    color: 'error',
  })
  // Redirect back to members list
  navigateTo('/admin/memberships')
}
</script>
