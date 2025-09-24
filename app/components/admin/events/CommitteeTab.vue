<template>
  <div class="space-y-6">
    <!-- Add Committee Member -->
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-base font-semibold">Committee Members</h3>
        </div>
      </template>
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <UFormField label="Name" required>
          <UInput v-model="newMember.name" placeholder="Full name" />
        </UFormField>
        <UFormField label="Role">
          <UInput v-model="newMember.role" placeholder="Chair, Secretary, Logistics..." />
        </UFormField>
        <UFormField label="Email">
          <UInput v-model="newMember.email" type="email" placeholder="name@example.com" />
        </UFormField>
        <UFormField label="Phone">
          <UInput v-model="newMember.phone" placeholder="+234 ..." />
        </UFormField>
      </div>
      <div class="mt-4 flex justify-end">
        <UButton :disabled="!canAdd" icon="i-heroicons-plus" @click="addMember">Add Member</UButton>
      </div>
    </UCard>

    <!-- List -->
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-base font-semibold">Current Committee</h3>
          <span class="text-sm text-gray-500">{{ list.length }} total</span>
        </div>
      </template>

      <div v-if="list.length === 0" class="p-6 text-sm text-gray-500">
        No committee members yet.
      </div>

      <div v-else class="divide-y divide-gray-200 dark:divide-gray-700">
        <div
          v-for="m in list"
          :key="m.id"
          class="flex flex-col md:flex-row md:items-center justify-between gap-3 p-4"
        >
          <div>
            <div class="font-medium text-gray-900 dark:text-white">{{ m.name }}</div>
            <div class="text-sm text-gray-500 dark:text-gray-300">
              <span v-if="m.role">{{ m.role }}</span>
              <span v-if="m.role && (m.email || m.phone)" class="mx-2">•</span>
              <span v-if="m.email">{{ m.email }}</span>
              <span v-if="m.phone" class="ml-2">{{ m.phone }}</span>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <UButton
              color="neutral"
              variant="outline"
              icon="i-heroicons-pencil"
              @click="startEdit(m)"
            >
              Edit
            </UButton>
            <UButton
              color="error"
              variant="ghost"
              icon="i-heroicons-trash"
              @click="removeMember(m.id)"
            >
              Remove
            </UButton>
          </div>
        </div>
      </div>
    </UCard>

    <!-- Edit Modal -->
    <UModal v-model:open="isEditing">
      <template #content>
        <UCard>
          <template #header>
            <div class="flex items-center justify-between">
              <h3 class="text-base font-semibold">Edit Committee Member</h3>
              <UButton
                color="neutral"
                variant="ghost"
                icon="i-heroicons-x-mark"
                @click="isEditing = false"
              />
            </div>
          </template>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <UFormField label="Name" required>
              <UInput v-model="editMember.name" />
            </UFormField>
            <UFormField label="Role">
              <UInput v-model="editMember.role" />
            </UFormField>
            <UFormField label="Email">
              <UInput v-model="editMember.email" type="email" />
            </UFormField>
            <UFormField label="Phone">
              <UInput v-model="editMember.phone" />
            </UFormField>
          </div>

          <template #footer>
            <div class="flex justify-end gap-2">
              <UButton color="neutral" variant="ghost" @click="isEditing = false">Cancel</UButton>
              <UButton color="primary" @click="applyEdit">Save</UButton>
            </div>
          </template>
        </UCard>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import type { EventItem } from '~/composables/useEvents'

const props = defineProps<{ event: EventItem }>()

type CommitteeMember = { id: number; name: string; role?: string; email?: string; phone?: string }

// Local editable copy to avoid mutating prop directly
const list = ref<CommitteeMember[]>(
  props.event.committee ? [...(props.event.committee as CommitteeMember[])] : []
)

// Keep local list in sync if parent prop changes
watch(
  () => props.event.committee,
  val => {
    list.value = val ? [...(val as CommitteeMember[])] : []
  },
  { deep: true }
)

const newMember = reactive({
  name: '',
  role: '',
  email: '',
  phone: '',
})

const canAdd = computed(() => newMember.name.trim().length > 0)

function addMember() {
  if (!canAdd.value) return
  const m = {
    id: Date.now(),
    name: newMember.name.trim(),
    role: newMember.role?.trim() || undefined,
    email: newMember.email?.trim() || undefined,
    phone: newMember.phone?.trim() || undefined,
  }
  list.value.push(m)
  Object.assign(newMember, { name: '', role: '', email: '', phone: '' })
  useToast().add({ title: 'Member added', color: 'success' })
}

function removeMember(id: number) {
  const idx = list.value.findIndex(m => m.id === id)
  if (idx >= 0) {
    list.value.splice(idx, 1)
    useToast().add({ title: 'Member removed', color: 'neutral' })
  }
}

const isEditing = ref(false)
const editMember = reactive<{
  id?: number
  name: string
  role?: string
  email?: string
  phone?: string
}>({
  id: undefined,
  name: '',
  role: '',
  email: '',
  phone: '',
})

function startEdit(m: { id: number; name: string; role?: string; email?: string; phone?: string }) {
  Object.assign(editMember, m)
  isEditing.value = true
}

function applyEdit() {
  if (!editMember.id) return
  const idx = list.value.findIndex(m => m.id === editMember.id)
  if (idx >= 0) {
    list.value[idx] = {
      id: editMember.id,
      name: editMember.name.trim(),
      role: editMember.role?.trim() || undefined,
      email: editMember.email?.trim() || undefined,
      phone: editMember.phone?.trim() || undefined,
    }
    useToast().add({ title: 'Member updated', color: 'success' })
  }
  isEditing.value = false
}
</script>
