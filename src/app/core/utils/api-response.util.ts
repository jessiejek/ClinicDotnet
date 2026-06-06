/**
 * Shared helpers for normalizing .NET API responses.
 *
 * .NET System.Text.Json serializes to camelCase by default.
 * Some legacy endpoints may return snake_case.
 * These helpers prefer camelCase first, falling back to snake_case.
 */

/**
 * Unwraps a paginated API response to a flat array.
 *
 * .NET paged endpoints return `{ items: T[], totalCount, page, pageSize, totalPages }`.
 * Raw array endpoints return `T[]` directly.
 */
export function unwrapItems<T>(
  response: T[] | { items?: T[] } | null | undefined
): T[] {
  if (Array.isArray(response)) return response;
  if (response && Array.isArray(response.items)) return response.items;
  return [];
}

/**
 * Picks a value from a record, preferring camelCase first.
 *
 * Example:
 *   pickApiValue(row, 'appointmentDate', 'appointment_date', '')
 *   → row['appointmentDate'] ?? row['appointment_date'] ?? ''
 */
export function pickApiValue<T = unknown>(
  source: Record<string, unknown> | null | undefined,
  camelKey: string,
  snakeKey?: string,
  fallback?: T
): T | undefined {
  if (!source) return fallback as T;
  const camelValue = source[camelKey];
  if (camelValue !== undefined && camelValue !== null) return camelValue as T;
  if (snakeKey) {
    const snakeValue = source[snakeKey];
    if (snakeValue !== undefined && snakeValue !== null) return snakeValue as T;
  }
  return fallback as T;
}

/**
 * Picks a string value from a record, preferring camelCase.
 * Thin wrapper around pickApiValue that returns string | undefined.
 */
export function pickApiString(
  source: Record<string, unknown> | null | undefined,
  camelKey: string,
  snakeKey?: string,
  fallback?: string
): string | undefined {
  const val = pickApiValue<string>(source, camelKey, snakeKey);
  if (val === undefined || val === null) return fallback;
  const trimmed = String(val).trim();
  return trimmed || fallback;
}

/**
 * Picks a number value from a record, preferring camelCase.
 */
export function pickApiNumber(
  source: Record<string, unknown> | null | undefined,
  camelKey: string,
  snakeKey?: string,
  fallback?: number
): number | null | undefined {
  const val = pickApiValue(source, camelKey, snakeKey);
  if (val === undefined || val === null) return fallback ?? null;
  const num = Number(val);
  return isFinite(num) ? num : (fallback ?? null);
}

/**
 * Picks a boolean value from a record, preferring camelCase.
 */
export function pickApiBoolean(
  source: Record<string, unknown> | null | undefined,
  camelKey: string,
  snakeKey?: string,
  fallback = false
): boolean {
  const val = pickApiValue(source, camelKey, snakeKey);
  if (val === undefined || val === null) return fallback;
  return Boolean(val);
}
