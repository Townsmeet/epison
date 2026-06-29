import type { AnyColumn, and, or, like, type SQL } from 'drizzle-orm'

/**
 * Builds a bulletproof search condition for a multi-term query.
 * Splits the search query by whitespace and ensures every term matches
 * at least one of the provided columns.
 */
export function buildSearchCondition(
  searchQuery: string | undefined,
  columns: AnyColumn[]
): SQL | undefined {
  if (!searchQuery) return undefined

  const terms = searchQuery.trim().split(/\s+/).filter(Boolean)
  if (terms.length === 0) return undefined

  const termConditions = terms.map(term => {
    const pattern = `%${term}%`
    return or(...columns.map(col => like(col, pattern)))
  })

  return and(...termConditions)
}
