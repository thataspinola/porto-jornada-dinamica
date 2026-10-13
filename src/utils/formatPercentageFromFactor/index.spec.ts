import { formatPercentageFromFactor } from "./index";
test("formatPercentageFromFactor: transforma entrada sem incluir dados extras", () => {
	expect(formatPercentageFromFactor(0.125)).toEqual("12,5%");
});
