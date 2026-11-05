import { formatPrice } from '.'

describe('formatPrice', () => {
  it('should format valid numbers using pt-BR separators', () => {
    expect(formatPrice(25_000)).toBe('25.000,00')
  })

  it('should fallback to zero for non-finite numbers', () => {
    expect(formatPrice(Number.NaN)).toBe('0,00')
    expect(formatPrice(Number.POSITIVE_INFINITY)).toBe('0,00')
    expect(formatPrice(Number.NEGATIVE_INFINITY)).toBe('0,00')
  })
})
