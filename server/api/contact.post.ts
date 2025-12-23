import nodemailer from 'nodemailer'
import { z } from 'zod'

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event)
        const { smtp, contact } = useRuntimeConfig()

        const { name, email, subject, message } = ContactFormSchema.parse(body)

        const transporter = nodemailer.createTransport({
            host: smtp.host,
            port: parseInt(smtp.port || '587'),
            secure: smtp.secure === 'true',
            auth: {
                user: smtp.user,
                pass: smtp.pass,
            },
        })

        const mailOptions = {
            from: `"${name}" <${smtp.from}>`,
            to: contact.email,
            replyTo: email,
            subject: subject || 'Neue Kontaktanfrage',
            html: `
        <h3>Neue Kontaktanfrage</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Betreff:</strong> ${subject || 'Kein Betreff'}</p>
        <p><strong>Nachricht:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
            text: `
Neue Kontaktanfrage

Name: ${name}
Email: ${email}
Betreff: ${subject || 'Kein Betreff'}

Nachricht:
${message}
      `,
        }

        await transporter.sendMail(mailOptions)

        return {
            success: true,
            message: 'Email wurde erfolgreich gesendet',
        }
    }
    catch (error) {
        if (error instanceof z.ZodError) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Validierungsfehler',
                data: error.errors,
            })
        }

        console.error('Email sending error:', error)

        throw createError({
            statusCode: 500,
            statusMessage: 'Fehler beim Senden der Email',
        })
    }
})
