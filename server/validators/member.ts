import { z } from 'zod'

// Schemas for member-related requests

export const createMemberSchema = z.object({
  // Required basics
  nameFirst: z.string().min(1, 'First name is required').max(100),
  nameFamily: z.string().min(1, 'Last name is required').max(100),
  email: z.string().email('Invalid email address').max(255),

  // Optional personal details
  title: z.string().max(100).optional().nullable(),
  nameMiddle: z.string().max(100).optional().nullable(),
  sex: z.string().max(50).optional().nullable(),
  dob: z.string().optional().nullable(), // expect YYYY-MM-DD if provided
  address: z.string().max(500).optional().nullable(),
  state: z.string().max(100).optional().nullable(),
  telephone: z.string().max(50).optional().nullable(),
  fax: z.string().max(50).optional().nullable(),
  avatar: z.string().url('Invalid URL').optional().nullable(),

  // Employment & Education
  position: z.string().max(100).optional().nullable(),
  employer: z.string().max(150).optional().nullable(),
  department: z.string().max(150).optional().nullable(),
  qualifications: z.string().max(1000).optional().nullable(),
  experience: z.string().max(2000).optional().nullable(),

  // Languages
  motherTongue: z.string().max(100).optional().nullable(),
  otherLanguages: z.array(z.string()).optional().nullable(),
  otherLanguageText: z.string().max(500).optional().nullable(),

  // Areas of Expertise
  expertiseDescription: z.string().max(2000).optional().nullable(),
  expertise: z.array(z.string()).optional().nullable(),
  expertiseOther: z.string().max(500).optional().nullable(),

  // Employment Classification
  agency: z.string().max(200).optional().nullable(),
  typeOfWork: z.string().max(200).optional().nullable(),
  typeOfWorkOther: z.string().max(200).optional().nullable(),
  retiredSince: z.string().optional().nullable(),

  // Membership Details
  membershipType: z.string().max(100).optional().nullable(),
  status: z.string().max(50).optional().nullable(),
  fees: z.number().min(0).optional().nullable(),
  paymentReference: z.string().max(100).optional().nullable(),

  // Related data
  publications: z.array(z.string().url('Invalid publication URL')).optional().nullable(),
})

export const updateMemberSchema = createMemberSchema.partial()

export const memberActionSchema = z.object({
  reason: z.string().max(1000).optional().nullable(),
  notes: z.string().max(2000).optional().nullable(),
  period: z.enum(['6 months', '1 year', '2 years']).optional().nullable(),
})

export const memberListQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().optional(),
  status: z.string().optional(),
  membershipType: z.string().optional(),
  paymentStatus: z.string().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('asc').optional(),
  geopoliticalZone: z.string().optional(),
  expiryBefore: z.string().optional(), // expect YYYY-MM-DD
  expiryAfter: z.string().optional(), // expect YYYY-MM-DD
})

export const memberStatsQuerySchema = z.object({
  startDate: z.string().optional().nullable(),
  endDate: z.string().optional().nullable(),
})

// Member ID parameter validation
export const memberIdParamSchema = z.object({
  id: z.string().min(1, 'Member ID is required'),
})

// Renewal schema - only email can be updated
export const renewMemberSchema = z.object({
  email: z.string().email('Invalid email address').max(255).optional(),
  fees: z.number().min(0, 'Fee amount must be positive'),
  paymentReference: z.string().min(1, 'Payment reference is required').max(100),
})
