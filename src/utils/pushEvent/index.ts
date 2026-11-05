import { getAnalyticsUserId } from '../ensureAnalyticsUserId'
import { formatGtmText } from '../formatGtm'
import { toSnakeCase } from '../toSnakeCase'
import type { GtmEvent, Item } from './types'

export type { GtmEvent, GtmEventType, Item } from './types'

function pickDefined<T extends Record<string, unknown>>(
  input: T
): Record<string, unknown> {
  const output: Record<string, unknown> = {}
  for (const key in input) {
    if (input[key] !== undefined) output[key] = input[key]
  }
  return output
}

function normalizeItems(items: Item[]): Item[] {
  return items.map((item) => pickDefined(item) as Item)
}

function buildPayload(event: GtmEvent): Record<string, unknown> {
  switch (event.event) {
    case 'select_content':
      return pickDefined({
        event: event.event,
        evLabel: formatGtmText(event.evLabel),
        evAction: event.evAction,
        serviceType: event.serviceType,
        productIdentify: event.productIdentify,
        productCategory: event.productCategory,
        method: event.method,
        status: event.status
      })
    case 'dialog':
      return {
        event: event.event,
        evLabel: formatGtmText(event.evLabel),
        evAction: 'dialog:visualizar'
      }
    case 'alert':
      return pickDefined({
        event: event.event,
        evLabel: formatGtmText(event.evLabel),
        evAction: event.evAction,
        alertCode: event.alertCode,
        errorService: event.errorService,
        alertServiceMessage: event.alertServiceMessage,
        alertType: event.alertType,
        alertEvent: event.alertEvent
      })
    case 'search_address':
      return {
        event: event.event,
        evLabel: formatGtmText(event.evLabel),
        evAction: event.evAction
      }
    case 'self_service':
      return pickDefined({
        event: event.event,
        evLabel: formatGtmText(event.evLabel),
        evAction: event.evAction,
        serviceType: event.serviceType,
        productIdentify: event.productIdentify,
        productInvoice: event.productInvoice,
        serviceDetail: event.serviceDetail,
        productCategory: event.productCategory,
        serviceHour: event.serviceHour,
        serviceDate: event.serviceDate,
        clientId: event.clientId,
        clienteBcp: event.clienteBcp
      })
    case 'view_item':
    case 'view_item_list':
    case 'view_promotion':
    case 'select_promotion':
    case 'add_to_cart':
      return pickDefined({
        event: event.event,
        evAction: event.evAction,
        currency: event.currency,
        value: event.value,
        items: normalizeItems(event.items)
      })
    case 'select_item':
      return {
        event: event.event,
        evAction: event.evAction,
        items: normalizeItems(event.items)
      }
    case 'page_view':
      return {
        event: event.event,
        pageLocation: event.pageLocation
      }
    case 'lead':
      return pickDefined({
        event: event.event,
        evAction: event.evAction,
        evLabel:
          event.evLabel !== undefined
            ? formatGtmText(event.evLabel)
            : undefined,
        method: event.method,
        leadId: event.leadId,
        clientId: event.clientId,
        clientBcp: event.clientBcp,
        clientEmail: event.clientEmail,
        clientPhone: event.clientPhone,
        clientPhoneE164: event.clientPhoneE164,
        clientFirstName: event.clientFirstName,
        clientLastName: event.clientLastName
      })
    case 'purchase':
      return pickDefined({
        event: event.event,
        evAction: event.evAction,
        currency: event.currency,
        value: event.value,
        paymentType: event.paymentType,
        clientId: event.clientId,
        userId: event.userId,
        clientEmail: event.clientEmail,
        clientPhone: event.clientPhone,
        clientPhoneE164: event.clientPhoneE164,
        clientFirstName: event.clientFirstName,
        clientLastName: event.clientLastName,
        items: normalizeItems(event.items)
      })
  }
}

export function pushEvent(event: GtmEvent): void {
  if (typeof window === 'undefined') {
    console.warn(
      'It was not possible to trigger the event in the dataLayer because the component is running on the server side.'
    )
    return
  }

  if (!window.dataLayer) {
    console.warn('dataLayer is not defined')
    return
  }

  const payload = buildPayload(event)
  const analyticsUserId = getAnalyticsUserId()

  window.dataLayer.push(
    toSnakeCase({
      ...payload,
      ...(analyticsUserId ? { userId: analyticsUserId } : {})
    })
  )
}
