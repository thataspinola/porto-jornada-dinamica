import { pushEvent } from '@/utils/pushEvent'
beforeEach(() => {
  window.dataLayer = []
})
it('normaliza chaves do contrato nativo e omite campos monetários ausentes', () => {
  pushEvent({
    event: 'view_promotion',
    evAction: 'ecommerce:visualizar:promocao:sucesso',
    items: [{ item_id: 'https://example.test/product', item_name: 'Produto' }],
  })
  expect(window.dataLayer).toEqual([
    {
      event: 'view_promotion',
      ev_action: 'ecommerce:visualizar:promocao:sucesso',
      items: [
        { item_id: 'https://example.test/product', item_name: 'Produto' },
      ],
    },
  ])
})
it('preserva campos explicitamente informados, inclusive zero', () => {
  pushEvent({
    event: 'view_promotion',
    evAction: 'test',
    items: [],
    currency: 'BRL',
    value: 0,
  })
  expect(window.dataLayer?.[0]).toMatchObject({ currency: 'BRL', value: 0 })
})
