"use client";

import { redirect } from "next/navigation";
import { useState } from "react";
import type {
	UseFormGetFieldState,
	UseFormGetValues,
	UseFormHandleSubmit,
	UseFormTrigger,
} from "react-hook-form";

import { useJourneyStore } from "@/store";
import { dispatchNavigate } from "@/utils";
import type { JourneyDefinition } from "@/validation/schemaValidation/journey.schema";
import { callService } from "../services";

type FormValues = Record<string, unknown>;

type JourneyStep = JourneyDefinition["steps"][number];

export type GoNextOptions =
	| { type: "navigation"; targetSlug: string }
	| { type: "service"; serviceName: string; targetSlug: string }
	| { type: "next" };

type SubmittedPayload = {
	fields: FormValues;
	error: Record<string, unknown>;
	business: Record<string, unknown>;
	services: Record<string, unknown>;
};

export type UseJourneyNavigationParams = {
	steps: JourneyDefinition["steps"];
	currentStep: JourneyStep | null;
	currentStepIndex: number;
	currentStepFields: string[];
	getValues: UseFormGetValues<FormValues>;
	handleSubmit: UseFormHandleSubmit<FormValues>;
	trigger: UseFormTrigger<FormValues>;
	getFieldState: UseFormGetFieldState<FormValues>;
};

export function useJourneyNavigation({
	steps,
	currentStep,
	currentStepIndex,
	currentStepFields,
	getValues,
	handleSubmit,
	trigger,
	getFieldState,
}: UseJourneyNavigationParams) {
	const { mergeFields, setError, mergeServices, business, services } =
		useJourneyStore();
	const [submitted, setSubmitted] = useState<SubmittedPayload | null>(null);

	function redirectTo(urlOrSlug: string) {
		const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";

		const isAbsoluteUrl =
			urlOrSlug.startsWith("http://") ||
			urlOrSlug.startsWith("https://") ||
			urlOrSlug.startsWith("www.") ||
			urlOrSlug.startsWith(baseUrl);

		if (isAbsoluteUrl) {
			window.location.href = urlOrSlug;
			dispatchNavigate(); // Dispara o evento de navegação para atualizar o pathname em outros componentes que usam useCurrentPathname.
			return;
		}

		const fullUrl = `${baseUrl}/contrate/${business.journeySlug}/${urlOrSlug}`;
		redirect(fullUrl);
	}

	async function validateCurrentStep() {
		// Verifica que não tem step atual ou que o step atual não tem campos, nesse caso retorna true (válido)
		if (!currentStep || currentStepFields.length === 0) return true;

		const ok = await trigger(currentStepFields); // Dispara a validação dos campos do passo atual e espera o resultado. O trigger retorna true se todos os campos forem válidos e false se algum campo for inválido

		if (!ok) {
			const fieldErrors: FormValues = {}; // Para cada campo do passo atual, pega o estado do campo usando getFieldState e se tiver um erro, adiciona a mensagem de erro no objeto fieldErrors usando o nome do campo como chave. Depois seta os erros no estado global usando setError para que possam ser exibidos na interface

			for (const field of currentStepFields) {
				// Itera sobre os campos do passo atual e para cada campo, pega o estado do campo usando getFieldState e se tiver um erro, adiciona a mensagem de erro no objeto fieldErrors usando o nome do campo como chave. Depois seta os erros no estado global usando setError para que possam ser exibidos na interface
				const message = getFieldState(field).error?.message;
				if (message) fieldErrors[field] = message;
			}
			setError(fieldErrors);
			return false;
		}

		setError({});
		mergeFields(getValues());
		return true;
	}

	async function goNext(options: GoNextOptions) {
		if (!currentStep) return;

		const valid = await validateCurrentStep();
		if (!valid) return;

		if (options.type === "service") {
			const input = getValues();

			const result = await callService(options.serviceName, {
				serviceName: options.serviceName,
				fields: input,
				business,
			});

			mergeServices({ [options.serviceName]: result });
			if (!result.success) {
				setError({ service: result.error });
				return;
			}

			redirectTo(options.targetSlug);
			return;
		}

		if (options.type === "navigation") {
			redirectTo(options.targetSlug);
			return;
		}

		const nextStep = steps[currentStepIndex + 1];
		if (nextStep) {
			redirectTo(nextStep.slug);
			return;
		}

		handleSubmit((values) => {
			mergeFields(values);
			setError({});
			setSubmitted({ fields: values, error: {}, business, services });
		})();
	}

	function goPrev() {
		// Navega para o passo anterior, se existir. Se o slug do passo anterior for "/", navega para a home
		if (!currentStep?.backStepSlug) return;
		const backStepSlug = currentStep.backStepSlug;

		mergeFields(getValues());

		if (backStepSlug === "/") {
			redirectTo("/");
			return;
		}
		redirectTo(backStepSlug);
	}

	return { goNext, goPrev, submitted, setSubmitted };
}
