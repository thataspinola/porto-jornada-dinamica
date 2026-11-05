import { vi } from 'vitest'

import { calculateAge } from '.'

describe('calculateAge', () => {
  beforeAll(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 5, 22, 12, 0, 0))
  })

  afterAll(() => {
    vi.useRealTimers()
  })

  it('should return age when birthday has already happened this year', () => {
    expect(calculateAge('01/06/2001')).toBe(25)
  })

  it('should return age minus one when birthday has not happened yet this year', () => {
    expect(calculateAge('31/12/2001')).toBe(24)
  })

  it('should return correct age when birthday is exactly today', () => {
    expect(calculateAge('22/06/2000')).toBe(26)
  })

  it('should return 0 for a baby born earlier this year', () => {
    expect(calculateAge('01/01/2026')).toBe(0)
  })

  it('should return null for incomplete date strings', () => {
    expect(calculateAge('')).toBeNull()
    expect(calculateAge('01')).toBeNull()
    expect(calculateAge('01/06')).toBeNull()
    expect(calculateAge('01/06/200')).toBeNull()
  })

  it('should return null for invalid day or month', () => {
    expect(calculateAge('32/01/2000')).toBeNull()
    expect(calculateAge('00/01/2000')).toBeNull()
    expect(calculateAge('01/13/2000')).toBeNull()
    expect(calculateAge('01/00/2000')).toBeNull()
  })

  it('should return null for non-existing calendar dates', () => {
    expect(calculateAge('31/02/2000')).toBeNull()
    expect(calculateAge('31/04/2000')).toBeNull()
    expect(calculateAge('29/02/2001')).toBeNull()
  })

  it('should accept valid leap day', () => {
    expect(calculateAge('29/02/2000')).toBe(26)
  })

  it('should return null for future dates', () => {
    expect(calculateAge('23/06/2026')).toBeNull()
    expect(calculateAge('01/01/2030')).toBeNull()
  })

  it('should return null for non-string inputs', () => {
    expect(calculateAge(null)).toBeNull()
    expect(calculateAge(undefined)).toBeNull()
    expect(calculateAge(20010601)).toBeNull()
    expect(calculateAge({})).toBeNull()
  })

  it('should return null for malformed but length-matching strings', () => {
    expect(calculateAge('aa/bb/cccc')).toBeNull()
    expect(calculateAge('01-06-2001')).toBeNull()
  })
})
