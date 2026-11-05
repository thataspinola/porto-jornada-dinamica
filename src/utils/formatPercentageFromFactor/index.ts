/**
 * Formata um fator decimal como porcentagem em pt-BR.
 *
 * @param factor - Valor em fator (ex.: `0.3` para 30%).
 * @returns String no formato `"<n>%"` com `.` trocado por `,`.
 */
export const formatPercentageFromFactor = (factor: number): string => {
  const percentage = Math.round(factor * 10000) / 100
  return `${percentage.toString().replace('.', ',')}%`
}
