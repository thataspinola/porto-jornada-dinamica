import { BANK_SOURCE } from '@/services/optionsService/sources/banks'

export const REFF_BANK_LABELS: Record<string, string> = Object.fromEntries(
  BANK_SOURCE.map(({ code, name }) => [code, name])
)
