import { eq, and, isNotNull, gt } from 'drizzle-orm'
import { db } from './drizzle'
import { eventRegistration, member } from '../db/schema'
import { verifyPaystackTransaction } from './paystack'
import { addActivity } from './activity'

export async function verifyAllPendingPayments() {
  const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000)
  console.log(
    `[PaymentVerify] Starting bulk verification for payments since ${cutoff.toISOString()}...`
  )

  const results = {
    registrationsVerified: 0,
    membersVerified: 0,
    errors: 0,
  }

  // 1. Verify Event Registrations
  try {
    const pendingRegistrations = await db
      .select()
      .from(eventRegistration)
      .where(
        and(
          eq(eventRegistration.paymentStatus, 'Pending'),
          isNotNull(eventRegistration.reference),
          gt(eventRegistration.registeredAt, cutoff)
        )
      )

    console.log(
      `[PaymentVerify] Found ${pendingRegistrations.length} pending registrations to check.`
    )

    for (const reg of pendingRegistrations) {
      if (!reg.reference) continue

      try {
        const paystackInfo = await verifyPaystackTransaction(reg.reference)

        if (paystackInfo.status && paystackInfo.data.status === 'success') {
          // Update registration to Paid
          await db
            .update(eventRegistration)
            .set({
              paymentStatus: 'Paid',
              paidAt: paystackInfo.data.paid_at ? new Date(paystackInfo.data.paid_at) : new Date(),
              paymentMetaJson: JSON.stringify(paystackInfo.data),
            })
            .where(eq(eventRegistration.id, reg.id))

          await addActivity({
            type: 'Payment',
            title: 'Registration verified automatically',
            description: `Payment for ${reg.attendeeName} verified via Paystack cron`,
            entityType: 'registration',
            entityId: reg.id,
            metadata: { reference: reg.reference },
          })

          results.registrationsVerified++
        }
      } catch (err) {
        console.error(
          `[PaymentVerify] Failed to verify registration ${reg.id} (${reg.reference}):`,
          err
        )
        results.errors++
      }
    }
  } catch (err) {
    console.error('[PaymentVerify] Error querying pending registrations:', err)
    results.errors++
  }

  // 2. Verify Memberships
  try {
    const pendingMembers = await db
      .select()
      .from(member)
      .where(
        and(
          eq(member.status, 'pending'),
          isNotNull(member.paymentReference),
          gt(member.createdAt, cutoff)
        )
      )

    console.log(`[PaymentVerify] Found ${pendingMembers.length} pending members to check.`)

    for (const m of pendingMembers) {
      if (!m.paymentReference) continue

      try {
        const paystackInfo = await verifyPaystackTransaction(m.paymentReference)

        if (paystackInfo.status && paystackInfo.data.status === 'success') {
          // Update member to active
          await db
            .update(member)
            .set({
              status: 'active',
              joinedDate: paystackInfo.data.paid_at
                ? new Date(paystackInfo.data.paid_at).toISOString().split('T')[0]
                : m.joinedDate,
            })
            .where(eq(member.id, m.id))

          await addActivity({
            type: 'Membership',
            title: 'Membership payment verified automatically',
            description: `${m.nameFirst} ${m.nameFamily} verified via Paystack cron`,
            entityType: 'member',
            entityId: m.id,
            metadata: { reference: m.paymentReference },
          })

          results.membersVerified++
        }
      } catch (err) {
        console.error(
          `[PaymentVerify] Failed to verify member ${m.id} (${m.paymentReference}):`,
          err
        )
        results.errors++
      }
    }
  } catch (err) {
    console.error('[PaymentVerify] Error querying pending members:', err)
    results.errors++
  }

  console.log('[PaymentVerify] Bulk verification finished.', results)
  return results
}
