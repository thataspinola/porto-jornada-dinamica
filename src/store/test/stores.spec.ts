import { beforeEach, describe, expect, it } from "vitest";
import { journeyStore } from "@/store/journeyStore";
import { navigationStore } from "@/store/navigationStore";

beforeEach(() => journeyStore.getState().reset());
describe("stores da jornada", () => {
	it("mescla dados de domínios independentes sem descartar valores anteriores", () => {
		for (const method of [
			"mergeFields",
			"mergeBusiness",
			"mergeServices",
			"mergeParameters",
		] as const) {
			journeyStore.getState()[method]({ first: 1 });
			journeyStore.getState()[method]({ second: 2 });
		}
		for (const key of ["fields", "business", "services", "parameters"] as const)
			expect(journeyStore.getState()[key]).toEqual({ first: 1, second: 2 });
	});
	it("substitui erros, hidrata e limpa os domínios", async () => {
		journeyStore.getState().setError({ cpf: "Inválido" });
		journeyStore.getState().setError({ service: "Falha" });
		expect(journeyStore.getState().error).toEqual({ service: "Falha" });
		journeyStore
			.getState()
			.setErrors([
				{
					code: "INVALID",
					action: { type: "SET_ERROR", field: "cpf", message: "Inválido" },
				},
			]);
		expect(journeyStore.getState().errors).toHaveLength(1);
		journeyStore.getState().setHasHydrated(false);
		await journeyStore.persist.rehydrate();
		expect(journeyStore.getState()._hasHydrated).toBe(true);
		journeyStore.getState().reset();
		expect(journeyStore.getState()).toMatchObject({
			fields: {},
			business: {},
			services: {},
			parameters: {},
			error: {},
			errors: [],
		});
	});
	it("notifica mudanças de navegação pendente", () => {
		navigationStore.getState().setPending(true);
		expect(navigationStore.getState().pending).toBe(true);
		navigationStore.getState().setPending(false);
		expect(navigationStore.getState().pending).toBe(false);
	});
});
