export const currencyToNumber = (value: string): number => {
  if (!value) return 0

  const numeric = value
    .replace(/\s/g, '')
    .replace(/[R$]/g, '')
    .replace(/\./g, '')

  return Number.parseFloat(numeric) / 100
}
