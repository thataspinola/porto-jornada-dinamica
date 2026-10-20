export const formatPrice = (value: number): string => {
  const safeValue = Number.isFinite(value) ? value : 0

  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(safeValue)
}
