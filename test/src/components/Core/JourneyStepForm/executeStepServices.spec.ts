import { vi } from 'vitest'

import { executeStepServices } from '@/components/Core/JourneyStepForm/executeStepServices'
import { dispatchServiceEvent } from '@/components/Core/JourneyStepForm/dispatchServiceEvent'
import type { PendingAction } from '@/components/Core/JourneyStepForm/types'
import { ServiceError } from '@/services/types'
import { useJourneyStore } from '@/store/journeyStore'

vi.mock('@/components/Core/JourneyStepForm/dispatchServiceEvent', () => ({
  dispatchServiceEvent: vi.fn()
}))

function action(config: Partial<PendingAction> = {}): PendingAction {
  return {
    service: { action: 'eligibility', module: 'customer' },
    ...config
  } as PendingAction
}
const callMultiple = async <T>(
  items: readonly T[],
  execute: (item: T, index: number) => Promise<void>
) => {
  for (const [index, item] of items.entries()) await execute(item, index)
}
beforeEach(() => {
  useJourneyStore.getState().reset()
  vi.mocked(dispatchServiceEvent).mockReset()
})

it('salva a sessão antes do serviço e registra o sucesso com o resultado atual', async () => {
  const executeJourneyService = vi
    .fn()
    .mockResolvedValue({ success: true, data: { eligible: true } })
  await executeStepServices(
    {
      data: { taxvat: 'cpf-autorizado' },
      config: action(),
      product: 'loans',
      dirtyFields: {}
    },
    { executeJourneyService, callMultiple }
  )
  expect(
    executeJourneyService.mock.calls.map(
      ([input]) => `${input.action}/${input.module}`
    )
  ).toEqual(['session/session', 'eligibility/customer'])
  expect(executeJourneyService).toHaveBeenLastCalledWith(
    expect.objectContaining({
      fields: { taxvat: 'cpf-autorizado' },
      product: 'loans',
      recaptchaAction: 'submit_form'
    })
  )
  expect(dispatchServiceEvent).toHaveBeenCalledOnce()
  expect(dispatchServiceEvent).toHaveBeenCalledWith(
    expect.objectContaining({
      formData: { taxvat: 'cpf-autorizado' },
      result: { success: true, data: { eligible: true } }
    })
  )
})

it('envia somente campos sujos e não salva sessão quando não há alterações', async () => {
  const executeJourneyService = vi.fn().mockResolvedValue({ success: true })
  await executeStepServices(
    {
      data: { name: 'Atual', email: 'preservado' },
      config: action({ onlyDirtyFields: true }),
      dirtyFields: { name: true }
    },
    { executeJourneyService, callMultiple }
  )
  expect(executeJourneyService.mock.calls[0][0].fields).toEqual({
    name: 'Atual'
  })
  executeJourneyService.mockClear()
  await executeStepServices(
    {
      data: { name: 'Atual' },
      config: action({ onlyDirtyFields: true }),
      dirtyFields: {}
    },
    { executeJourneyService, callMultiple }
  )
  expect(executeJourneyService).toHaveBeenCalledOnce()
  expect(executeJourneyService.mock.calls[0][0]).toMatchObject({
    action: 'eligibility',
    fields: {}
  })
})

it('resolve o segundo payload usando o resultado recém-gravado pelo primeiro serviço', async () => {
  useJourneyStore.getState().mergeFields({ persisted: 'guardado' })
  const executeJourneyService = vi.fn().mockImplementation(async (input) => {
    if (input.action === 'first')
      useJourneyStore
        .getState()
        .mergeServices({ first: { reference: 'resultado' } })
    return { success: true, data: {} }
  })
  const config = action({
    service: [
      { action: 'first', module: 'customer' },
      { action: 'second', module: 'proposal' }
    ],
    payload: [
      { value: '{{fields.current}}' },
      {
        reference: '{{services.first.reference}}',
        value: '{{fields.persisted}}'
      }
    ],
    additionalPayload: [
      { origin: 'primeiro' },
      { origin: '{{fields.current}}' }
    ]
  })
  await executeStepServices(
    { data: { current: 'novo' }, config, dirtyFields: {} },
    { executeJourneyService, callMultiple }
  )
  expect(executeJourneyService.mock.calls[2][0]).toMatchObject({
    fields: { reference: 'resultado', value: 'guardado' },
    additionalPayload: { origin: 'novo' }
  })
  expect(dispatchServiceEvent).toHaveBeenCalledTimes(2)
})

it('preserva payload vazio explícito em vez de substituí-lo pelos campos do formulário', async () => {
  const executeJourneyService = vi.fn().mockResolvedValue({ success: true })
  await executeStepServices(
    {
      data: { name: 'Atual' },
      config: action({ payload: {} }),
      dirtyFields: {}
    },
    { executeJourneyService, callMultiple }
  )
  expect(executeJourneyService.mock.calls[1][0].fields).toEqual({})
})

it('interrompe a sequência na falha, preservando o ServiceError para o controller', async () => {
  const error = new ServiceError('NOT_ELIGIBLE', 422)
  const executeJourneyService = vi.fn().mockRejectedValue(error)
  await expect(
    executeStepServices(
      {
        data: {},
        config: action({
          service: [
            { action: 'first', module: 'customer' },
            { action: 'second', module: 'customer' }
          ]
        }),
        dirtyFields: {}
      },
      { executeJourneyService, callMultiple }
    )
  ).rejects.toBe(error)
  expect(executeJourneyService).toHaveBeenCalledOnce()
  expect(dispatchServiceEvent).not.toHaveBeenCalled()
})

it('não inicia os serviços se salvar a sessão falhar', async () => {
  const executeJourneyService = vi
    .fn()
    .mockRejectedValue(new Error('session failed'))
  await expect(
    executeStepServices(
      { data: { name: 'Atual' }, config: action(), dirtyFields: {} },
      { executeJourneyService, callMultiple }
    )
  ).rejects.toThrow('session failed')
  expect(executeJourneyService).toHaveBeenCalledOnce()
  expect(dispatchServiceEvent).not.toHaveBeenCalled()
})

it('preserva as respostas declarativas de desenvolvimento por índice', async () => {
  const executeJourneyService = vi.fn().mockResolvedValue({ success: true })
  const mockResponse = [
    { data: { first: true }, delayMs: 5 },
    { data: { second: true }, delayMs: 10 }
  ]
  await executeStepServices(
    {
      data: { name: 'Atual' },
      config: action({
        service: [
          { action: 'first', module: 'customer' },
          { action: 'second', module: 'customer' }
        ],
        mockResponse
      }),
      dirtyFields: {}
    },
    { executeJourneyService, callMultiple }
  )
  expect(executeJourneyService.mock.calls[0][0].mockResponse).toEqual({
    data: {},
    delayMs: 0
  })
  expect(executeJourneyService.mock.calls[1][0].mockResponse).toEqual(
    mockResponse[0]
  )
  expect(executeJourneyService.mock.calls[2][0].mockResponse).toEqual(
    mockResponse[1]
  )
})
