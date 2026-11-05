export type Item = {
  item_id: string | number
  item_name?: string
  item_category?: string
  item_brand?: string
  item_variant?: string
  item_list_name?: string
  item_list_id?: string
  item_price?: number | string
  item_quantity?: number | string
  installment_value?: number | string
  installments?: number | string
  affiliation?: string
  creative_name?: string
  creative_slot?: string
  promotion_name?: string
  price?: number | string
  quantity?: number | string
  discount?: number | string
}

export type AlertType = 'erro' | 'negocio' | 'bloqueio' | 'usuario'

export type GtmEvent =
  | {
      event: 'select_content'
      evLabel: string
      evAction?: string
      method?: string
      status?: string
      serviceType?: string
      productIdentify?: string
      productCategory?: string
    }
  | {
      event: 'dialog'
      evLabel: string
    }
  | {
      event: 'alert'
      evLabel: string
      evAction?: string
      alertCode: string
      errorService: string
      alertServiceMessage: string
      alertType: AlertType
      alertEvent: GtmEventType
    }
  | {
      event: 'search_address'
      evLabel: string
      evAction: string
    }
  | {
      event: 'self_service'
      evLabel: string
      evAction?: string
      serviceType?: string
      serviceDetail?: string
      serviceHour?: string
      serviceDate?: string
      productInvoice?: string
      productIdentify?: string
      productCategory?: string
      clientId?: string
      clienteBcp?: string
    }
  | {
      event: 'view_item'
      evAction: string
      currency?: string
      value?: number | string
      items: Item[]
    }
  | {
      event: 'view_item_list'
      evAction: string
      currency?: string
      value?: number | string
      items: Item[]
    }
  | {
      event: 'select_item'
      evAction: string
      items: Item[]
    }
  | {
      event: 'view_promotion'
      evAction: string
      currency?: string
      value?: number | string
      items: Item[]
    }
  | {
      event: 'select_promotion'
      evAction: string
      currency?: string
      value?: number | string
      items: Item[]
    }
  | {
      event: 'add_to_cart'
      evAction: string
      currency?: string
      value?: number | string
      items: Item[]
    }
  | {
      event: 'page_view'
      pageLocation: string
    }
  | {
      event: 'lead'
      evAction: string
      evLabel?: string
      method?: string
      leadId?: string
      clientId?: string
      clientBcp?: string
      clientEmail?: string
      clientPhone?: string
      clientPhoneE164?: string
      clientFirstName?: string
      clientLastName?: string
    }
  | {
      event: 'purchase'
      evAction: string
      currency?: string
      value?: number | string
      paymentType?: string
      clientId?: string
      userId?: string
      clientEmail?: string
      clientPhone?: string
      clientPhoneE164?: string
      clientFirstName?: string
      clientLastName?: string
      items: Item[]
    }

export type GtmEventType = GtmEvent['event']
