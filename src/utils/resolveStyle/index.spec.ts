import { afterEach, describe, expect, it, vi } from 'vitest'

import { resolveStyle } from './index'

describe('resolveStyle', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('should resolve direct values and spacing tokens', () => {
    expect(resolveStyle({ display: 'flex', flex: 1, marginTop: 24 })).toEqual({
      display: 'flex',
      flex: 1,
      marginTop: 'var(--ui-spacing-24)'
    })
  })

  it('should resolve desktop values', () => {
    expect(
      resolveStyle({
        order: { desktop: 2, mobile: 1 },
        flexDirection: { desktop: 'row', mobile: 'column' },
        marginLeft: { desktop: 32, mobile: 16 }
      })
    ).toEqual({
      order: 2,
      flexDirection: 'row',
      marginLeft: 'var(--ui-spacing-32)'
    })
  })

  it('should resolve mobile values below 768px', () => {
    vi.stubGlobal('window', {
      matchMedia: vi.fn().mockReturnValue({ matches: true })
    })

    expect(
      resolveStyle({
        order: { desktop: 2, mobile: 1 },
        flexDirection: { desktop: 'row', mobile: 'column' },
        marginRight: { desktop: 32, mobile: 12 }
      })
    ).toEqual({
      order: 1,
      flexDirection: 'column',
      marginRight: 'var(--ui-spacing-12)'
    })
  })
})
