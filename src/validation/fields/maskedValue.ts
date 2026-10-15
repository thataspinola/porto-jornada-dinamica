import { z } from 'zod'

const emailSchema = z.email()

export function isMaskedCpf(value?: string) {
  if (!value?.includes('*')) return false

  const compact = value.replace(/[.-]/g, '')

  return (
    /^[0-9*]{11}$/.test(compact) && value.includes('.') && value.includes('-')
  )
}

export function isMaskedCnpj(value?: string) {
  if (!value?.includes('*')) {
    return false
  }

  const compact = value.replace(/[./-]/g, '')

  return (
    /^[0-9A-Z*]{14}$/.test(compact) &&
    value.includes('.') &&
    value.includes('/') &&
    value.includes('-')
  )
}

export function isMaskedPhone(value?: string) {
  if (!value?.includes('*')) return false

  const compact = value.replace(/[()\s-]/g, '')

  return (
    /^[0-9*]{10,11}$/.test(compact) &&
    value.includes('(') &&
    value.includes(')') &&
    value.includes('-')
  )
}

export function isMaskedEmail(value?: string) {
  if (!value?.includes('*')) return false

  const parts = value.split('@')
  if (parts.length !== 2) return false

  const [localPart, domain] = parts
  if (!localPart || !domain || domain.includes('*')) return false

  return emailSchema.safeParse(`${localPart.replaceAll('*', 'a')}@${domain}`)
    .success
}
