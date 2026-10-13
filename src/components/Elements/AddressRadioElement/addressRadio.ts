export type AddressOption = {
	id: string;
	street: string;
	number?: string;
	city?: string;
	state?: string;
};
export function addressRadio(address: AddressOption) {
	return {
		value: address.id,
		label: [address.street, address.number, address.city, address.state]
			.filter(Boolean)
			.join(", "),
	};
}
