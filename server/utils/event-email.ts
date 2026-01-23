import { sendEmail } from './email'

import type { MemberDetail } from '../../types/members'

export interface EventRegistrationEmailParams {
  eventName: string
  attendeeName: string
  attendeeEmail: string
  eventDate: string
  eventLocation: string
  registrationId: string
  hasPaid?: boolean
  ticketName?: string
  paymentReference?: string | null
}

export async function sendEventRegistrationEmail(params: EventRegistrationEmailParams) {
  const {
    eventName,
    attendeeName,
    attendeeEmail,
    eventDate,
    eventLocation,
    registrationId,
    ticketName,
    paymentReference,
  } = params

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
        ${ticketName ? `<p style="margin: 5px 0;"><strong>Ticket Type:</strong> ${ticketName}</p>` : ''}
        <p style="margin: 5px 0;"><strong>${paymentReference ? 'Payment Reference' : 'Registration ID'}:</strong> ${paymentReference || registrationId}</p>
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

export interface MembershipRenewalEmailParams {
  memberName: string
  memberEmail: string
  membershipType: string
  memberId: string
  paymentReference: string
  fees: number
  newExpiryDate: string
}

export async function sendMembershipRenewalEmail(params: MembershipRenewalEmailParams) {
  const {
    memberName,
    memberEmail,
    membershipType,
    memberId,
    paymentReference,
    fees,
    newExpiryDate,
  } = params

  const subject = `Membership Renewal Confirmed - EPISON`
  const formattedFees = new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
  }).format(fees)

  const formattedExpiryDate = new Date(newExpiryDate).toLocaleDateString('en-NG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Membership Renewal Confirmation</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: #f0fdfa; padding: 30px; border-radius: 10px; margin-bottom: 30px; text-align: center;">
        <h1 style="color: #0f766e; margin: 0 0 10px 0; font-size: 28px; font-weight: 700;">EPISON</h1>
        <p style="color: #0d9488; margin: 0; font-size: 18px;">Membership Renewal Confirmation</p>
      </div>
      
      <h2 style="color: #134e4a; margin-bottom: 20px; font-size: 22px; font-weight: 600;">Your Membership Has Been Renewed!</h2>
      
      <p style="margin-bottom: 20px;">Dear ${memberName},</p>
      
      <p style="margin-bottom: 20px;">Thank you for renewing your membership with the <strong>Epidemiological Society of Nigeria (EPISON)</strong>. We are delighted to have your continued support.</p>
      
      <div style="background: #f0fdfa; border-left: 4px solid #0d9488; padding: 15px; margin: 20px 0; border-radius: 4px;">
        <p style="margin: 0 0 10px 0; font-weight: 600; color: #134e4a;">Renewal Details:</p>
        <p style="margin: 5px 0;"><strong>Membership Type:</strong> ${membershipType}</p>
        <p style="margin: 5px 0;"><strong>Member ID:</strong> ${memberId}</p>
        <p style="margin: 5px 0;"><strong>Payment Reference:</strong> ${paymentReference}</p>
        <p style="margin: 5px 0;"><strong>Amount Paid:</strong> ${formattedFees}</p>
        <p style="margin: 5px 0;"><strong>Valid Until:</strong> ${formattedExpiryDate}</p>
      </div>

      <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 4px;">
        <p style="margin: 0; font-weight: 600; color: #92400e;">📅 Important Reminder</p>
        <p style="margin: 10px 0 0 0; color: #92400e;">Your membership follows a calendar year cycle. Remember to renew at the start of each year to maintain your active status and access to member benefits.</p>
      </div>
      
      <p style="margin-bottom: 20px;">
        As an active member, you continue to enjoy:
      </p>
      <ul style="margin-bottom: 20px; padding-left: 20px;">
        <li>Access to exclusive events and conferences</li>
        <li>Networking opportunities with epidemiology professionals</li>
        <li>Member-only resources and publications</li>
        <li>Discounted rates on EPISON events</li>
      </ul>
      
      <p style="margin-bottom: 20px;">
        If you have any questions, please contact us at <a href="mailto:info@epison.ng" style="color: #0d9488; text-decoration: none; font-weight: 500;">info@epison.ng</a>.
      </p>
      
      <div style="border-top: 1px solid #e5e7eb; margin-top: 30px; padding-top: 20px;">
        <p style="margin-bottom: 0;">
          Best regards,<br>
          <strong>The EPISON Membership Team</strong>
        </p>
      </div>
    </body>
    </html>
  `

  try {
    await sendEmail({
      to: memberEmail,
      subject,
      htmlContent,
    })

    // Send notification to admin
    const adminNotificationContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Membership Renewal Notification</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: #f0fdfa; padding: 30px; border-radius: 10px; margin-bottom: 30px; text-align: center;">
        <h1 style="color: #0f766e; margin: 0 0 10px 0; font-size: 28px; font-weight: 700;">EPISON</h1>
        <p style="color: #0d9488; margin: 0; font-size: 18px;">Membership Renewal Notification</p>
      </div>
      
      <h2 style="color: #134e4a; margin-bottom: 20px; font-size: 22px; font-weight: 600;">Member Renewal Processed</h2>
      
      <p style="margin-bottom: 20px;">A member has renewed their membership:</p>
      
      <div style="background: #f0fdfa; border-left: 4px solid #0d9488; padding: 15px; margin: 20px 0; border-radius: 4px;">
        <p style="margin: 0 0 10px 0; font-weight: 600; color: #134e4a;">Renewal Details:</p>
        <p style="margin: 5px 0;"><strong>Name:</strong> ${memberName}</p>
        <p style="margin: 5px 0;"><strong>Email:</strong> ${memberEmail}</p>
        <p style="margin: 5px 0;"><strong>Membership Type:</strong> ${membershipType}</p>
        <p style="margin: 5px 0;"><strong>Member ID:</strong> ${memberId}</p>
        <p style="margin: 5px 0;"><strong>Payment Reference:</strong> ${paymentReference}</p>
        <p style="margin: 5px 0;"><strong>Amount:</strong> ${formattedFees}</p>
        <p style="margin: 5px 0;"><strong>Valid Until:</strong> ${formattedExpiryDate}</p>
      </div>
      
      <div style="border-top: 1px solid #e5e7eb; margin-top: 30px; padding-top: 20px;">
        <p style="margin-bottom: 0;">
          Best regards,<br>
          <strong>EPISON System</strong>
        </p>
      </div>
    </body>
    </html>
    `

    await sendEmail({
      to: 'kelvinospore@gmail.com',
      cc: ['townsmeet@gmail.com'],
      subject: `Membership Renewal: ${memberName}`,
      htmlContent: adminNotificationContent,
    })

    return { success: true }
  } catch (error) {
    console.error('Failed to send membership renewal email:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send email',
    }
  }
}

export interface MembershipApplicationEmailParams {
  member: MemberDetail
}

function escapeHtml(unsafe: string | undefined | null): string {
  if (!unsafe) return ''
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

export async function sendMembershipApplicationEmail(params: MembershipApplicationEmailParams) {
  const { member } = params

  const subject = `Membership Application Received - EPISON`
  const formattedFees = new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
  }).format(member.fees)

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Membership Application Confirmation</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: #f0fdfa; padding: 30px; border-radius: 10px; margin-bottom: 30px; text-align: center;">
        <h1 style="color: #0f766e; margin: 0 0 10px 0; font-size: 28px; font-weight: 700;">EPISON</h1>
        <p style="color: #0d9488; margin: 0; font-size: 18px;">Membership Application Confirmation</p>
      </div>
      
      <h2 style="color: #134e4a; margin-bottom: 20px; font-size: 22px; font-weight: 600;">Thank you for your application!</h2>
      
      <p style="margin-bottom: 20px;">Dear ${escapeHtml(member.nameFirst)} ${escapeHtml(member.nameFamily)},</p>
      
      <p style="margin-bottom: 20px;">We have successfully received your membership application for the <strong>Epidemiological Society of Nigeria (EPISON)</strong>.</p>
      
      <div style="background: #f0fdfa; border-left: 4px solid #0d9488; padding: 15px; margin: 20px 0; border-radius: 4px;">
        <p style="margin: 0 0 10px 0; font-weight: 600; color: #134e4a;">Application Details:</p>
        <p style="margin: 5px 0;"><strong>Membership Type:</strong> ${escapeHtml(member.membershipType)}</p>
        <p style="margin: 5px 0;"><strong>Application ID:</strong> ${escapeHtml(member.id)}</p>
        ${member.paymentReference ? `<p style="margin: 5px 0;"><strong>Payment Reference:</strong> ${escapeHtml(member.paymentReference)}</p>` : ''}
        ${member.fees > 0 ? `<p style="margin: 5px 0;"><strong>Membership Fee:</strong> ${formattedFees}</p>` : ''}
      </div>
      
      <p style="margin-bottom: 20px;">
        Your application is currently under review. We will notify you once your membership has been approved. 
        ${member.fees > 0 && !member.paymentReference ? 'Please complete your payment to finalize your application.' : ''}
      </p>
      
      <p style="margin-bottom: 20px;">
        If you have any questions or need to make changes to your application, 
        please contact us at <a href="mailto:info@epison.ng" style="color: #0d9488; text-decoration: none; font-weight: 500;">info@epison.ng</a>.
      </p>
      
      <div style="border-top: 1px solid #e5e7eb; margin-top: 30px; padding-top: 20px;">
        <p style="margin-bottom: 0;">
          Best regards,<br>
          <strong>The EPISON Membership Team</strong>
        </p>
      </div>
    </body>
    </html>
  `

  // Send notification to admin
  const adminNotificationContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Membership Application</title>
      <style>
        .section { margin-bottom: 20px; padding: 15px; background: #f9fafb; border-radius: 8px; }
        .section-title { font-weight: bold; color: #134e4a; border-bottom: 1px solid #e5e7eb; margin-bottom: 10px; padding-bottom: 5px; }
        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .label { font-weight: 600; color: #4b5563; }
        .value { color: #111827; }
      </style>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 20px;">
      <div style="background: #f0fdfa; padding: 30px; border-radius: 10px; margin-bottom: 30px; text-align: center;">
        <h1 style="color: #0f766e; margin: 0 0 10px 0; font-size: 28px; font-weight: 700;">EPISON</h1>
        <p style="color: #0d9488; margin: 0; font-size: 18px;">New Membership Application</p>
      </div>
      
      <h2 style="color: #134e4a; margin-bottom: 20px; font-size: 22px; font-weight: 600;">New Application Received</h2>
      
      <p style="margin-bottom: 20px;">A new membership application has been submitted with the following details:</p>
      
      <div class="section">
        <div class="section-title">Personal Information</div>
        <p><span class="label">Name:</span> <span class="value">${escapeHtml(member.title)} ${escapeHtml(member.nameFirst)} ${escapeHtml(member.nameMiddle)} ${escapeHtml(member.nameFamily)}</span></p>
        <p><span class="label">Email:</span> <span class="value">${escapeHtml(member.email)}</span></p>
        <p><span class="label">Sex:</span> <span class="value">${escapeHtml(member.sex) || 'N/A'}</span></p>
        <p><span class="label">Date of Birth:</span> <span class="value">${escapeHtml(member.dob) || 'N/A'}</span></p>
        <p><span class="label">Telephone:</span> <span class="value">${escapeHtml(member.telephone) || 'N/A'}</span></p>
        <p><span class="label">Address:</span> <span class="value">${escapeHtml(member.address) || 'N/A'}</span></p>
      </div>

      <div class="section">
        <div class="section-title">Employment & Education</div>
        <p><span class="label">Position:</span> <span class="value">${escapeHtml(member.position) || 'N/A'}</span></p>
        <p><span class="label">Employer:</span> <span class="value">${escapeHtml(member.employer) || 'N/A'}</span></p>
        <p><span class="label">Department:</span> <span class="value">${escapeHtml(member.department) || 'N/A'}</span></p>
        <p><span class="label">Qualifications:</span> <span class="value">${escapeHtml(member.qualifications) || 'N/A'}</span></p>
        <p><span class="label">Experience:</span> <span class="value">${escapeHtml(member.experience) || 'N/A'}</span></p>
      </div>

      <div class="section">
        <div class="section-title">Languages & Expertise</div>
        <p><span class="label">Mother Tongue:</span> <span class="value">${escapeHtml(member.motherTongue) || 'N/A'}</span></p>
        <p><span class="label">Other Languages:</span> <span class="value">${member.otherLanguages?.map(l => escapeHtml(l)).join(', ') || 'None'}</span></p>
        <p><span class="label">Expertise Areas:</span> <span class="value">${member.expertise?.map(e => escapeHtml(e)).join(', ') || 'None'}</span></p>
        <p><span class="label">Expertise Description:</span> <span class="value">${escapeHtml(member.expertiseDescription) || 'N/A'}</span></p>
      </div>

      <div class="section">
        <div class="section-title">Membership & Payment</div>
        <p><span class="label">Membership Type:</span> <span class="value">${escapeHtml(member.membershipType)}</span></p>
        <p><span class="label">Application ID:</span> <span class="value">${escapeHtml(member.id)}</span></p>
        <p><span class="label">Fees:</span> <span class="value">${formattedFees}</span></p>
        <p><span class="label">Payment Reference:</span> <span class="value">${escapeHtml(member.paymentReference) || 'Pending'}</span></p>
      </div>

      ${
        member.publications && member.publications.length > 0
          ? `
      <div class="section">
        <div class="section-title">Publications</div>
        <ul>
          ${member.publications.map(pub => `<li>${escapeHtml(pub)}</li>`).join('')}
        </ul>
      </div>
      `
          : ''
      }
      
      <p style="margin-bottom: 20px;">
        Please review this application in the admin dashboard at your earliest convenience.
      </p>
      
      <div style="border-top: 1px solid #e5e7eb; margin-top: 30px; padding-top: 20px;">
        <p style="margin-bottom: 0;">
          Best regards,<br>
          <strong>EPISON System</strong>
        </p>
      </div>
    </body>
    </html>
    `

  try {
    // Send both emails in parallel
    await Promise.all([
      // Send confirmation to applicant
      sendEmail({
        to: member.email,
        subject,
        htmlContent,
      }),
      // Send notification to admin
      sendEmail({
        to: 'kelvinospore@gmail.com',
        cc: ['townsmeet@gmail.com'],
        subject: `New Membership Application: ${member.nameFirst} ${member.nameFamily}`,
        htmlContent: adminNotificationContent,
      }),
    ])

    return { success: true }
  } catch (error) {
    console.error('Failed to send membership application email:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send email',
    }
  }
}
