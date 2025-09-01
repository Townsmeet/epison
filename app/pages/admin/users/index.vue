<template>
  <div>
    <!-- Header with actions -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Users</h1>
        <p class="text-gray-600 dark:text-gray-400">Manage user accounts and permissions</p>
      </div>
      <div class="flex space-x-3">
        <UButton
          color="neutral"
          variant="outline"
          icon="i-heroicons-arrow-down-tray"
          @click="exportUsers"
        >
          Export
        </UButton>
        <UButton color="primary" icon="i-heroicons-plus" @click="isCreateUserOpen = true">
          Add User
        </UButton>
      </div>
    </div>

    <!-- Filters and search -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <UInput
          v-model="searchQuery"
          placeholder="Search users..."
          icon="i-heroicons-magnifying-glass"
        />
        <USelect v-model="selectedRole" :options="roleOptions" placeholder="Filter by role" />
        <USelect v-model="selectedStatus" :options="statusOptions" placeholder="Filter by status" />
        <UButton color="neutral" variant="outline" icon="i-heroicons-funnel" @click="clearFilters">
          Clear Filters
        </UButton>
      </div>
    </div>

    <!-- Users table -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                User
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                Role
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                Last Login
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                Joined
              </th>
              <th class="relative px-6 py-3">
                <span class="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr
              v-for="user in filteredUsers"
              :key="user.id"
              class="hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10">
                    <div
                      class="h-10 w-10 rounded-full bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center"
                    >
                      <span class="text-white font-semibold text-sm">{{
                        getInitials(user.name)
                      }}</span>
                    </div>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900 dark:text-white">
                      {{ user.name }}
                    </div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">{{ user.email }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <UBadge :color="getRoleColor(user.role)" size="sm">{{ user.role }}</UBadge>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <UBadge :color="getStatusColor(user.status)" size="sm">{{ user.status }}</UBadge>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {{ formatDate(user.lastLogin) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {{ formatDate(user.createdAt) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <UDropdown :items="getUserActions(user)">
                  <UButton
                    color="neutral"
                    variant="ghost"
                    icon="i-heroicons-ellipsis-horizontal"
                    size="sm"
                  />
                </UDropdown>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div
        class="bg-white dark:bg-gray-800 px-4 py-3 border-t border-gray-200 dark:border-gray-700"
      >
        <div class="flex items-center justify-between">
          <div class="text-sm text-gray-700 dark:text-gray-300">
            Showing {{ (currentPage - 1) * pageSize + 1 }} to
            {{ Math.min(currentPage * pageSize, totalUsers) }} of {{ totalUsers }} users
          </div>
          <div class="flex space-x-2">
            <UButton
              :disabled="currentPage === 1"
              color="neutral"
              variant="outline"
              size="sm"
              icon="i-heroicons-chevron-left"
              @click="currentPage--"
            />
            <UButton
              :disabled="currentPage === totalPages"
              color="neutral"
              variant="outline"
              size="sm"
              icon="i-heroicons-chevron-right"
              @click="currentPage++"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Create User Modal -->
    <UModal v-model:open="isCreateUserOpen">
      <template #content>
        <UCard>
          <template #header>
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold">Add New User</h3>
              <UButton
                color="neutral"
                variant="ghost"
                icon="i-heroicons-x-mark"
                @click="isCreateUserOpen = false"
              />
            </div>
          </template>

          <UForm :state="newUser" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <UFormField label="First Name" name="firstName" required>
                <UInput v-model="newUser.firstName" />
              </UFormField>
              <UFormField label="Last Name" name="lastName" required>
                <UInput v-model="newUser.lastName" />
              </UFormField>
            </div>

            <UFormField label="Email" name="email" required>
              <UInput v-model="newUser.email" type="email" />
            </UFormField>

            <UFormField label="Role" name="role" required>
              <USelect
                v-model="newUser.role"
                :options="roleOptions.filter(r => r.value !== 'all')"
                placeholder="Select role"
              />
            </UFormField>

            <UFormField label="Phone" name="phone">
              <UInput v-model="newUser.phone" />
            </UFormField>

            <UFormField label="Organization" name="organization">
              <UInput v-model="newUser.organization" />
            </UFormField>
          </UForm>

          <template #footer>
            <div class="flex justify-end space-x-3">
              <UButton color="neutral" variant="ghost" @click="isCreateUserOpen = false">
                Cancel
              </UButton>
              <UButton color="primary" :loading="isCreating" @click="createUser">
                Create User
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

// Local types
interface UserItem {
  id: number
  name: string
  email: string
  role: string
  status: string
  lastLogin: string
  createdAt: string
  phone: string
  organization: string
}

const isCreateUserOpen = ref(false)
const isCreating = ref(false)
const searchQuery = ref('')
const selectedRole = ref('all')
const selectedStatus = ref('all')
const currentPage = ref(1)
const pageSize = 10

const roleOptions = [
  { label: 'All Roles', value: 'all' },
  { label: 'Admin', value: 'admin' },
  { label: 'Member', value: 'member' },
  { label: 'Student', value: 'student' },
  { label: 'Guest', value: 'guest' },
]

const statusOptions = [
  { label: 'All Status', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
  { label: 'Suspended', value: 'suspended' },
]

const newUser = ref({
  firstName: '',
  lastName: '',
  email: '',
  role: '',
  phone: '',
  organization: '',
})

// Mock data
const users = ref<UserItem[]>([
  {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'admin',
    status: 'active',
    lastLogin: '2024-08-20',
    createdAt: '2024-01-15',
    phone: '+234 801 234 5678',
    organization: 'EPISON',
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    role: 'member',
    status: 'active',
    lastLogin: '2024-08-19',
    createdAt: '2024-02-10',
    phone: '+234 802 345 6789',
    organization: 'University of Lagos',
  },
  {
    id: 3,
    name: 'Dr. Michael Brown',
    email: 'michael.brown@example.com',
    role: 'member',
    status: 'inactive',
    lastLogin: '2024-07-15',
    createdAt: '2024-01-20',
    phone: '+234 803 456 7890',
    organization: 'Lagos State University',
  },
])

const filteredUsers = computed(() => {
  let filtered = users.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(
      user =>
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.organization.toLowerCase().includes(query)
    )
  }

  if (selectedRole.value !== 'all') {
    filtered = filtered.filter(user => user.role === selectedRole.value)
  }

  if (selectedStatus.value !== 'all') {
    filtered = filtered.filter(user => user.status === selectedStatus.value)
  }

  return filtered
})

const totalUsers = computed(() => filteredUsers.value.length)
const totalPages = computed(() => Math.ceil(totalUsers.value / pageSize))

function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
}

function getRoleColor(
  role: string
): 'neutral' | 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'error' {
  const colors: Record<
    string,
    'neutral' | 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'error'
  > = {
    admin: 'error',
    member: 'info',
    student: 'success',
    guest: 'neutral',
  }
  return colors[role] || 'neutral'
}

function getStatusColor(
  status: string
): 'neutral' | 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'error' {
  const colors: Record<
    string,
    'neutral' | 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'error'
  > = {
    active: 'success',
    inactive: 'neutral',
    suspended: 'error',
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

function getUserActions(user: UserItem) {
  return [
    [
      { label: 'View Profile', icon: 'i-heroicons-eye', click: () => viewUser(user.id) },
      { label: 'Edit User', icon: 'i-heroicons-pencil', click: () => editUser(user.id) },
    ],
    [
      {
        label: user.status === 'active' ? 'Suspend User' : 'Activate User',
        icon: user.status === 'active' ? 'i-heroicons-no-symbol' : 'i-heroicons-check-circle',
        click: () => toggleUserStatus(user.id),
      },
      { label: 'Delete User', icon: 'i-heroicons-trash', click: () => deleteUser(user.id) },
    ],
  ]
}

function clearFilters() {
  searchQuery.value = ''
  selectedRole.value = 'all'
  selectedStatus.value = 'all'
}

function exportUsers() {
  // Implementation for exporting users
  useToast().add({
    title: 'Export started',
    description: 'Users data is being exported...',
    color: 'info',
  })
}

function viewUser(id: number) {
  navigateTo(`/admin/users/${id}`)
}

function editUser(id: number) {
  navigateTo(`/admin/users/${id}/edit`)
}

function toggleUserStatus(_id: number) {
  // Implementation for toggling user status
  useToast().add({
    title: 'Status updated',
    description: 'User status has been updated',
    color: 'success',
  })
}

function deleteUser(_id: number) {
  // Implementation for deleting user
  useToast().add({
    title: 'User deleted',
    description: 'User has been removed from the system',
    color: 'error',
  })
}

async function createUser() {
  isCreating.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Reset form
    newUser.value = {
      firstName: '',
      lastName: '',
      email: '',
      role: '',
      phone: '',
      organization: '',
    }

    isCreateUserOpen.value = false

    useToast().add({
      title: 'User created',
      description: 'New user has been added successfully',
      color: 'success',
    })
  } catch {
    useToast().add({
      title: 'Error',
      description: 'Failed to create user',
      color: 'error',
    })
  } finally {
    isCreating.value = false
  }
}
</script>
