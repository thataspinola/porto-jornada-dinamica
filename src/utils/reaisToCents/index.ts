/**
 * Converte um valor em reais para centavos (inteiro).
 *
 * @param reais - Valor em reais (ex.: `1000` para R$ 1.000,00).
 * @returns Valor em centavos (ex.: `100000`).
 */
export const reaisToCents = (reais: number): number => {
  if (!Number.isFinite(reais)) return 0

  return Math.round(reais * 100)
}
