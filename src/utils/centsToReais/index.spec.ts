import { centsToReais } from '.'

describe('centsToReais', () => {
  it('should convert cents to reais', () => {
    expect(centsToReais(100_000)).toBe(1000)
    expect(centsToReais(100)).toBe(1)
  })

  it('should preserve fractional parts', () => {
    expect(centsToReais(1234)).toBe(12.34)
    expect(centsToReais(5)).toBe(0.05)
  })

  it('should handle zero and negatives', () => {
    expect(centsToReais(0)).toBe(0)
    expect(centsToReais(-1234)).toBe(-12.34)
  })

  it('should return 0 for non-finite values', () => {
    expect(centsToReais(Number.NaN)).toBe(0)
    expect(centsToReais(Number.POSITIVE_INFINITY)).toBe(0)
  })
})
