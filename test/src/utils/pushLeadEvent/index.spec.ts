import { pushLeadEvent } from '@/utils/pushLeadEvent'
it('registra lead sem campos pessoais não informados', async () => {
  window.dataLayer = []
  await pushLeadEvent({ evLabel: 'pf', leadId: 'fixture' })
  expect(window.dataLayer).toEqual([
    expect.objectContaining({ event: 'lead', lead_id: 'fixture' }),
  ])
  expect(window.dataLayer?.[0]).not.toHaveProperty('client_email')
})
