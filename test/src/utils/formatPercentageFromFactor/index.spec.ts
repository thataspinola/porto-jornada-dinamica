import { formatPercentageFromFactor } from '@/utils/formatPercentageFromFactor'

describe('formatPercentageFromFactor', () => {
  it('should convert a decimal factor to percentage', () => {
    expect(formatPercentageFromFactor(0.3)).toBe('30%')
  })

  it('should handle factors greater than 1', () => {
    expect(formatPercentageFromFactor(1.5)).toBe('150%')
  })

  it('should format decimals with comma separator', () => {
    expect(formatPercentageFromFactor(0.305)).toBe('30,5%')
    expect(formatPercentageFromFactor(0.1234)).toBe('12,34%')
  })

  it('should handle zero', () => {
    expect(formatPercentageFromFactor(0)).toBe('0%')
  })

  it('should handle negative factors', () => {
    expect(formatPercentageFromFactor(-0.032)).toBe('-3,2%')
  })

  it('should avoid floating point precision issues', () => {
    expect(formatPercentageFromFactor(0.1)).toBe('10%')
    expect(formatPercentageFromFactor(0.29)).toBe('29%')
  })
})
