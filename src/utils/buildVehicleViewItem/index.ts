import { formatGtmText } from '../formatGtm'
import type { Item } from '../pushEvent'

type StandardVehicle = {
  brand?: unknown
  model?: unknown
  manufacturingYear?: unknown
  modelYear?: unknown
}

type VehicleFields = {
  vehicleBrand?: unknown
  vehicleModel?: unknown
  vehicleManufacturingYear?: unknown
  vehicleModelYear?: unknown
  vehicleValue?: unknown
}

export type BuildVehicleViewItemInput = {
  branchId: number
  productName: string
  fields: VehicleFields
  standardVehicle?: unknown
  withInsurance: boolean
  installmentValue?: number | string
  quantity: number
  installments?: number | string
  includeFinancialProtection?: boolean
}

function pickText(...candidates: unknown[]): string {
  for (const candidate of candidates) {
    if (candidate == null) continue
    const text = String(candidate).trim()
    if (text.length > 0) return text
  }

  return ''
}

function asStandardVehicle(value: unknown): StandardVehicle | undefined {
  if (!value || typeof value !== 'object') return undefined
  return value as StandardVehicle
}

export function buildVehicleViewItem(input: BuildVehicleViewItemInput): Item {
  const standardVehicle = asStandardVehicle(input.standardVehicle)

  const brand = formatGtmText(
    pickText(input.fields.vehicleBrand, standardVehicle?.brand)
  )

  const model = formatGtmText(
    pickText(input.fields.vehicleModel, standardVehicle?.model)
  )

  const manufacturingYear = pickText(
    input.fields.vehicleManufacturingYear,
    standardVehicle?.manufacturingYear
  )

  const modelYear = pickText(
    input.fields.vehicleModelYear,
    standardVehicle?.modelYear
  )

  const insurance = input.withInsurance ? 'seguro' : 'nao-seguro'
  const financialProtection = input.withInsurance ? 'sim' : 'nao'
  const vehicleValue = input.fields.vehicleValue

  const itemVariant = input.includeFinancialProtection
    ? `tipo-veiculo:${insurance}|valor-veiculo:${vehicleValue}|protecao-financeira:${financialProtection}`
    : `tipo-veiculo:${insurance}|valor-veiculo:${vehicleValue}`

  return {
    item_id: input.branchId,
    item_name: input.productName,
    item_category: `${brand}:${model}:${manufacturingYear}-${modelYear}`,
    item_brand: brand,
    item_variant: itemVariant,
    price: input.installmentValue,
    quantity: input.quantity,
    ...(input.installments != null && {
      installments: input.installments,
      installment_value: input.installmentValue,
    }),
    affiliation: 'porto',
  }
}
