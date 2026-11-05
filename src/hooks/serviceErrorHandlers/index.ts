export type { AlertEventContext } from './dispatchAlert'
export { dispatchAlert } from './dispatchAlert'
export {
  buildErrorInterpolationScope,
  extractErrorCode,
  interpolateFullscreenAction,
  DEFAULT_ERROR_ACTION,
  resolveErrorAction
} from './resolveErrorAction'
export type {
  FullscreenAction,
  FieldErrorAction,
  NotifyAction,
  RedirectAction,
  ServiceErrorAction
} from './types'
