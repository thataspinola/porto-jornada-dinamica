import { vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
import type { UseFormReturn, FieldValues } from "react-hook-form";
import { useConditionGuard } from "./useConditionGuard";
import { journeyStore } from "@/store/journeyStore";
import { notify } from "@/components/Core/JourneyNotifier";

const { push } = vi.hoisted(() => ({ push: vi.fn() }));
vi.mock("next/navigation", () => ({
	useRouter: () => ({ push }),
	usePathname: () => "/contrate/financiamento-de-veiculos/cpf",
}));
vi.mock("@/components/Core/JourneyNotifier", () => ({ notify: vi.fn() }));
beforeEach(() => {
	act(() => journeyStore.getState().reset());
});
test("aplica erro e foco quando todos os checks combinam", () => {
	const setError = vi.fn(),
		setFocus = vi.fn();
	const methods = {
		setError,
		setFocus,
		formState: { errors: {} },
	} as unknown as UseFormReturn<FieldValues>;
	const { result } = renderHook(() => useConditionGuard(methods));
	act(() => {
		const response = result.current.evaluate({
			formData: { age: 17 },
			rules: [
				{
					checks: [
						{
							left: { from: "fields", path: "age" },
							op: "LESS_THAN",
							right: { value: 18 },
						},
					],
					action: {
						kind: "fieldError",
						field: "age",
						message: "Idade mínima 18 anos",
						focus: true,
					},
				},
			],
		});
		expect(response.matched).toBe(true);
	});
	expect(setError).toHaveBeenCalledWith("age", {
		type: "condition",
		message: "Idade mínima 18 anos",
	});
	expect(setFocus).toHaveBeenCalledWith("age");
});
test("aplica redirect da regra e não age quando ela não combina", () => {
	const methods = {
		formState: { errors: {} },
	} as unknown as UseFormReturn<FieldValues>;
	const { result } = renderHook(() => useConditionGuard(methods));
	const rules = [
		{
			checks: [
				{
					left: { from: "fields" as const, path: "blocked" },
					op: "EQUAL" as const,
					right: { value: true },
				},
			],
			action: { kind: "redirect" as const, url: "/dados" },
		},
	];
	act(() => {
		result.current.evaluate({ rules, formData: { blocked: false } });
	});
	expect(push).not.toHaveBeenCalled();
	act(() => {
		result.current.evaluate({ rules, formData: { blocked: true } });
	});
	expect(push).toHaveBeenCalledWith(
		"/contrate/financiamento-de-veiculos/dados",
	);
	expect(notify).not.toHaveBeenCalled();
});
