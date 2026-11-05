import { toSnakeCase } from '@/utils/toSnakeCase'

describe('toSnakeCase', () => {
  describe('string input', () => {
    it('should convert camelCase to snake_case', () => {
      expect(toSnakeCase('evLabel')).toBe('ev_label')
      expect(toSnakeCase('productIdentify')).toBe('product_identify')
    })

    it('should return an already lowercase string unchanged', () => {
      expect(toSnakeCase('event')).toBe('event')
      expect(toSnakeCase('')).toBe('')
    })

    it('should convert PascalCase to snake_case without a leading underscore', () => {
      expect(toSnakeCase('PascalCase')).toBe('pascal_case')
    })

    it('should split each consecutive uppercase letter into its own segment', () => {
      expect(toSnakeCase('clientID')).toBe('client_i_d')
    })
  })

  describe('object input', () => {
    it('should convert camelCase keys to snake_case', () => {
      expect(toSnakeCase({ evLabel: 'x', evAction: 'y' })).toEqual({
        ev_label: 'x',
        ev_action: 'y'
      })
    })

    it('should preserve already lowercase keys unchanged', () => {
      expect(toSnakeCase({ event: 'alert', items: [] })).toEqual({
        event: 'alert',
        items: []
      })
    })

    it('should handle values of any type without transforming them', () => {
      const nested = { item_id: 'A', item_price: 10 }
      const result = toSnakeCase({
        evLabel: 'x',
        items: nested,
        count: 0,
        flag: false,
        nothing: null,
        empty: ''
      })

      expect(result).toEqual({
        ev_label: 'x',
        items: nested,
        count: 0,
        flag: false,
        nothing: null,
        empty: ''
      })
      expect(result.items).toBe(nested)
    })

    it('should lowercase consecutive uppercase letters (each becomes its own segment)', () => {
      expect(toSnakeCase({ clientID: 'a', productURL: 'b' })).toEqual({
        client_i_d: 'a',
        product_u_r_l: 'b'
      })
    })

    it('should return an empty object for an empty input', () => {
      expect(toSnakeCase({})).toEqual({})
    })

    it('should ignore inherited enumerable properties', () => {
      const proto = { inheritedProp: 'nope' }
      const input = Object.create(proto)
      input.ownProp = 'yes'

      expect(toSnakeCase(input)).toEqual({ own_prop: 'yes' })
    })
  })
})
