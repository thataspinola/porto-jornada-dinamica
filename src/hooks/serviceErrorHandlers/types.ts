import type { ServiceErrorAction } from '@/validation/schemas'

export type { ServiceErrorAction }

export type NotifyAction = Extract<ServiceErrorAction, { kind: 'notigy' }>

export type FieldErrorAction = Extract<
  ServiceErrorAction,
  { kind: 'fieldError' }
>

export type RedirectAction = Extract<ServiceErrorAction, { kind: 'redirect' }>

export type FullscreenAction = Extract<
  ServiceErrorAction,
  { kind: 'fullscreen' }
>
