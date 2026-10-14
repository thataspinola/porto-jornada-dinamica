import { resolveValidationAttributes } from "@/utils/resolveValidationAttributes/index";
test("resolveValidationAttributes: transforma entrada sem incluir dados extras", () => {
	expect(resolveValidationAttributes({ required: true, minLength: 2 })).toEqual(
		{ required: true, minLength: 2 },
	);
});
