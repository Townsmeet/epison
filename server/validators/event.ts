import { z } from 'zod'

// ===== Event Core =====
export const eventTypeSchema = z.enum(['conference', 'workshop', 'webinar', 'seminar', 'symposium'])
export const eventStatusSchema = z.enum([
  'draft',
  'published',
  'registration_open',
  'registration_closed',
  'ongoing',
  'completed',
  'cancelled',
])

export const createEventSchema = z.object({
  title: z.string().min(1).max(200),
  slug: z
    .string()
    .min(1)
    .max(100)
    .regex(/^[a-z0-9-]+$/),
  type: eventTypeSchema,
  status: eventStatusSchema.default('draft'),
  startDate: z.string().datetime(),
  endDate: z.string().datetime().optional(),
  location: z.string().min(1).max(300),
  capacity: z.number().int().positive().optional(),
  description: z.string().max(5000).optional(),
  bannerUrl: z.string().url().optional(),
  membersOnly: z.boolean().default(false),
  collectsSubmissions: z.boolean().default(false),
})

export const updateEventSchema = createEventSchema.partial().omit({ slug: true })

// ===== Event Tickets =====
export const createEventTicketSchema = z.object({
  name: z.string().min(1).max(100),
  price: z.number().int().min(0), // kobo
  quantity: z.number().int().min(0),
  salesStart: z.string().datetime().optional(),
  salesEnd: z.string().datetime().optional(),
  description: z.string().max(1000).optional(),
  isPublic: z.boolean().default(true),
})

// ===== Event Sponsors =====
export const createEventSponsorSchema = z.object({
  name: z.string().min(1).max(150),
  tier: z.string().optional(),
  logoUrl: z.string().url().min(1),
  website: z.string().url().optional(),
})

// ===== Event Committee =====
export const createEventCommitteeMemberSchema = z.object({
  name: z.string().min(1).max(150),
  role: z.string().max(100).optional(),
  email: z.string().email().optional(),
  phone: z.string().max(50).optional(),
})

// ===== Event Media =====
export const createEventMediaSchema = z.object({
  url: z.string().url().min(1),
  caption: z.string().max(500).optional(),
  type: z.enum(['image', 'video']).optional(),
})

// ===== Event Registrations =====
export const registrationCategorySchema = z.enum([
  'Member',
  'Non-Member',
  'Student',
  'Speaker',
  'Sponsor',
])
export const paymentStatusSchema = z.enum(['Pending', 'Paid', 'Cancelled', 'Refunded'])

export const createEventRegistrationSchema = z.object({
  attendeeName: z.string().min(1).max(150),
  attendeeEmail: z.string().email(),
  category: registrationCategorySchema.optional(),
  ticketId: z.string().optional(),
  quantity: z.number().int().positive().default(1),
})

// ===== Abstract Submissions =====
export const submissionCategorySchema = z.enum(['oral', 'poster', 'workshop'])
export const submissionStatusSchema = z.enum([
  'pending',
  'under_review',
  'accepted',
  'rejected',
  'revision_required',
])

export const createAbstractSubmissionSchema = z.object({
  title: z.string().min(1).max(300),
  abstract: z.string().min(1).max(5000),
  authors: z.array(z.string().min(1)).min(1),
  correspondingAuthor: z.object({
    name: z.string().min(1),
    email: z.string().email(),
    affiliation: z.string().min(1),
    phone: z.string().optional(),
  }),
  keywords: z.array(z.string()).min(3).max(5),
  category: submissionCategorySchema,
  notes: z.string().max(1000).optional(),
})

// ===== Query Schemas =====
export const eventListQuerySchema = z.object({
  q: z.string().optional(),
  type: eventTypeSchema.optional(),
  status: eventStatusSchema.optional(),
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional(),
  upcoming: z.coerce.boolean().optional(),
  sort: z.string().default('-startDate'), // e.g., 'title', '-title', 'startDate', '-startDate', 'createdAt', '-createdAt'
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
})

// Registrations list query (admin)
export const registrationListQuerySchema = z.object({
  q: z.string().optional(),
  eventId: z.string().optional(),
  category: z.enum(['Member', 'Non-Member', 'Student', 'Speaker', 'Sponsor']).optional(),
  paymentStatus: z.enum(['Pending', 'Paid', 'Cancelled', 'Refunded']).optional(),
  sort: z.string().default('-registeredAt'), // 'attendeeName' | '-attendeeName' | 'registeredAt' | '-registeredAt'
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
})

// Submissions list query (admin)
export const submissionListQuerySchema = z.object({
  q: z.string().optional(),
  status: z
    .enum(['pending', 'under_review', 'accepted', 'rejected', 'revision_required'])
    .optional(),
  category: z.enum(['oral', 'poster', 'workshop']).optional(),
  sort: z.string().default('-submissionDate'), // 'title' | '-title' | 'submissionDate' | '-submissionDate'
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
})

// ===== Types =====
export type CreateEventRequest = z.infer<typeof createEventSchema>
export type CreateEventTicketRequest = z.infer<typeof createEventTicketSchema>
export type CreateEventRegistrationRequest = z.infer<typeof createEventRegistrationSchema>
export type CreateAbstractSubmissionRequest = z.infer<typeof createAbstractSubmissionSchema>
