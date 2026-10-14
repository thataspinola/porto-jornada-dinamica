import { buildGtmAttrs } from "@/utils/buildGtmAttrs/index";
test("buildGtmAttrs: transforma entrada sem incluir dados extras", () => {
	expect(buildGtmAttrs("cpf", "continuar")).toEqual({
		"data-gtm-name": "cpf",
		"data-gtm-subname": "continuar",
	});
});
