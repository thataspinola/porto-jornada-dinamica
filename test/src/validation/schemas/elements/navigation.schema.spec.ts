import { describe, expect, it } from 'vitest'

import { navigationConfigSchema } from '@/validation/schemas/elements/navigation.schema'

const config = {
  label: 'Continuar',
  conditions: []
}

describe('navigationConfigSchema', () => {
  it('uses button as the default presentation', () => {
    expect(navigationConfigSchema.parse(config).presentation).toBe('button')
  })
})
