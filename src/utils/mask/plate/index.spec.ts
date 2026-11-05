import { maskLicensePlate } from '.'

describe('plate.ts', () => {
  it('should format plate correctly', () => {
    expect(maskLicensePlate('1234%%567')).toBe('1234567')
  })

  it('should handle 7 digits max', () => {
    expect(maskLicensePlate('xpz4567')).toBe('XPZ-4567')
  })
})
