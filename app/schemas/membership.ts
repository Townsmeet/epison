import { z } from 'zod'

// Step 1: Personal Information Schema
export const personalInfoSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  nameFamily: z.string().min(1, 'Family name is required').max(100),
  nameMiddle: z.string().max(100).optional(),
  nameFirst: z.string().min(1, 'First name is required').max(100),
  sex: z.string().min(1, 'Sex is required'),
  dob: z.string().min(1, 'Date of birth is required'),
  address: z.string().min(1, 'Address is required').max(500),
  telephone: z.string().min(1, 'Telephone is required').max(50),
  fax: z.string().max(50).optional(),
  email: z.string().email('Invalid email address').max(255),
})

// Step 2: Employment Schema
export const employmentSchema = z.object({
  position: z.string().min(1, 'Position is required').max(100),
  employer: z.string().min(1, 'Employer is required').max(150),
  department: z.string().max(150).optional(),
  qualifications: z.string().max(1000).optional(),
  experience: z.string().max(2000).optional(),
})

// Step 3: Languages Schema
export const languagesSchema = z.object({
  motherTongue: z.string().max(100).optional(),
  otherLanguages: z.array(z.string()).optional(),
  otherLanguageText: z.string().max(500).optional(),
})

// Step 4: Expertise Schema
export const expertiseSchema = z.object({
  expertiseDescription: z.string().max(2000).optional(),
  expertise: z.array(z.string()).optional(),
  expertiseOther: z.string().max(500).optional(),
})

// Step 5: Classification Schema
export const classificationSchema = z.object({
  agency: z.string().max(200).optional(),
  typeOfWork: z.string().max(200).optional(),
  typeOfWorkOther: z.string().max(200).optional(),
  retiredSince: z.string().optional(),
})

// Step 6: Payment Schema
export const paymentSchema = z.object({
  membershipType: z.string().min(1, 'Membership type is required'),
  fees: z.number().min(0, 'Fee amount must be positive'),
})

// Combined schema for the entire form
export const membershipFormSchema = z.object({
  // Personal Information
  ...personalInfoSchema.shape,
  // Employment & Education
  ...employmentSchema.shape,
  // Languages
  ...languagesSchema.shape,
  // Areas of Expertise
  ...expertiseSchema.shape,
  // Employment Classification
  ...classificationSchema.shape,
  // Payment Details
  ...paymentSchema.shape,
  // Additional fields
  publications: z.array(z.instanceof(File)).default([]),
})

// Export types
export type PersonalInfoData = z.infer<typeof personalInfoSchema>
export type EmploymentData = z.infer<typeof employmentSchema>
export type LanguagesData = z.infer<typeof languagesSchema>
export type ExpertiseData = z.infer<typeof expertiseSchema>
export type ClassificationData = z.infer<typeof classificationSchema>
export type PaymentData = z.infer<typeof paymentSchema>
export type MembershipFormData = z.infer<typeof membershipFormSchema>
