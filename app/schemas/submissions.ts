import { z } from 'zod'

// Abstract Submission Schema
export const abstractSubmissionSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  abstract: z
    .string()
    .min(1, 'Abstract is required')
    .max(2000, 'Abstract must be less than 2000 characters'),
  authors: z
    .array(z.string().min(1, 'Author name is required'))
    .min(1, 'At least one author is required'),
  correspondingAuthor: z.object({
    name: z
      .string()
      .min(1, 'Corresponding author name is required')
      .max(100, 'Name must be less than 100 characters'),
    email: z
      .string()
      .email('Invalid email address')
      .max(100, 'Email must be less than 100 characters'),
    affiliation: z
      .string()
      .min(1, 'Affiliation is required')
      .max(200, 'Affiliation must be less than 200 characters'),
    phone: z.string().max(20, 'Phone number must be less than 20 characters').optional(),
  }),
  keywords: z
    .array(z.string().min(1, 'Keyword is required'))
    .min(1, 'At least one keyword is required')
    .max(10, 'Maximum 10 keywords allowed'),
  category: z.enum(['oral', 'poster', 'workshop']),
  notes: z.string().max(1000, 'Notes must be less than 1000 characters').optional(),
})

// Export type
export type AbstractSubmissionData = z.infer<typeof abstractSubmissionSchema>
