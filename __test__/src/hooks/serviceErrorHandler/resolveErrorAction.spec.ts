import { resolveErrorAction } from "@/hooks/serviceErrorHandlers/resolveErrorAction";
test("resolve código exato", () => {
	const action = {
		type: "SET_ERROR" as const,
		field: "taxvat",
		message: "Indisponível",
	};
	expect(
		resolveErrorAction("NOT_ELIGIBLE", [{ code: "NOT_ELIGIBLE", action }]),
	).toEqual(action);
	expect(resolveErrorAction("OTHER", [])).toBeUndefined();
});
