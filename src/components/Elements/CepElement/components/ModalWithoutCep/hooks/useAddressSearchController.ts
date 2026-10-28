import { useAddressSearch } from './useAddressSearch'
import { useModalState } from './useModalState'
export function useAddressSearchController(
  input: Parameters<typeof useAddressSearch>[0]
) {
  return { ...useAddressSearch(input), ...useModalState() }
}
