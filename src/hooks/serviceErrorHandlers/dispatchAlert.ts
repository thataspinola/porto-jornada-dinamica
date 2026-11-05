import { ServiceError } from '@/services/types'

import { pushEvent } from '@/utils'
import type { GtmEventType } from '@/utils/pushEvent'

import type { ServiceErrorAction } from './types'

export type AlertEventContext = {
  alertEvent: Exclude<
    GtmEventType,
    'alert' | 'dialog' | 'self_service' | 'page_view'
  >
  errorService: string
  evAction?: string
}

const DEFAULT_ALERT_ACTION: Partial<
  Record<AlertEventContext['alertEvent'], string>
> = {
  view_item: 'ecommerce:visualizar:produto:alert',
  view_item_list: 'ecommerce:visualizar:lista:alert',
  select_item: 'ecommerce:selecionar:produto:alert',
  view_promotion: 'ecommerce:visualizar:promocao:alert',
  select_promotion: 'ecommerce:selecionar:promocao:alert',
  add_to_cart: 'ecommerce:add:carrinho:alert',
  lead: 'lead:alert',
  purchase: 'ecommerce:purchase:alert',
  search_address: 'buscar-endereco:alert',
  select_content: 'carregar:alert'
}

function extractHttpStatus(error: unknown): string | undefined {
  if (error instanceof ServiceError && error.statusCode > 0) {
    return String(error.statusCode)
  }
  return undefined
}

function alertLabelForAction(action: ServiceErrorAction): string {
  if (action.kind === 'notify') return action.title
  if (action.kind === 'fieldError') return action.message
  if (action.kind === 'fullscreen') return action.attempts[0]?.title ?? ''
  return ''
}

function alertTypeForAction(
  action: ServiceErrorAction
): 'erro' | 'negocio' | 'usuario' {
  if (action.kind === 'fieldError') return 'negocio'
  return 'erro'
}

export function dispatchAlert(
  action: ServiceErrorAction,
  code: string,
  error: unknown,
  context: AlertEventContext
) {
  if (action.kind === 'redirect') return

  const httpStatus = extractHttpStatus(error)
  const alertCode = httpStatus ? `${httpStatus}|${code}` : code
  const rawMessage =
    error instanceof Error && error.message ? error.message : code

  pushEvent({
    event: 'alert',
    evLabel: alertLabelForAction(action),
    evAction: context.evAction ?? DEFAULT_ALERT_ACTION[context.alertEvent],
    alertCode,
    errorService: context.errorService,
    alertServiceMessage: rawMessage,
    alertType: alertTypeForAction(action),
    alertEvent: context.alertEvent
  })
}
