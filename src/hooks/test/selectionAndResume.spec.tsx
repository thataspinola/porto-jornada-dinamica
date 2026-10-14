import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useResumeElementController } from "@/components/Elements/ResumeElement/useResumeElementController";
import { useFCDCResumeElementController } from "@/features/fcdc/components/Elements/FCDCResumeElement/useFCDCResumeElementController";
import { useREFFResumeElementController } from "@/features/reff/components/Elements/REFFResumeElement/useREFFResumeElementController";
import { coveragePlan } from "@/components/Elements/PlanCardElement/hooks/coveragePlan";
import { useFormTabs } from "@/components/Elements/TabsElement/hooks/useFormTabs";
import { useLocalTabs } from "@/components/Elements/TabsElement/hooks/useLocalTabs";
import { useInstallments } from "@/features/fcdc/components/Elements/FCDCPriceSimulationElement/useInstallments";
import { journeyStore } from "@/store/journeyStore";

afterEach(() => {
	journeyStore.getState().reset();
	vi.restoreAllMocks();
});
describe("seleção e resumo por produto", () => {
	it.each([
		useResumeElementController,
		useFCDCResumeElementController,
		useREFFResumeElementController,
	])("resumo mantém dados dos domínios e permite imprimir", (useController) => {
		journeyStore.getState().mergeFields({ cpf: "52998224725" });
		journeyStore.getState().mergeBusiness({ product: "fixture" });
		journeyStore.getState().mergeServices({ eligibility: { success: true } });
		const print = vi.spyOn(window, "print").mockImplementation(() => {});
		const { result } = renderHook(() => useController());
		expect(result.current).toMatchObject({
			fields: { cpf: "52998224725" },
			business: { product: "fixture" },
			services: { eligibility: { success: true } },
		});
		act(() => result.current.print());
		expect(print).toHaveBeenCalledOnce();
		act(() => journeyStore.getState().mergeFields({ name: "Ana" }));
		expect(result.current.fields.name).toBe("Ana");
	});
	it("coberturas pertencem ao plano selecionado", () => {
		const coverages = [
			{ name: "Cobertura da fixture", description: "Descrição" },
		];
		expect(
			coveragePlan([{ id: "a", title: "Plano A", coverages }], "a"),
		).toEqual(coverages);
		expect(
			coveragePlan([{ id: "a", title: "Plano A", coverages }], "missing"),
		).toEqual([]);
	});
	it("aba local e aba do formulário mantêm tipos e validação", () => {
		const { result } = renderHook(() => useLocalTabs());
		expect(result.current.activeTab).toBe(0);
		act(() => result.current.setActiveTab(1));
		expect(result.current.activeTab).toBe(1);
		const setValue = vi.fn();
		useFormTabs("plan", setValue)("b");
		expect(setValue).toHaveBeenCalledWith("plan", "b", {
			shouldValidate: true,
		});
	});
	it("seleciona parcela FCDC e não inventa opção ausente", () => {
		const option = { count: 12, amount: 100 };
		expect(useInstallments([option], 12)).toBe(option);
		expect(useInstallments([option], 24)).toBeUndefined();
	});
});
