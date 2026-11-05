import { formatPriceFromCents } from '@/utils/formatPriceFromCents'

describe('formatPriceFromCents', () => {
  it('should format an integer in cents as BRL', () => {
    expect(formatPriceFromCents(9_550_000)).toMatch(/^R\$\s95\.500,00$/)
  })

  it('should handle zero', () => {
    expect(formatPriceFromCents(0)).toMatch(/^R\$\s0,00$/)
  })

  it('should format small values with leading zeros in the decimal part', () => {
    expect(formatPriceFromCents(5)).toMatch(/^R\$\s0,05$/)
    expect(formatPriceFromCents(99)).toMatch(/^R\$\s0,99$/)
  })

  it('should format values without thousand separators when below 1000 BRL', () => {
    expect(formatPriceFromCents(12_345)).toMatch(/^R\$\s123,45$/)
  })

  it('should format negative values', () => {
    expect(formatPriceFromCents(-1_000)).toMatch(/^-R\$\s10,00$/)
  })
})
