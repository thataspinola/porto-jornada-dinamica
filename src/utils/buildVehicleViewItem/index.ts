export function buildVehicleViewItem(vehicle: {
	id?: string;
	brand?: string;
	model?: string;
	price?: number;
}) {
	return {
		item_id: vehicle.id,
		item_name: vehicle.model,
		item_brand: vehicle.brand,
		...(vehicle.price !== undefined ? { price: vehicle.price } : {}),
	};
}
