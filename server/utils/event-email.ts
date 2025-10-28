import { sendEmail } from './email'

export interface EventRegistrationEmailParams {
  eventName: string
  attendeeName: string
  attendeeEmail: string
  eventDate: string
  eventLocation: string
  registrationId: string
  hasPaid?: boolean
}

export async function sendEventRegistrationEmail(params: EventRegistrationEmailParams) {
  const { eventName, attendeeName, attendeeEmail, eventDate, eventLocation, registrationId } =
    params

  const subject = `Registration Confirmed: ${eventName}`
  const formattedDate = new Date(eventDate).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Event Registration Confirmation</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: #f0fdfa; padding: 30px; border-radius: 10px; margin-bottom: 30px; text-align: center;">
        <h1 style="color: #0f766e; margin: 0 0 10px 0; font-size: 28px; font-weight: 700;">EPISON</h1>
        <p style="color: #0d9488; margin: 0; font-size: 18px;">Event Registration Confirmation</p>
      </div>
      
      <h2 style="color: #134e4a; margin-bottom: 20px; font-size: 22px; font-weight: 600;">Thank you for registering!</h2>
      
      <p style="margin-bottom: 20px;">Dear ${attendeeName},</p>
      
      <p style="margin-bottom: 20px;">You are successfully registered for <strong>${eventName}</strong>.</p>
      
      <div style="background: #f0fdfa; border-left: 4px solid #0d9488; padding: 15px; margin: 20px 0; border-radius: 4px;">
        <p style="margin: 0 0 10px 0; font-weight: 600; color: #134e4a;">Event Details:</p>
        <p style="margin: 5px 0;"><strong>Date & Time:</strong> ${formattedDate}</p>
        <p style="margin: 5px 0;"><strong>Location:</strong> ${eventLocation}</p>
        <p style="margin: 5px 0;"><strong>Registration ID:</strong> ${registrationId}</p>
      </div>
      
      <p style="margin-bottom: 20px;">
        We look forward to seeing you at the event. If you have any questions or need to make changes to your registration, 
        please contact us at <a href="mailto:events@epison.ng" style="color: #0d9488; text-decoration: none; font-weight: 500;">events@epison.ng</a>.
      </p>
      
      <div style="border-top: 1px solid #e5e7eb; margin-top: 30px; padding-top: 20px;">
        <p style="margin-bottom: 0;">
          Best regards,<br>
          <strong>The EPISON Events Team</strong>
        </p>
      </div>
    </body>
    </html>
  `

  try {
    await sendEmail({
      to: attendeeEmail,
      subject,
      htmlContent,
    })
    return { success: true }
  } catch (error) {
    console.error('Failed to send event registration email:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send email',
    }
  }
}
