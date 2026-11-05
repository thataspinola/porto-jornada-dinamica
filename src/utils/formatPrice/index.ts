/**
 * Formats a number for pt-BR currency-style display with two decimal places.
 *
 * @param value - The numeric value to format (e.g. `25000`).
 * Falls back to `0` when receiving a non-finite number.
 * @returns The formatted value without the currency prefix (e.g. `"25.000,00"`).
 */
export const formatPrice = (value: number): string => {
  const safeValue = Number.isFinite(value) ? value : 0

  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(safeValue)
}
