import type { z } from 'zod'
import type { H3Event } from 'h3'
import { createError, readBody, getQuery, getRouterParams } from 'h3'

export function validate<T extends z.ZodTypeAny>(
  schema: T,
  data: unknown,
  errorMessage = 'Validation failed'
): z.infer<T> {
  const result = schema.safeParse(data)
  if (!result.success) {
    throw createError({
      statusCode: 400,
      statusMessage: errorMessage,
      data: {
        errors: result.error.flatten(),
      },
    })
  }
  return result.data
}

export async function validateBody<T extends z.ZodTypeAny>(
  event: H3Event,
  schema: T,
  errorMessage = 'Invalid request body'
): Promise<z.infer<T>> {
  const body = await readBody(event)
  return validate(schema, body, errorMessage)
}

export function validateQuery<T extends z.ZodTypeAny>(
  event: H3Event,
  schema: T,
  errorMessage = 'Invalid query parameters'
): z.infer<T> {
  const query = getQuery(event)
  return validate(schema, query, errorMessage)
}

export function validateParams<T extends z.ZodTypeAny>(
  event: H3Event,
  schema: T,
  errorMessage = 'Invalid URL parameters'
): z.infer<T> {
  const params = getRouterParams(event)
  return validate(schema, params, errorMessage)
}
