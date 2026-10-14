import { productAnalytics } from "@/utils/productAnalytics/index";
test("productAnalytics: transforma entrada sem incluir dados extras", () => {
	expect(productAnalytics({ id: "1", name: "Seguro" })).toEqual({
		item_id: "1",
		item_name: "Seguro",
		item_brand: "porto",
	});
});
