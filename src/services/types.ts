export const SERVICE_ERROR_CODE = {
  NOT_ELIGIBLE: 'NOT_ELIGIBLE',
  NOT_ELIGIBLE_VEHICLE: 'NOT_ELIGIBLE_VEHICLE',
  NOT_ALLOWED_VEHICLE_MANUFACTURE_YEAR: 'NOT_ALLOWED_VEHICLE_MANUFACTURE_YEAR',
  INVALID_VEHICLE_PLATE: 'INVALID_VEHICLE_PLATE',
  NOT_ALLOWED_VEHICLE_TYPE: 'NOT_ALLOWED_VEHICLE_TYPE',
  INVALID_VEHICLE_VALUE_MAX_FIPE: 'INVALID_VEHICLE_VALUE_MAX_FIPE',
  INVALID_VEHICLE_VALUE_MAX_ALLOWED: 'INVALID_VEHICLE_VALUE_MAX_ALLOWED',
  INVALID_ENTRY_VALUE_MIN_LOAN: 'INVALID_ENTRY_VALUE_MIN_LOAN',
  INVALID_ENTRY_VALUE_MAX_APPROVED_LOAN:
    'INVALID_ENTRY_VALUE_MAX_APPROVED_LOAN',
  INVALID_ENTRY_VALUE_MIN_ALLOWED: 'INVALID_ENTRY_VALUE_MIN_ALLOWED',
  CONNECTION_ERROR: 'CONNECTION_ERROR',
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
} as const

export type ServiceErrorCode =
  | (typeof SERVICE_ERROR_CODE)[keyof typeof SERVICE_ERROR_CODE]
  | (string & Record<never, never>)

export type ServiceResult<TData = unknown> = {
  success: boolean
  error?: ServiceErrorCode
  data?: TData
  statusCode?: number
  sessionRestarted?: boolean
}

export class ServiceError extends Error {
  statusCode: number

  constructor(message: string, statusCode: number) {
    super(message)
    this.name = 'ServiceError'
    this.statusCode = statusCode
  }
}
