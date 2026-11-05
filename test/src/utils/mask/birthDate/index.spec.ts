import { birthDateMask } from '@/utils/mask/birthDate'

describe('birthDateMask', () => {
  it('should format complete date correctly', () => {
    expect(birthDateMask('01062001')).toBe('01/06/2001')
  })

  it('should handle partial input — only day', () => {
    expect(birthDateMask('01')).toBe('01')
  })

  it('should handle partial input — day and month', () => {
    expect(birthDateMask('0106')).toBe('01/06')
  })

  it('should handle partial input — day, month and partial year', () => {
    expect(birthDateMask('01062')).toBe('01/06/2')
  })

  it('should remove non-numeric characters', () => {
    expect(birthDateMask('01/06/2001')).toBe('01/06/2001')
    expect(birthDateMask('abc01062001xyz')).toBe('01/06/2001')
  })

  it('should truncate input exceeding 8 digits', () => {
    expect(birthDateMask('010620019999')).toBe('01/06/2001')
  })

  it('should handle empty string', () => {
    expect(birthDateMask('')).toBe('')
  })

  it('should handle non-string input', () => {
    // @ts-expect-error
    expect(birthDateMask(0)).toBe('')
    expect(birthDateMask(null)).toBe('')
  })

  it('should handle single digit', () => {
    expect(birthDateMask('0')).toBe('0')
  })
})
