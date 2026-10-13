export const SCOPE_FIELD = 'scope'

export const VEHICLE_SCOPE = {
  knownPlate: 'know-plate',
  knowBrandModel: 'know-brand-model',
  vehicleUnknow: 'vehicle-unknown',
} as const

export type VehicleScope = (typeof VEHICLE_SCOPE)[keyof typeof VEHICLE_SCOPE]
