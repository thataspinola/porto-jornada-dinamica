import { reaisToCents } from '@/utils/reaisToCents'

describe('reaisToCents', () => {
  it('should convert reais to cents', () => {
    expect(reaisToCents(1000)).toBe(100_000)
    expect(reaisToCents(1)).toBe(100)
  })

  it('should round fractional cents', () => {
    expect(reaisToCents(10.005)).toBe(1001)
    expect(reaisToCents(0.1 + 0.2)).toBe(30)
  })

  it('should handle zero and negatives', () => {
    expect(reaisToCents(0)).toBe(0)
    expect(reaisToCents(-12.34)).toBe(-1234)
  })

  it('should return 0 for non-finite values', () => {
    expect(reaisToCents(Number.NaN)).toBe(0)
    expect(reaisToCents(Number.POSITIVE_INFINITY)).toBe(0)
  })
})
