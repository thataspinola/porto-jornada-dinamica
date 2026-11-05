import { PRODUCT_ANALYTICS, resolveProductAnalytics } from '.'

describe('resolveProductAnalytics', () => {
  it('should resolve FCDC by journey product', () => {
    expect(resolveProductAnalytics('financing-loans-vehicle')).toEqual(
      PRODUCT_ANALYTICS['financing-loans-vehicle']
    )
  })

  it('should resolve REFF by journey product', () => {
    expect(
      resolveProductAnalytics('financing-loans-vehicle-guarantee')
    ).toEqual(PRODUCT_ANALYTICS['financing-loans-vehicle-guarantee'])
  })

  it('should return undefined for unknown products', () => {
    expect(resolveProductAnalytics('residencial')).toBeUndefined()
    expect(resolveProductAnalytics(undefined)).toBeUndefined()
  })
})
