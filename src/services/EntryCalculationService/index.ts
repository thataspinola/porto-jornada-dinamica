import type { ServiceResult } from '../types'
import type {
  EntryCalculationInput,
  EntryCalculationOutput,
  InitialSimulationData
} from './types'

type ServiceHandler = (input: unknown) => Promise<ServiceResult>

// TODO: Substituir mock pela chamada real ao endpoint:
// POST <url_sensedia>/hub-vendas-carbon/aquisicao/v1/emprestimos-financiamentos/financiamento-veicular/calculo-entrada
function calculateEntry(input: EntryCalculationInput): EntryCalculationOutput {
  const { vehicleValue, preApprovedValue, targetEntry, minEntryPercentage } =
    input

  const minEntryValue = vehicleValue * minEntryPercentage
  let resultingEntry = targetEntry

  if (resultingEntry < minEntryValue) {
    resultingEntry = minEntryValue
  }

  const preApprovedDiff = vehicleValue - preApprovedValue
  if (resultingEntry < preApprovedDiff) {
    resultingEntry = preApprovedDiff
  }

  const maxEntryValue = vehicleValue * 0.9
  if (resultingEntry > maxEntryValue) {
    resultingEntry = maxEntryValue
  }

  const financingValue = vehicleValue - resultingEntry

  return { resultingEntry, financingValue }
}

// TODO: Substituir pelos dados reais vindos da API de pré-aprovação do cliente
const MOCK_SIMULATION_PARAMS = {
  vehicleValue: 100000,
  minEntryPercentage: 0.2,
  preApprovedValue: 70000
}
//remover quando tiver api
export const initEntryCalculation: ServiceHandler = async () => {
  const { vehicleValue, minEntryPercentage, preApprovedValue } =
    MOCK_SIMULATION_PARAMS
  const { resultingEntry, financingValue } = calculateEntry({
    vehicleValue,
    preApprovedValue,
    targetEntry: 0,
    minEntryPercentage
  })

  const data: InitialSimulationData = {
    vehicleValue,
    preApprovedValue,
    minEntryPercentage,
    minEntryValue: Math.max(
      vehicleValue * minEntryPercentage,
      Math.max(0, vehicleValue - preApprovedValue)
    ),
    maxEntryValue: vehicleValue * 0.9,
    resultingEntry,
    financingValue
  }

  return { success: true, data }
}

export const entryCalculation: ServiceHandler = async (input: unknown) => {
  const typedInput = input as EntryCalculationInput

  const result = calculateEntry(typedInput)

  return { success: true, data: result }
}
