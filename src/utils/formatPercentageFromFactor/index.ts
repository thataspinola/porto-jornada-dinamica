export const formatPercentageFromFactor = (factor: number): string => {
  const percentage = Math.round(factor * 10000) / 100
  return `${percentage.toString().replace('.', ',')}%`
}
