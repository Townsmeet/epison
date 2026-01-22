import { z } from 'zod'
import { defineEventHandler } from 'h3'
import { sendEmail } from '../utils/email'
import { validateBody } from '../validators'

const ContactSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(5),
  subject: z.string().min(1),
  message: z.string().min(1),
})

type ContactInput = z.infer<typeof ContactSchema>

export default defineEventHandler(async event => {
  const body = await validateBody(event, ContactSchema, 'Invalid contact form submission')

  const { firstName, lastName, email, phone, subject, message } = body as ContactInput

  const fullName = `${firstName} ${lastName}`.trim()

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>New Contact Message</title>
      <style>
        body { font-family: Arial, sans-serif; color: #111827; }
        .container { max-width: 640px; margin: 0 auto; padding: 24px; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px; }
        .muted { color: #6b7280; font-size: 14px; }
        .label { color: #374151; font-weight: 600; }
        .value { color: #111827; }
        .divider { border-top: 1px solid #e5e7eb; margin: 16px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <h2>New contact message</h2>
        <p class="muted">You received a new message from the EPISON website contact form.</p>
        <div class="divider"></div>
        <p><span class="label">From:</span> <span class="value">${fullName} &lt;${email}&gt;</span></p>
        <p><span class="label">Phone:</span> <span class="value">${phone}</span></p>
        <p><span class="label">Subject:</span> <span class="value">${subject}</span></p>
        <div class="divider"></div>
        <p class="label">Message</p>
        <p class="value">${message.replace(/\n/g, '<br/>')}</p>
      </div>
    </body>
    </html>
  `

  const emailSubject = `[Contact] ${subject} — ${fullName}`

  await sendEmail({
    to: 'nonye_2006@yahoo.com',
    cc: ['townsmeet@gmail.com', 'kelvinospore@gmail.com', 'benyita2001@yahoo.com'],
    subject: emailSubject,
    htmlContent,
  })

  return { success: true }
})
