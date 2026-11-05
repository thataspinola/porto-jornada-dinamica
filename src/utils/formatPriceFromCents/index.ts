/**
 * Formats a value in cents (integer) as a BRL currency string.
 *
 * @param cents - The amount in cents (e.g. `9550000` for R$ 95.500,00).
 * @returns The value formatted as BRL (e.g. `"R$ 95.500,00"`).
 */
export const formatPriceFromCents = (cents: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2
  }).format(cents / 100)
}
