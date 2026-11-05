import type { ServiceErrorAction } from '@/validation/schemas'

export type { ServiceErrorAction }

// Kept individually for the few call sites that want the narrowed shapes.
export type NotifyAction = Extract<ServiceErrorAction, { kind: 'notify' }>
export type FieldErrorAction = Extract<
  ServiceErrorAction,
  { kind: 'fieldError' }
>
export type RedirectAction = Extract<ServiceErrorAction, { kind: 'redirect' }>
export type FullscreenAction = Extract<
  ServiceErrorAction,
  { kind: 'fullscreen' }
>
