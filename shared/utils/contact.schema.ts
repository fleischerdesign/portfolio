import { z } from 'zod'

export const ContactFormSchema = z.object({
  name: z.string().min(1, 'Name ist erforderlich'),
  email: z.string().email('Ungültige Email-Adresse'),
  subject: z.string().optional(),
  message: z.string().min(1, 'Nachricht ist erforderlich'),
})

export type ContactForm = z.infer<typeof ContactFormSchema>
