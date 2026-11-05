import type { useAddresses } from '@/hooks/queries/useAddresses'
import type { useLocalities } from '@/hooks/queries/useLocalities'
import type { useStates } from '@/hooks/queries/useStates'

type StatesData = ReturnType<typeof useStates>['statesData']
type LocalitiesData = ReturnType<typeof useLocalities>['localitiesData']
type AddressesData = ReturnType<typeof useAddresses>['addressesData']

type UseAddressStatusProps = {
  statesData: StatesData
  addressesData: AddressesData
  localitiesData: LocalitiesData
  selectedState: string
  isStatesError: boolean
  isStatesSuccess: boolean
  isAddressesError: boolean
  isAddressesLoading: boolean
  isLocalitiesError: boolean
  isLocalitiesSuccess: boolean
  isLocalitiesLoading: boolean
  isAddressesSuccess: boolean
  hasAddressSearch: boolean
}

export function useAddressStatus({
  statesData,
  isStatesError,
  selectedState,
  addressesData,
  localitiesData,
  isStatesSuccess,
  isAddressesError,
  isAddressesLoading,
  isLocalitiesError,
  isAddressesSuccess,
  isLocalitiesSuccess,
  isLocalitiesLoading,
  hasAddressSearch
}: UseAddressStatusProps) {
  const hasEmptyStates =
    isStatesSuccess && (statesData?.states.length ?? 0) === 0
  const hasStatesFailure = isStatesError || hasEmptyStates

  const hasEmptyLocalities =
    isLocalitiesSuccess && (localitiesData?.localities.length ?? 0) === 0
  const hasLocalitiesFailure = isLocalitiesError || hasEmptyLocalities

  const hasAddressResults =
    isAddressesSuccess && (addressesData?.addresses.length ?? 0) > 0
  const hasEmptyAddressResults =
    isAddressesSuccess && (addressesData?.addresses.length ?? 0) === 0
  const showAddressResults =
    hasAddressSearch &&
    (hasAddressResults || hasEmptyAddressResults || isAddressesError)

  return {
    hasStatesFailure,
    hasLocalitiesFailure,
    showAddressLoading: hasAddressSearch && isAddressesLoading,
    showRadioList: showAddressResults && hasAddressResults,
    showEmptyList:
      showAddressResults && (isAddressesError || hasEmptyAddressResults),
    isCityDisabled: !selectedState || isLocalitiesLoading
  }
}
