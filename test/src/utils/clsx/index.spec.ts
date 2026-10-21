import { clsx } from '@/utils/clsx'

describe('clsx utility', () => {
  it('should join multiple string classes', () => {
    expect(clsx('btn', 'btn-primary')).toBe('btn btn-primary')
  })

  it('should ignore falsy values', () => {
    expect(clsx('btn', false, undefined, null, 'active')).toBe('btn active')
  })

  it('should handle object with true values', () => {
    expect(
      clsx({ btn: true, 'btn-primary': true, 'btn-disabled': false })
    ).toBe('btn btn-primary')
  })

  it('should handle mix of string and object', () => {
    expect(clsx('btn', { 'btn-primary': true }, 'extra')).toBe(
      'btn btn-primary extra'
    )
  })

  it('should return empty string when all falsy', () => {
    expect(clsx(false, undefined, null)).toBe('')
  })

  it('should handle complex combinations', () => {
    expect(
      clsx(
        'btn',
        { 'btn-primary': true, 'btn-disabled': false },
        undefined,
        'extra',
        {
          active: true,
        }
      )
    ).toBe('btn btn-primary extra active')
  })
})
