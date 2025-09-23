import { z } from 'zod'

// Login Schema
export const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Must be at least 8 characters'),
  remember: z.boolean().default(false),
})

// Reset Password Schema
export const resetPasswordSchema = z
  .object({
    password: z.string().min(8, 'Must be at least 8 characters'),
    confirm: z.string().min(8, 'Must be at least 8 characters'),
  })
  .refine(data => data.password === data.confirm, {
    message: "Passwords don't match",
    path: ['confirm'],
  })

// Export types
export type LoginData = z.infer<typeof loginSchema>
export type ResetPasswordData = z.infer<typeof resetPasswordSchema>
