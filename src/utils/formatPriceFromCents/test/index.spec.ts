import { formatPriceFromCents } from "@/utils/formatPriceFromCents/index";
test("formatPriceFromCents: transforma entrada sem incluir dados extras", () => {
	expect(formatPriceFromCents(1250)).toEqual("R$ 12,50");
});
