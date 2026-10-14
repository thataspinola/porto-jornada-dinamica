import { describe, expect, it, vi, afterEach } from "vitest";
import { computePrefillValues } from "@/utils/computePrefillValues";
import { resolveDefaultValue } from "@/utils/resolveDefaultValue";
import { getByPath } from "@/utils/getByPath";
import { getStepData } from "@/utils/getStepData";
import { injectProgressToSteps } from "@/utils/injectProgressToSteps";
import { clampNumber } from "@/utils/clampNumber";
import { normalizeVertical } from "@/utils/normalizeVertical";
import { formatToCurrency } from "@/utils/formatCurrency";
import { journeyMetadata } from "@/utils/metadata";
import { sendNativeMessage } from "@/utils/sendNativeMessage";
import { dispatchNavigate, NAVIGATE_EVENT } from "@/utils/dispatchNavigate";
import { parseStyleValue } from "@/utils/resolveStyle/parsers";
import { encryptGtmClientId } from "@/utils/encrypt";
import type { JourneyDefinition } from "@/validation/schemas";

const nativeWindow = window as Window & {
	ReactNativeWebView?: { postMessage: (message: string) => void };
};
afterEach(() => {
	delete nativeWindow.ReactNativeWebView;
	vi.restoreAllMocks();
});
describe("dados e navegação da jornada", () => {
	it.each([
		[null, "a"],
		[undefined, "a"],
		[1, "a"],
		[{ a: null }, "a.b"],
		[{ a: 1 }, "a.b"],
		[{}, "a"],
	])("resolve caminho ausente com segurança", (data, path) =>
		expect(getByPath(data, path as string)).toBeUndefined());
	it("resolve raiz, caminho aninhado e segmentos vazios", () => {
		const data = { user: { name: "Ana" } };
		expect(getByPath(data, "")).toBe(data);
		expect(getByPath(data, ".user..name.")).toBe("Ana");
	});
	it("calcula posição, progresso e limites sem mutar a jornada", () => {
		const steps = [{ slug: "cpf" }, { slug: "placa" }, { slug: "resumo" }];
		expect(getStepData(steps, "ausente")).toBeNull();
		expect(getStepData(steps, "cpf")).toMatchObject({
			position: 0,
			isFirst: true,
			isLast: false,
		});
		expect(getStepData(steps, "resumo")).toMatchObject({
			position: 2,
			isFirst: false,
			isLast: true,
			progress: 100,
		});
		const journey = { steps };
		const result = injectProgressToSteps(journey);
		expect(
			result.steps.map(
				(step: { progress: { value: number } }) => step.progress.value,
			),
		).toEqual([33, 67, 100]);
		expect(steps[0]).not.toHaveProperty("progress");
		expect(injectProgressToSteps({ steps: [] })).toEqual({ steps: [] });
	});
	it("prefill respeita dados preenchidos e resolve serviço e valor estático", () => {
		const services = {
			profile: { customer: { name: "Ana Silva", id: 23, missing: null } },
		};
		expect(resolveDefaultValue({ defaultValue: 23 }, services)).toBe("23");
		expect(
			resolveDefaultValue(
				{ defaultValueFrom: { service: "profile", path: "customer.name" } },
				services,
			),
		).toBe("Ana Silva");
		expect(
			resolveDefaultValue(
				{ defaultValueFrom: { service: "profile", path: "customer.missing" } },
				services,
			),
		).toBeUndefined();
		expect(resolveDefaultValue({}, services)).toBeUndefined();
		expect(
			resolveDefaultValue(
				{ defaultValueFrom: { service: "profile" } },
				services,
			),
		).toBeUndefined();
		const elements = [
			{ config: { name: "name", defaultValue: "Ana" } },
			{ config: { name: "cpf", defaultValue: "123" } },
			{ config: {} },
			{ config: { name: "unknown" } },
		] as JourneyDefinition["steps"][number]["elements"];
		expect(
			computePrefillValues(elements, { cpf: "user value" }, services),
		).toEqual({ name: "Ana" });
		expect(
			computePrefillValues(elements, { name: null, cpf: "" }, services),
		).toEqual({ name: "Ana", cpf: "123" });
	});
});
describe("formatos e pontes do navegador", () => {
	it("limita valores ao intervalo e rejeita intervalo invertido", () => {
		expect(clampNumber(-1, 0, 10)).toBe(0);
		expect(clampNumber(11, 0, 10)).toBe(10);
		expect(clampNumber(5, 0, 10)).toBe(5);
		expect(() => clampNumber(5, 10, 0)).toThrow(RangeError);
	});
	it("normaliza vertical, moeda, estilo e metadados", () => {
		expect(normalizeVertical("  Porto Seguro  ")).toBe("porto_seguro");
		expect(formatToCurrency(12.5).replace(/\s/g, " ")).toBe("R$ 12,50");
		expect(parseStyleValue("  2rem ")).toBe("2rem");
		expect(parseStyleValue(2)).toBe(2);
		expect(journeyMetadata("Financiamento")).toEqual({
			title: "Financiamento | Porto",
			description: "Conheça Financiamento na Porto.",
		});
	});
	it("envia payload apenas quando há ponte nativa", () => {
		expect(sendNativeMessage({ event: "next" })).toBe(false);
		const postMessage = vi.fn();
		nativeWindow.ReactNativeWebView = { postMessage };
		expect(sendNativeMessage({ event: "next" })).toBe(true);
		expect(postMessage).toHaveBeenCalledWith('{"event":"next"}');
	});
	it("publica navegação no EventTarget", () => {
		const listener = vi.fn();
		window.addEventListener(NAVIGATE_EVENT, listener);
		dispatchNavigate();
		expect(listener).toHaveBeenCalledTimes(1);
		window.removeEventListener(NAVIGATE_EVENT, listener);
	});
	it("criptografa identificadores sem retornar o texto original", () => {
		expect(encryptGtmClientId()).toBeUndefined();
		const result = encryptGtmClientId("client-id");
		expect(result).toMatch(/^[a-f0-9]+$/);
		expect(result).not.toBe("client-id");
		expect(encryptGtmClientId("client-id")).toBe(result);
	});
});
