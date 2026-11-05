import { describe, expect, it } from 'vitest'

import type { ServiceErrorsConfig } from '@/validation/schemas'

import { DEFAULT_ERROR_ACTION, resolveErrorAction } from './resolveErrorAction'

const notifyRule = (
  code: string,
  title = `title-${code}`
): ServiceErrorsConfig[number] => ({
  code,
  action: { kind: 'notify', title, description: 'desc' }
})

describe('resolveErrorAction', () => {
  it('picks the node-level rule first', () => {
    const nodeErrors: ServiceErrorsConfig = [notifyRule('NOT_ELIGIBLE', 'node')]
    const journeyErrors: ServiceErrorsConfig = [
      notifyRule('NOT_ELIGIBLE', 'journey')
    ]

    const action = resolveErrorAction({
      code: 'NOT_ELIGIBLE',
      nodeErrors,
      journeyErrors
    })

    expect(action).toEqual({
      kind: 'notify',
      title: 'node',
      description: 'desc'
    })
  })

  it('falls back to the journey-level rule when the node has no match', () => {
    const journeyErrors: ServiceErrorsConfig = [
      notifyRule('NOT_ELIGIBLE', 'journey')
    ]

    const action = resolveErrorAction({
      code: 'NOT_ELIGIBLE',
      nodeErrors: [],
      journeyErrors
    })

    expect(action).toEqual({
      kind: 'notify',
      title: 'journey',
      description: 'desc'
    })
  })

  it('falls back to the default action when no JSON rule matches', () => {
    const action = resolveErrorAction({
      code: 'NOT_ELIGIBLE',
      nodeErrors: [],
      journeyErrors: []
    })

    expect(action).toEqual(DEFAULT_ERROR_ACTION)
  })

  it('falls back to the default action for unknown codes', () => {
    const action = resolveErrorAction({
      code: 'UNKNOWN_CODE',
      nodeErrors: [],
      journeyErrors: []
    })

    expect(action).toEqual(DEFAULT_ERROR_ACTION)
  })

  it('picks the first rule when the same code appears multiple times', () => {
    const journeyErrors: ServiceErrorsConfig = [
      notifyRule('NOT_ELIGIBLE', 'first'),
      notifyRule('NOT_ELIGIBLE', 'second')
    ]

    const action = resolveErrorAction({
      code: 'NOT_ELIGIBLE',
      journeyErrors
    })

    expect(action).toMatchObject({ kind: 'notify', title: 'first' })
  })
})
