import { describe, expect, it } from 'vitest'

import { navigationConfigSchema } from './navigation.schema'

const config = {
  label: 'Continuar',
  conditions: []
}

describe('navigationConfigSchema', () => {
  it('uses button as the default presentation', () => {
    expect(navigationConfigSchema.parse(config).presentation).toBe('button')
  })
})
