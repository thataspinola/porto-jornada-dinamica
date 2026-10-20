import { formatPercentage } from "@/utils/formatPercentage/index";
test("formatPercentage: transforma entrada sem incluir dados extras", () => {
	expect(formatPercentage(12.5)).toEqual("12,5%");
});
