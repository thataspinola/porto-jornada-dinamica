/**
 * Converte um valor em centavos (inteiro) para reais.
 *
 * @param cents - Valor em centavos (ex.: `100000`).
 * @returns Valor em reais (ex.: `1000` para R$ 1.000,00).
 */
export const centsToReais = (cents: number): number => {
  if (!Number.isFinite(cents)) return 0

  return cents / 100
}
