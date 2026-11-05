import { beforeEach, describe, expect, it, vi } from 'vitest'

import { ServiceError } from '@/services/types'

import { pushEvent } from '@/utils'

import { dispatchAlert } from './dispatchAlert'
import type { ServiceErrorAction } from './types'

vi.mock('@/utils', () => ({
  pushEvent: vi.fn()
}))

const pushEventMock = vi.mocked(pushEvent)

const notifyAction: ServiceErrorAction = {
  kind: 'notify',
  title: 'Não foi possível carregar',
  description: 'desc'
}

const fullscreenAction: ServiceErrorAction = {
  kind: 'fullscreen',
  icon: 'alert',
  attempts: [
    {
      title: 'Não foi possível carregar as informações',
      actionButton: { children: 'Atualizar' }
    },
    {
      title: 'Segunda tentativa',
      actionButton: { children: 'Atualizar' }
    }
  ]
}

const fieldErrorAction: ServiceErrorAction = {
  kind: 'fieldError',
  field: 'taxvat',
  message: 'CPF inválido'
}

const redirectAction: ServiceErrorAction = {
  kind: 'redirect',
  url: '/'
}

describe('dispatchAlert', () => {
  beforeEach(() => {
    pushEventMock.mockReset()
  })

  it('uses the fullscreen action first attempt title as evLabel', () => {
    dispatchAlert(
      fullscreenAction,
      'INTERNAL_SERVER_ERROR',
      new Error('boom'),
      {
        alertEvent: 'select_content',
        errorService: 'get-session-encrypted/session'
      }
    )

    expect(pushEventMock).toHaveBeenCalledWith(
      expect.objectContaining({
        event: 'alert',
        evLabel: 'Não foi possível carregar as informações',
        evAction: 'carregar:alert',
        errorService: 'get-session-encrypted/session',
        alertType: 'erro',
        alertEvent: 'select_content'
      })
    )
  })

  it('overrides the default evAction when context.evAction is provided', () => {
    dispatchAlert(
      fullscreenAction,
      'INTERNAL_SERVER_ERROR',
      new Error('boom'),
      {
        alertEvent: 'select_content',
        errorService: 'get-session-encrypted/session',
        evAction: 'carregar:reaproveitamento-dados:alert'
      }
    )

    expect(pushEventMock).toHaveBeenCalledWith(
      expect.objectContaining({
        evAction: 'carregar:reaproveitamento-dados:alert'
      })
    )
  })

  it('combines the HTTP status from a ServiceError with the code, pipe-separated', () => {
    const error = new ServiceError('INTERNAL_SERVER_ERROR', 500)

    dispatchAlert(notifyAction, 'INTERNAL_SERVER_ERROR', error, {
      alertEvent: 'lead',
      errorService: 'get-session-encrypted/session'
    })

    expect(pushEventMock).toHaveBeenCalledWith(
      expect.objectContaining({
        alertCode: '500|INTERNAL_SERVER_ERROR',
        alertServiceMessage: 'INTERNAL_SERVER_ERROR'
      })
    )
  })

  it('falls back to the plain code when the error carries no HTTP status', () => {
    dispatchAlert(notifyAction, 'INTERNAL_SERVER_ERROR', new Error('boom'), {
      alertEvent: 'lead',
      errorService: 'get-session-encrypted/session'
    })

    expect(pushEventMock).toHaveBeenCalledWith(
      expect.objectContaining({
        alertCode: 'INTERNAL_SERVER_ERROR'
      })
    )
  })

  it('marks fieldError actions with alertType "negocio" and uses the message as label', () => {
    dispatchAlert(fieldErrorAction, 'NOT_ELIGIBLE', new Error('boom'), {
      alertEvent: 'lead',
      errorService: 'proposal/proposal'
    })

    expect(pushEventMock).toHaveBeenCalledWith(
      expect.objectContaining({
        evLabel: 'CPF inválido',
        alertType: 'negocio'
      })
    )
  })

  it('does nothing for redirect actions', () => {
    dispatchAlert(redirectAction, 'ANY_CODE', new Error('boom'), {
      alertEvent: 'lead',
      errorService: 'proposal/proposal'
    })

    expect(pushEventMock).not.toHaveBeenCalled()
  })
})
