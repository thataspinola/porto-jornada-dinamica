export function productAnalytics(product: {
	id: string;
	name: string;
	brand?: string;
}) {
	return {
		item_id: product.id,
		item_name: product.name,
		item_brand: product.brand ?? "porto",
	};
}
