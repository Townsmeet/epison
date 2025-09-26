import { db } from './drizzle'
import { activityLog } from '../db/schema'

export type ActivityType = 'Registration' | 'Payment' | 'Event' | 'Membership'

export interface AddActivityInput {
  type: ActivityType
  title: string
  description?: string
  icon?: string
  iconColor?: string
  actorId?: string | null
  entityType?: 'event' | 'member' | 'registration' | 'payment' | string
  entityId?: string | null
  metadata?: Record<string, unknown> | null
}

// Simple defaults for icons/colors per type (UI uses these classes)
const typeDefaults: Record<ActivityType, { icon: string; iconColor: string }> = {
  Registration: { icon: 'i-heroicons-user-plus', iconColor: 'text-green-500' },
  Payment: { icon: 'i-heroicons-banknotes', iconColor: 'text-blue-500' },
  Event: { icon: 'i-heroicons-calendar', iconColor: 'text-purple-500' },
  Membership: { icon: 'i-heroicons-user-plus', iconColor: 'text-green-500' },
}

export async function addActivity(input: AddActivityInput): Promise<void> {
  const defaults = typeDefaults[input.type]
  const icon = input.icon || defaults?.icon
  const iconColor = input.iconColor || defaults?.iconColor

  // Serialize metadata to text if provided
  const metadataText = input.metadata ? JSON.stringify(input.metadata) : null

  await db.insert(activityLog).values({
    id: crypto.randomUUID(),
    type: input.type,
    title: input.title,
    description: input.description || null,
    icon: icon || null,
    iconColor: iconColor || null,
    actorId: input.actorId ?? null,
    entityType: input.entityType ?? null,
    entityId: input.entityId ?? null,
    metadata: metadataText,
    createdAt: new Date(),
  })
}
