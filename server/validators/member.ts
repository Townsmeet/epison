import { z } from 'zod'

// Schemas for member-related requests

export const createMemberSchema = z.object({
  // Required basics
  nameFirst: z.string().min(1, 'First name is required').max(100),
  nameFamily: z.string().min(1, 'Last name is required').max(100),
  email: z.string().email('Invalid email address').max(255),

  // Optional personal details
  title: z.string().max(100).optional(),
  nameMiddle: z.string().max(100).optional(),
  sex: z.string().max(50).optional(),
  dob: z.string().optional(), // expect YYYY-MM-DD if provided
  address: z.string().max(500).optional(),
  state: z.string().max(100).optional(),
  telephone: z.string().max(50).optional(),
  fax: z.string().max(50).optional(),
  avatar: z.string().url('Invalid URL').optional(),

  // Employment & Education
  position: z.string().max(100).optional(),
  employer: z.string().max(150).optional(),
  department: z.string().max(150).optional(),
  qualifications: z.string().max(1000).optional(),
  experience: z.string().max(2000).optional(),

  // Languages
  motherTongue: z.string().max(100).optional(),
  otherLanguages: z.array(z.string()).optional(),
  otherLanguageText: z.string().max(500).optional(),

  // Areas of Expertise
  expertiseDescription: z.string().max(2000).optional(),
  expertise: z.array(z.string()).optional(),
  expertiseOther: z.string().max(500).optional(),

  // Employment Classification
  agency: z.string().max(200).optional(),
  typeOfWork: z.string().max(200).optional(),
  typeOfWorkOther: z.string().max(200).optional(),
  retiredSince: z.string().optional(),

  // Membership Details
  membershipType: z.string().max(100).optional(),
  status: z.string().max(50).optional(),
  fees: z.number().min(0).optional(),
  paymentReference: z.string().max(100).optional(),

  // Related data
  publications: z.array(z.string().url('Invalid publication URL')).optional(),
})

export const updateMemberSchema = createMemberSchema.partial()

export const memberActionSchema = z.object({
  reason: z.string().max(1000).optional(),
  notes: z.string().max(2000).optional(),
  period: z.enum(['6 months', '1 year', '2 years']).optional(),
})

export const memberListQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().optional(),
  status: z.string().optional(),
  membershipType: z.string().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('asc').optional(),
})

export const memberStatsQuerySchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
})

// Member ID parameter validation
export const memberIdParamSchema = z.object({
  id: z.string().min(1, 'Member ID is required'),
})
