import { useAddressSearch } from "./useAddressSearch";
import { useModalState } from "./useModalState";
export function useAddressSearchController(url?: string) {
	return { ...useAddressSearch(url), ...useModalState() };
}
