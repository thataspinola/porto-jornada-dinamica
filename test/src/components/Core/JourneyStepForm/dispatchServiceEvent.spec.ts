import { vi } from 'vitest'
import {
  dispatchServiceEvent,
  type DispatchServiceEventInput
} from '@/components/Core/JourneyStepForm/dispatchServiceEvent'

const effects = vi.hoisted(() => ({
  encryptGtmClientId: vi.fn(),
  pushLeadEvent: vi.fn(),
  pushEvent: vi.fn(),
  buildVehicleViewItem: vi.fn(),
  resolveGoogleClientId: vi.fn(),
  resolveProductAnalytics: vi.fn(),
  sha256: vi.fn()
}))
vi.mock('@/utils', () => effects)
function input(
  service: DispatchServiceEventInput['service']
): DispatchServiceEventInput {
  return {
    service,
    result: undefined,
    formData: {},
    fields: {},
    services: {},
    parameters: {}
  }
}
beforeEach(() => {
  vi.resetAllMocks()
  effects.encryptGtmClientId.mockResolvedValue('encrypted')
})

it('usa o CPF enviado no formulário antes do valor persistido ao registrar lead', async () => {
  await dispatchServiceEvent({
    ...input({ action: 'lead', module: 'support' }),
    formData: { taxvat: 'cpf-atual' },
    fields: { taxvat: 'cpf-anterior' },
    result: { data: { idLead: 'lead-id' } }
  })
  expect(effects.encryptGtmClientId).toHaveBeenCalledExactlyOnceWith(
    'cpf-atual'
  )
  expect(effects.pushLeadEvent).toHaveBeenCalledWith(
    expect.objectContaining({ leadId: 'lead-id', clientId: 'encrypted' })
  )
})
it('não registra lead sem o identificador devolvido pelo serviço', async () => {
  await dispatchServiceEvent(input({ action: 'lead', module: 'support' }))
  expect(effects.pushLeadEvent).not.toHaveBeenCalled()
})
it('preserva os dois produtos e o total do add_to_cart', async () => {
  await dispatchServiceEvent({
    ...input({
      action: 'proposal',
      module: 'proposal',
      successEvent: 'add_to_cart'
    }),
    fields: {
      products: [
        { sku: 'a', name: 'Produto A', installmentsPrice: 10 },
        { sku: 'b', name: 'Produto B', installmentsPrice: 20 }
      ]
    }
  })
  expect(effects.pushEvent).toHaveBeenCalledWith(
    expect.objectContaining({
      event: 'add_to_cart',
      value: 30,
      items: [
        expect.objectContaining({ item_id: 'a' }),
        expect.objectContaining({ item_id: 'b' })
      ]
    })
  )
})
it('usa os dados de analytics devolvidos pela cotação', async () => {
  await dispatchServiceEvent({
    ...input({ action: 'quotation', module: 'quotation' }),
    result: {
      data: {
        quotation: {
          quotationResult: {
            lead: { idLead: 'lead-id' },
            analytics: { client_id: 'client-id' }
          }
        }
      }
    }
  })
  expect(effects.pushEvent).toHaveBeenCalledWith(
    expect.objectContaining({
      event: 'lead',
      leadId: 'lead-id',
      clientId: 'client-id'
    })
  )
})
it('registra a falha de analytics sem interromper a jornada nem expor o erro bruto', async () => {
  const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
  effects.pushLeadEvent.mockRejectedValue(new Error('conteúdo privado'))
  await expect(
    dispatchServiceEvent({
      ...input({ action: 'lead', module: 'support' }),
      result: { data: { idLead: 'lead-id' } }
    })
  ).resolves.toBeUndefined()
  expect(warn).toHaveBeenCalledExactlyOnceWith(
    '[analytics] Falha ao registrar evento de sucesso do serviço:',
    'lead/support'
  )
  warn.mockRestore()
})
