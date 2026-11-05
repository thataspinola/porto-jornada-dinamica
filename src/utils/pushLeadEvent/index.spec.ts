import { beforeEach, vi } from 'vitest'

import { pushLeadEvent } from '.'

const originalDataLayer = window.dataLayer

beforeEach(() => {
  window.dataLayer = []
  vi.restoreAllMocks()
})

afterAll(() => {
  window.dataLayer = originalDataLayer
})

function lastPushed() {
  return (window.dataLayer as unknown[])[
    (window.dataLayer as unknown[]).length - 1
  ] as Record<string, unknown>
}

describe('pushLeadEvent', () => {
  it('should hash PII fields with SHA-256 and forward pre-encrypted clientId as-is', async () => {
    await pushLeadEvent({
      evLabel: 'pf',
      leadId: 'LEAD-1',
      clientId: 'encrypted-cpf',
      email: 'a@b.com',
      phone: '11999998888',
      fullName: 'Ana Silva',
      clientBcp: 'BCP-1'
    })

    const pushed = lastPushed()

    expect(pushed.event).toBe('lead')
    expect(pushed.ev_action).toBe('lead:sucesso')
    expect(pushed.ev_label).toBe('pf')
    expect(pushed.method).toBe('tipo-contato:padrao')
    expect(pushed.lead_id).toBe('LEAD-1')
    expect(pushed.client_bcp).toBe('BCP-1')
    expect(pushed.client_id).toBe('encrypted-cpf')
    for (const key of [
      'client_email',
      'client_phone',
      'client_phone_e164',
      'client_first_name',
      'client_last_name'
    ]) {
      expect(pushed[key]).toMatch(/^[0-9a-f]{64}$/)
    }
  })

  it('should omit optional client fields when their raw values are not provided', async () => {
    await pushLeadEvent({
      evLabel: 'pj',
      leadId: 'LEAD-2'
    })

    const pushed = lastPushed()

    expect(pushed.event).toBe('lead')
    expect(pushed.ev_label).toBe('pj')
    expect(pushed.lead_id).toBe('LEAD-2')
    expect(pushed).not.toHaveProperty('client_id')
    expect(pushed).not.toHaveProperty('client_email')
    expect(pushed).not.toHaveProperty('client_phone')
    expect(pushed).not.toHaveProperty('client_first_name')
    expect(pushed).not.toHaveProperty('client_last_name')
    expect(pushed).not.toHaveProperty('client_bcp')
  })
})
