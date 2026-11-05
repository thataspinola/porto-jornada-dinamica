/**
 * Formata um número como porcentagem em pt-BR (usa vírgula como separador decimal).
 *
 * @param value - Valor numérico já em unidade percentual (ex.: `1.5` para 1,5%).
 * @returns String no formato `"<n>%"` com `.` trocado por `,`.
 */
export const formatPercentage = (value: number): string => {
  return `${value.toString().replace('.', ',')}%`
}
