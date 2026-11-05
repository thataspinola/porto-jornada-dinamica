import { getByPath } from '@/utils'

import { CEP_FIELD_NAMES } from '@/components/Elements/CepElement/hooks/constants'

export type ResidentialAddress = {
  [CEP_FIELD_NAMES.addressZipCode]: string
  [CEP_FIELD_NAMES.addressStreetName]: string
  [CEP_FIELD_NAMES.addressNeighborhood]: string
  [CEP_FIELD_NAMES.addressNumber]: string
  [CEP_FIELD_NAMES.addressCity]: string
  [CEP_FIELD_NAMES.addressState]: string
  [CEP_FIELD_NAMES.addressAdditionalInfo]?: string
  [CEP_FIELD_NAMES.hasNoNumber]?: boolean
}

export function normalizeResidentialAddress(
  source: unknown
): ResidentialAddress | undefined {
  if (!source || typeof source !== 'object' || Array.isArray(source)) {
    return undefined
  }

  const r = source as Record<string, unknown>
  const s = (value: unknown) => (typeof value === 'string' ? value : '')
  const normalized: ResidentialAddress = {
    addressZipCode: s(r.addressZipCode ?? r.zipcode),
    addressStreetName: s(r.addressStreetName ?? r.address),
    addressNeighborhood: s(r.addressNeighborhood ?? r.neighborhood),
    addressNumber: s(r.addressNumber),
    addressCity: s(r.addressCity ?? r.city),
    addressState: s(r.addressState ?? r.state),
    addressAdditionalInfo: s(r.addressAdditionalInfo ?? r.complement)
  }

  if (
    !normalized.addressZipCode.trim() &&
    !normalized.addressStreetName.trim()
  ) {
    return undefined
  }

  return normalized
}

export function resolveAddressSource(
  parameters: unknown,
  sourcePath: string | string[]
) {
  const paths = Array.isArray(sourcePath) ? sourcePath : [sourcePath]

  for (const path of paths) {
    const normalized = normalizeResidentialAddress(getByPath(parameters, path))

    if (normalized) {
      return normalized
    }
  }

  return undefined
}

export function getAddressIdentifier(source: ResidentialAddress) {
  return [
    source[CEP_FIELD_NAMES.addressZipCode],
    source[CEP_FIELD_NAMES.addressStreetName],
    source[CEP_FIELD_NAMES.addressNumber],
    source[CEP_FIELD_NAMES.addressCity],
    source[CEP_FIELD_NAMES.addressState]
  ].join('|')
}

export function buildInitialAddressFields(
  source: ResidentialAddress,
  selectionField: string
): Record<string, unknown> {
  const addressKey = getAddressIdentifier(source)

  return { ...source, [selectionField]: addressKey }
}

export function shouldInitializeAddress(
  sourceAddressKey: string | undefined,
  currentAddressKey: unknown
) {
  return (
    sourceAddressKey !== undefined && sourceAddressKey !== currentAddressKey
  )
}

export function formatAddressOption(values: unknown[]) {
  const [
    addressKey,
    addressStreetName,
    addressNumber,
    addressAdditionalInfo,
    addressNeighborhood,
    addressCity,
    addressState
  ] = values
  const label = [addressStreetName, addressNumber].filter(Boolean).join(', ')

  return {
    value: String(addressKey ?? ''),
    label: [label, addressAdditionalInfo].filter(Boolean).join(' - '),
    description: [addressNeighborhood, addressCity, addressState]
      .filter(Boolean)
      .join(' - ')
  }
}
