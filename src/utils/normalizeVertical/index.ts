const verticalValues = [
  'holding',
  'bank',
  'servico',
  'seguro',
  'saude'
] as const

export type VerticalValue = (typeof verticalValues)[number] | ''

export function normalizeVertical(value?: string | null): VerticalValue {
  if (typeof value !== 'string') {
    return ''
  }

  const normalizedValue = value.trim().toLocaleLowerCase()

  if (
    verticalValues.includes(normalizedValue as (typeof verticalValues)[number])
  ) {
    return normalizedValue as VerticalValue
  }

  return ''
}
