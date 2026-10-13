import { resolveConditionalTag } from "./resolveConditionalTag";
test("respeita valor condicional", () =>
	expect(
		resolveConditionalTag(
			[{ source: "fields", path: "a", operator: "equals", value: 1 }],
			{ fields: { a: 2 } },
		),
	).toBe(false));
