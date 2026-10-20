import { formatPrice } from "@/utils/formatPrice/index";
test("formatPrice: transforma entrada sem incluir dados extras", () => {
	expect(formatPrice(12.5)).toEqual("R$ 12,50");
});
