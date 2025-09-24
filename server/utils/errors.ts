import type { H3Error } from 'h3'

export function isH3Error(e: unknown): e is H3Error {
  return typeof e === 'object' && e !== null && 'statusCode' in e
}
