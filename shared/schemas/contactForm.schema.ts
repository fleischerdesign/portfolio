import { z } from 'zod'

export const ContactFormSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  email: z.string().trim().email('Invalid email address'),
  subject: z.string().trim().optional(),
  message: z.string().trim().min(1, 'Message is required'),
})

export type ContactForm = z.infer<typeof ContactFormSchema>
