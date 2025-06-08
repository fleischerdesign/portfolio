import nodemailer from 'nodemailer'

interface ContactForm {
    name: string
    email: string
    subject: string
    message: string
}

export default defineEventHandler(async (event) => {
    try {
        // Request Body parsen
        const body = await readBody<ContactForm>(event)

        // Validation
        if (!body.name || !body.email || !body.message) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Name, Email und Nachricht sind erforderlich'
            })
        }

        // Email validation (basic)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(body.email)) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Ungültige Email-Adresse'
            })
        }

        // Nodemailer Transporter konfigurieren
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: parseInt(process.env.SMTP_PORT || '587'),
            secure: process.env.SMTP_SECURE === 'true',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        })

        // Email Optionen
        const mailOptions = {
            from: `"${body.name}" <${process.env.SMTP_FROM}>`,
            to: process.env.CONTACT_EMAIL,
            replyTo: body.email,
            subject: body.subject || 'Neue Kontaktanfrage',
            html: `
        <h3>Neue Kontaktanfrage</h3>
        <p><strong>Name:</strong> ${body.name}</p>
        <p><strong>Email:</strong> ${body.email}</p>
        <p><strong>Betreff:</strong> ${body.subject || 'Kein Betreff'}</p>
        <p><strong>Nachricht:</strong></p>
        <p>${body.message.replace(/\n/g, '<br>')}</p>
      `,
            text: `
Neue Kontaktanfrage

Name: ${body.name}
Email: ${body.email}
Betreff: ${body.subject || 'Kein Betreff'}

Nachricht:
${body.message}
      `
        }

        // Email senden
        await transporter.sendMail(mailOptions)

        return {
            success: true,
            message: 'Email wurde erfolgreich gesendet'
        }

    } catch (error) {
        console.error('Email sending error:', error)

        throw createError({
            statusCode: 500,
            statusMessage: 'Fehler beim Senden der Email'
        })
    }
})