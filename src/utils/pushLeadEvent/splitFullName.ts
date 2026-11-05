export function splitFullName(fullName: unknown): {
  firstName?: string
  lastName?: string
} {
  if (typeof fullName !== 'string') return {}

  const parts = fullName.trim().split(/\s+/).filter(Boolean)

  if (parts.length === 0) return {}

  const [firstName, ...rest] = parts

  return {
    firstName,
    lastName: rest.length > 0 ? rest.join(' ') : undefined
  }
}
