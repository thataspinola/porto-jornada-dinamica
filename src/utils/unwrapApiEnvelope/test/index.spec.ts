import { unwrapApiEnvelope } from "@/utils/unwrapApiEnvelope/index";
test("unwrapApiEnvelope: transforma entrada sem incluir dados extras", () => {
	expect(unwrapApiEnvelope({ data: { id: 1 } })).toEqual({ id: 1 });
});
