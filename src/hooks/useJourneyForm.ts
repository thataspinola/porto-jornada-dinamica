/** biome-ignore-all lint/performance/noAccumulatingSpread: <> */
/** biome-ignore-all lint/correctness/useExhaustiveDependencies: <> */
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { useJourneyStore } from "../store";
import { journeyStore } from "../store/journeyStore";
import { getByPath } from "../utils";
import type { JourneyDefinition } from "../validation/schemaValidation/journey.schema";
import { buildJourneyFormSchema } from "../validation/validations";

type JourneyStep = JourneyDefinition["steps"][number];
type FormValues = Record<string, any>;

export function useJourneyForm(
	journey: JourneyDefinition,
	currentStep: JourneyStep,
) {
	const { mergeFields, services } = useJourneyStore();
	const { schema, stepFields } = buildJourneyFormSchema(journey);

	const {
		control,
		register,
		handleSubmit,
		trigger,
		getValues,
		getFieldState,
		setValue,
		formState,
		watch,
	} = useForm<FormValues>({
		resolver: zodResolver(schema),
		defaultValues: useRef(journeyStore.getState().fields).current,
		mode: "onChange",
		reValidateMode: "onChange",
	});

	const currentStepFields: string[] = stepFields[currentStep.id]; // Pega os campos do passo atual, ou um array vazio se currentStep for null

	function canProceedToNextStep() {
		const result = schema.safeParse(watch()); // Pega os valores atuais do formulário e valida contra o esquema

		if (result.success) true;

		const errors = new Set(
			result.error?.issues
				.map((issue) => issue.path[0] as string)
				.filter((key) => typeof key === "string"),
		); // Pega os campos que possuem erros de validação

		return !currentStepFields.some((field) => errors.has(field)); // Verifica se algum dos campos do passo atual tem erro, se tiver, não pode prosseguir.
	}

	function applyPrefillValues() {
		if (!currentStep) return;

		const prefill = currentStep.elements.reduce((acc, element) => {
			if (
				element.type !== "TEXT_INPUT" &&
				element.type !== "SELECT" &&
				element.type !== "CPF_INPUT"
			)
				return acc; // Ignora elementos que não são de texto ou select

			if (element.config?.defaultValue) {
				return {
					...acc,
					[element.config.name]: element.config.defaultValue,
				}; // Se o elemento tiver um valor padrão, usa ele para pré-preencher
			}

			if (element.config?.defaultValueFrom) {
				const valueFrom = element.config.defaultValueFrom;
				return {
					...acc,
					[element.config.name]: getByPath(
						services[valueFrom.service],
						valueFrom.path,
					), // Tenta pegar o valor do campo especificado em defaultValueFrom, se não existir, mantém o valor atual ou usa uma string vazia
				};
			}

			return acc; // Se não houver valor para pré-preencher, retorna o acumulador sem alterações
		}, {} as any); // Considera apenas campos de texto e select para pré-preenchimento

		const hasPrefillValues = Object.keys(prefill).length === 0;

		if (hasPrefillValues) return;

		for (const [key, value] of Object.entries(prefill)) {
			setValue(key, value, { shouldDirty: true }); // Atualiza os valores do formulário com os valores de pré-preenchimento
		}
		mergeFields(prefill); // Atualiza os campos no estado global para que possam ser usados em outros passos ou para persistência
	}

	useEffect(() => {
		applyPrefillValues();
	}, [currentStep, getValues, setValue, services, mergeFields]);

	return {
		schema,
		stepFields,
		control,
		register,
		handleSubmit,
		trigger,
		getValues,
		getFieldState,
		setValue,
		formState,
		currentStepFields,
		canProceed: canProceedToNextStep(),
	};
}
