import { collectCookiePlaceholders } from '@/utils/collectCookiePlaceholders'

describe('collectCookiePlaceholders', () => {
  it('collects a cookie placeholder nested inside an object', () => {
    const names = collectCookiePlaceholders({
      selectedProduct: { sku: '123' },
      CommerceCustomerToken: '{{cookies.CommerceCustomerToken}}'
    })

    expect([...names]).toEqual(['CommerceCustomerToken'])
  })

  it('collects cookie placeholders nested inside arrays', () => {
    const names = collectCookiePlaceholders([
      { token: '{{cookies.foo}}' },
      { token: '{{cookies.bar}}' }
    ])

    expect([...names].sort()).toEqual(['bar', 'foo'])
  })

  it('ignores placeholders from other scopes', () => {
    const names = collectCookiePlaceholders({
      fullName: '{{fields.fullName}}',
      sessionId: '{{business.metadata.sessionId}}'
    })

    expect(names.size).toBe(0)
  })

  it('deduplicates repeated cookie references', () => {
    const names = collectCookiePlaceholders({
      a: '{{cookies.foo}}',
      b: '{{cookies.foo}}'
    })

    expect([...names]).toEqual(['foo'])
  })
})
