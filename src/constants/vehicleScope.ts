export const VEHICLE_SCOPES = ["reff", "fcdc"] as const;
export type VehicleScope = (typeof VEHICLE_SCOPES)[number];
