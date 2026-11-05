import { sanitize } from '@/utils/sanitize/index'

describe('sanitize', () => {
  it('should remove special characters', () => {
    const input = 'Test@123 content!'
    expect(sanitize.text(input)).toBe('Test content')
  })

  it('should handle empty string', () => {
    expect(sanitize.text('')).toBe('')
  })

  it('should preserve letters, spaces and hyphens', () => {
    const input = 'Safe-content with spaces'
    expect(sanitize.text(input)).toBe('Safecontent with spaces')
  })

  it('should preserve accented characters', () => {
    const input = 'Conteúdo com acentuação e çedilha'
    expect(sanitize.text(input)).toBe('Conteúdo com acentuação e çedilha')
  })

  it('should remove HTML-like characters', () => {
    const input = '<div>Level 1 & Level 2</div>'
    expect(sanitize.text(input)).toBe('divLevel   Level div')
  })

  it('should preserve whitespace appropriately', () => {
    const input = 'First Second'
    expect(sanitize.text(input)).toBe('First Second')
  })

  describe('isoDate', () => {
    it('should convert DD/MM/YYYY to YYYY-MM-DD', () => {
      expect(sanitize.isoDate('28/07/2000')).toBe('2000-07-28')
    })

    it('should convert 01/06/2001 to 2001-06-01', () => {
      expect(sanitize.isoDate('01/06/2001')).toBe('2001-06-01')
    })

    it('should convert 8 raw digits to YYYY-MM-DD', () => {
      expect(sanitize.isoDate('28072000')).toBe('2000-07-28')
    })

    it('should ignore non-digit characters when computing the date', () => {
      expect(sanitize.isoDate('28-07-2000')).toBe('2000-07-28')
    })

    it('should return only digits when input has fewer than 8 digits', () => {
      expect(sanitize.isoDate('28/07')).toBe('2807')
    })

    it('should return only digits when input has more than 8 digits', () => {
      expect(sanitize.isoDate('280720000')).toBe('280720000')
    })

    it('should return empty string for empty input', () => {
      expect(sanitize.isoDate('')).toBe('')
    })

    it('should return ISO input unchanged', () => {
      expect(sanitize.isoDate('2000-07-28')).toBe('2000-07-28')
    })
  })

  describe('currencyToNumber', () => {
    it('should convert masked BRL to number in reais', () => {
      expect(sanitize.currencyToNumber('R$ 10.000,00')).toBe(10000)
    })

    it('should preserve decimals when there are cents', () => {
      expect(sanitize.currencyToNumber('R$ 10.500,50')).toBe(10500.5)
    })

    it('should handle values below R$ 1,00', () => {
      expect(sanitize.currencyToNumber('R$ 0,99')).toBe(0.99)
    })

    it('should treat raw digits as cents', () => {
      expect(sanitize.currencyToNumber('1000000')).toBe(10000)
    })

    it('should return 0 for empty input', () => {
      expect(sanitize.currencyToNumber('')).toBe(0)
    })

    it('should return 0 when there are no digits', () => {
      expect(sanitize.currencyToNumber('R$ ')).toBe(0)
    })
  })
})
