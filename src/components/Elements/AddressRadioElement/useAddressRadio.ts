import { addressRadio, type AddressOption } from "./addressRadio";
export function useAddressRadio(addresses: AddressOption[]) {
	return addresses.map(addressRadio);
}
