export interface PaystackTransactionResponse {
  status: boolean
  message: string
  data: {
    id: number
    domain: string
    status: 'success' | 'failed' | 'ongoing' | 'pending' | string
    reference: string
    amount: number
    message: string | null
    gateway_response: string
    paid_at: string | null
    created_at: string
    channel: string
    currency: string
    ip_address: string
    metadata: Record<string, unknown>
    log: Record<string, unknown>
    fees: number
    customer: Record<string, unknown>
    authorization: Record<string, unknown>
    plan: Record<string, unknown>
  }
}

export async function verifyPaystackTransaction(
  reference: string
): Promise<PaystackTransactionResponse> {
  const config = useRuntimeConfig()
  const secretKey = config.paystackSecretKey

  if (!secretKey) {
    throw new Error('Paystack secret key is not configured')
  }

  const response = await $fetch<PaystackTransactionResponse>(
    `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
    {
      headers: {
        Authorization: `Bearer ${secretKey}`,
      },
    }
  )

  return response
}
