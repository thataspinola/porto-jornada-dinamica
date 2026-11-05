import { beforeEach, vi } from 'vitest'

import { useJourneyStore } from '@/store/journeyStore'

import { pushEvent } from '.'

const originalDataLayer = window.dataLayer

beforeEach(() => {
  window.dataLayer = []
  useJourneyStore.getState().reset()
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

describe('pushEvent', () => {
  describe('runtime guards', () => {
    it('should do nothing and warn when dataLayer is not defined', () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined)
      // biome-ignore lint/suspicious/noExplicitAny: intentionally clearing dataLayer for the test
      ;(window as any).dataLayer = undefined

      pushEvent({ event: 'dialog', evLabel: 'x' })

      expect(warn).toHaveBeenCalledWith('dataLayer is not defined')
    })

    it('should keep the payload unchanged when analyticsUserId is not in the store', () => {
      pushEvent({ event: 'select_content', evLabel: 'Test Label' })

      expect(lastPushed()).toEqual({
        event: 'select_content',
        ev_label: 'test-label'
      })
      expect(lastPushed()).not.toHaveProperty('user_id')
    })
  })

  describe('select_content', () => {
    it('should push only defined fields with formatted evLabel', () => {
      pushEvent({ event: 'select_content', evLabel: 'Test Label' })

      expect(lastPushed()).toEqual({
        event: 'select_content',
        ev_label: 'test-label'
      })
    })

    it('should pass provided optional fields through in snake_case', () => {
      pushEvent({
        event: 'select_content',
        evLabel: 'x',
        evAction: 'check:endereco',
        method: 'form',
        status: 'ok',
        serviceType: 'seguros',
        productIdentify: 'auto',
        productCategory: 'residencial'
      })

      expect(lastPushed()).toEqual({
        event: 'select_content',
        ev_label: 'x',
        ev_action: 'check:endereco',
        method: 'form',
        status: 'ok',
        service_type: 'seguros',
        product_identify: 'auto',
        product_category: 'residencial'
      })
    })
  })

  describe('dialog', () => {
    it('should push fixed ev_action dialog:visualizar and formatted label', () => {
      pushEvent({ event: 'dialog', evLabel: 'Confirmação' })

      expect(lastPushed()).toEqual({
        event: 'dialog',
        ev_label: 'confirmacao',
        ev_action: 'dialog:visualizar'
      })
    })
  })

  describe('alert', () => {
    it('should include alert_event in the payload', () => {
      pushEvent({
        event: 'alert',
        evLabel: 'Erro genérico',
        alertCode: '500|E001',
        errorService: '/api/simulacao',
        alertServiceMessage: 'timeout',
        alertType: 'erro',
        alertEvent: 'view_item'
      })

      expect(lastPushed()).toEqual({
        event: 'alert',
        ev_label: 'erro-generico',
        alert_code: '500|E001',
        error_service: '/api/simulacao',
        alert_service_message: 'timeout',
        alert_type: 'erro',
        alert_event: 'view_item'
      })
    })

    it('should pass ev_action when provided', () => {
      pushEvent({
        event: 'alert',
        evLabel: 'x',
        evAction: 'ecommerce:add:carrinho:alert',
        alertCode: '500',
        errorService: '/api/x',
        alertServiceMessage: 'x',
        alertType: 'negocio',
        alertEvent: 'add_to_cart'
      })

      expect(lastPushed()).toMatchObject({
        ev_action: 'ecommerce:add:carrinho:alert',
        alert_event: 'add_to_cart',
        alert_type: 'negocio'
      })
    })

    it('should support the address search alert contract', () => {
      pushEvent({
        event: 'alert',
        evLabel: 'SP:São Paulo:Rua Augusta:CEP não encontrado',
        evAction: 'buscar-endereco:alert',
        alertCode: 'NO_RESULTS',
        errorService: 'address-search/support',
        alertServiceMessage: 'CEP não encontrado',
        alertType: 'erro',
        alertEvent: 'search_address'
      })

      expect(lastPushed()).toEqual({
        event: 'alert',
        ev_label: 'sp:sao-paulo:rua-augusta:cep-nao-encontrado',
        ev_action: 'buscar-endereco:alert',
        alert_code: 'NO_RESULTS',
        error_service: 'address-search/support',
        alert_service_message: 'CEP não encontrado',
        alert_type: 'erro',
        alert_event: 'search_address'
      })
    })
  })

  describe('search_address', () => {
    it('should push the successful address search with the result count', () => {
      pushEvent({
        event: 'search_address',
        evAction: 'buscar-endereco:sucesso',
        evLabel: '2'
      })

      expect(lastPushed()).toEqual({
        event: 'search_address',
        ev_action: 'buscar-endereco:sucesso',
        ev_label: '2'
      })
    })
  })

  describe('self_service', () => {
    it('should push only defined fields', () => {
      pushEvent({ event: 'self_service', evLabel: 'x' })

      expect(lastPushed()).toEqual({
        event: 'self_service',
        ev_label: 'x'
      })
    })
  })

  describe('view_item', () => {
    it('should treat items as array and preserve provided item fields', () => {
      pushEvent({
        event: 'view_item',
        evAction: 'ecommerce:visualizar:produto:sucesso',
        currency: 'BRL',
        items: [
          {
            item_id: 'SKU-1',
            item_name: 'residencial',
            item_category: 'basico',
            item_brand: 'porto',
            item_variant: 'v1',
            price: 199.9,
            affiliation: 'porto'
          }
        ]
      })

      expect(lastPushed()).toEqual({
        event: 'view_item',
        ev_action: 'ecommerce:visualizar:produto:sucesso',
        currency: 'BRL',
        items: [
          {
            item_id: 'SKU-1',
            item_name: 'residencial',
            item_category: 'basico',
            item_brand: 'porto',
            item_variant: 'v1',
            price: 199.9,
            affiliation: 'porto'
          }
        ]
      })
    })
  })

  describe('view_item_list', () => {
    it('should push array items and value/currency when provided', () => {
      pushEvent({
        event: 'view_item_list',
        evAction: 'list',
        currency: 'BRL',
        value: 99.9,
        items: [{ item_id: 'SKU-1' }, { item_id: 'SKU-2' }]
      })

      expect(lastPushed()).toEqual({
        event: 'view_item_list',
        ev_action: 'list',
        currency: 'BRL',
        value: 99.9,
        items: [{ item_id: 'SKU-1' }, { item_id: 'SKU-2' }]
      })
    })
  })

  describe('select_item', () => {
    it('should push with normalized items array', () => {
      pushEvent({
        event: 'select_item',
        evAction: 'select',
        items: [{ item_id: 'abc' }]
      })

      expect(lastPushed()).toEqual({
        event: 'select_item',
        ev_action: 'select',
        items: [{ item_id: 'abc' }]
      })
    })
  })

  describe('view_promotion', () => {
    it('should push creative/promotion metadata inside items', () => {
      pushEvent({
        event: 'view_promotion',
        evAction: 'ecommerce:visualizar:promocao:sucesso',
        currency: 'BRL',
        value: 250,
        items: [
          {
            item_id: 'SKU-1',
            item_name: 'residencial',
            creative_name: 'upgrade',
            creative_slot: 'modal-turbinar',
            promotion_name: 'turbinar-basico'
          }
        ]
      })

      expect(lastPushed()).toMatchObject({
        event: 'view_promotion',
        ev_action: 'ecommerce:visualizar:promocao:sucesso',
        items: [
          expect.objectContaining({
            creative_name: 'upgrade',
            creative_slot: 'modal-turbinar',
            promotion_name: 'turbinar-basico'
          })
        ]
      })
    })
  })

  describe('select_promotion', () => {
    it('should share the same shape as view_promotion', () => {
      pushEvent({
        event: 'select_promotion',
        evAction: 'ecommerce:selecionar:promocao:sucesso',
        currency: 'BRL',
        items: [{ item_id: 'SKU-1' }]
      })

      expect(lastPushed()).toEqual({
        event: 'select_promotion',
        ev_action: 'ecommerce:selecionar:promocao:sucesso',
        currency: 'BRL',
        items: [{ item_id: 'SKU-1' }]
      })
    })
  })

  describe('add_to_cart', () => {
    it('should push value/currency and items array', () => {
      pushEvent({
        event: 'add_to_cart',
        evAction: 'ecommerce:add:carrinho:sucesso',
        currency: 'BRL',
        value: 199.9,
        items: [{ item_id: 'SKU-1', price: 199.9 }]
      })

      expect(lastPushed()).toEqual({
        event: 'add_to_cart',
        ev_action: 'ecommerce:add:carrinho:sucesso',
        currency: 'BRL',
        value: 199.9,
        items: [{ item_id: 'SKU-1', price: 199.9 }]
      })
    })
  })

  describe('page_view', () => {
    it('should push event and page_location', () => {
      pushEvent({
        event: 'page_view',
        pageLocation: 'https://porto.com.br/seguro-residencial/modal/turbinar'
      })

      expect(lastPushed()).toEqual({
        event: 'page_view',
        page_location: 'https://porto.com.br/seguro-residencial/modal/turbinar'
      })
    })
  })

  describe('purchase', () => {
    it('should push client_id and user_id in snake_case', () => {
      pushEvent({
        event: 'purchase',
        evAction: 'ecommerce:purchase:sucesso',
        currency: 'BRL',
        value: 5000,
        clientId: '898370475.1784572594',
        userId: 'encrypted-cpf',
        items: [{ item_id: 'financiamento-auto' }]
      })

      expect(lastPushed()).toEqual({
        event: 'purchase',
        ev_action: 'ecommerce:purchase:sucesso',
        currency: 'BRL',
        value: 5000,
        client_id: '898370475.1784572594',
        user_id: 'encrypted-cpf',
        items: [{ item_id: 'financiamento-auto' }]
      })
    })
  })

  describe('lead', () => {
    it('should push encrypted client fields in snake_case', () => {
      pushEvent({
        event: 'lead',
        evAction: 'lead:sucesso',
        evLabel: 'pf',
        method: 'tipo-contato:padrao',
        leadId: 'LEAD-123',
        clientId: 'encrypted-cpf',
        clientBcp: 'pescod-1',
        clientEmail: 'sha-email',
        clientPhone: 'sha-phone',
        clientPhoneE164: 'sha-phone-e164',
        clientFirstName: 'sha-first',
        clientLastName: 'sha-last'
      })

      expect(lastPushed()).toEqual({
        event: 'lead',
        ev_action: 'lead:sucesso',
        ev_label: 'pf',
        method: 'tipo-contato:padrao',
        lead_id: 'LEAD-123',
        client_id: 'encrypted-cpf',
        client_bcp: 'pescod-1',
        client_email: 'sha-email',
        client_phone: 'sha-phone',
        client_phone_e164: 'sha-phone-e164',
        client_first_name: 'sha-first',
        client_last_name: 'sha-last'
      })
    })
  })
})
