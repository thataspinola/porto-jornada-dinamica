import { resolveTemplates } from '.'

describe('resolveTemplates', () => {
  it('keeps a cookie placeholder untouched when the cookies scope is not provided', () => {
    const result = resolveTemplates(
      { token: '{{cookies.CommerceCustomerToken}}' },
      { fields: {} }
    )

    expect(result).toEqual({ token: '{{cookies.CommerceCustomerToken}}' })
  })

  it('resolves a cookie placeholder when the cookies scope is provided and the value exists', () => {
    const result = resolveTemplates(
      { token: '{{cookies.CommerceCustomerToken}}' },
      { cookies: { CommerceCustomerToken: 'abc123' } }
    )

    expect(result).toEqual({ token: 'abc123' })
  })

  it('drops the field when the cookies scope is provided but the cookie is missing', () => {
    const result = resolveTemplates(
      { token: '{{cookies.CommerceCustomerToken}}' },
      { cookies: {} }
    )

    expect(result).toEqual({})
  })

  it('still resolves non-cookie placeholders normally', () => {
    const result = resolveTemplates(
      { name: '{{fields.fullName}}' },
      { fields: { fullName: 'John Doe' } }
    )

    expect(result).toEqual({ name: 'John Doe' })
  })
})
