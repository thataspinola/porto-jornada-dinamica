export type EntryCalculationInput = {
  vehicleValue: number
  preApprovedValue: number
  targetEntry: number
  minEntryPercentage: number
}

export type EntryCalculationOutput = {
  resultingEntry: number
  financingValue: number
}

// remover quando tiver api
export type InitialSimulationData = {
  vehicleValue: number
  preApprovedValue: number
  minEntryPercentage: number
  minEntryValue: number
  maxEntryValue: number
  resultingEntry: number
  financingValue: number
}
