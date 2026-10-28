import { dispatchAlert } from '@/hooks/serviceErrorHandlers/dispatchAlert'
import { ServiceError } from '@/services/types'
it('alert de falha não se confunde com a impressão da promoção', () => {
  window.dataLayer = []
  dispatchAlert(
    { kind: 'fieldError', field: 'taxvat', message: 'Indisponível' },
    'NOT_ELIGIBLE',
    new ServiceError('NOT_ELIGIBLE', 422),
    { alertEvent: 'view_promotion', errorService: 'eligibility/test' }
  )
  expect(window.dataLayer).toEqual([
    expect.objectContaining({
      event: 'alert',
      ev_action: 'ecommerce:visualizar:promocao:alert',
      alert_event: 'view_promotion',
    }),
  ])
})
