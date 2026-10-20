export const centsToReais = (value: number): number => {
  if (!Number.isFinite(value)) return 0
  return value / 100
}
