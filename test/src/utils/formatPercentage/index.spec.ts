import { formatPercentage } from '@/utils/formatPercentage'

describe('formatPercentage', () => {
  it('should format an integer as percentage', () => {
    expect(formatPercentage(50)).toBe('50%')
  })

  it('should replace the decimal dot with a comma', () => {
    expect(formatPercentage(1.5)).toBe('1,5%')
    expect(formatPercentage(12.34)).toBe('12,34%')
  })

  it('should handle zero', () => {
    expect(formatPercentage(0)).toBe('0%')
  })

  it('should format negative values', () => {
    expect(formatPercentage(-3.2)).toBe('-3,2%')
  })
})
