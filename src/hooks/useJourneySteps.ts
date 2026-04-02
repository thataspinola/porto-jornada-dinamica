/** biome-ignore-all lint/correctness/useExhaustiveDependencies: <> */
import { useEffect } from "react";
import { useJourneyStore } from "../store";
import type { JourneyDefinition } from "../validation/schemaValidation/journey.schema";
import { useCurrentPathname } from "./useCurrentPathname";

type JourneyStep = JourneyDefinition["steps"][number];
type JourneyElement = JourneyDefinition["steps"][number]["elements"][number];

export function useJourneySteps(journey: JourneyDefinition) {
	const steps = journey.steps; // Pega os steps da jornada
	const stepCount = steps.length; // Conta quantos steps existem na jornada

	const { mergeBusiness } = useJourneyStore(); // Pega a função mergeBusiness do store para atualizar os dados de negócio

	const pathname = useCurrentPathname(); // Pega o pathname atual usando o hook useCurrentPathname

	const stepSlugToIndex = new Map(steps.map((step, i) => [step.slug, i])); // Cria um objeto que mapeia o slug de cada step para seu índice correspondente ex:

	const lastPathname = pathname.split("/").filter(Boolean).at(-1) || ""; // filter(Boolean) remove itens vazios

	const currentStep: JourneyStep =
		steps[stepSlugToIndex.get(lastPathname) || 0]; // Determina o step atual com base no pathname, ou define como null se não encontrar

	const currentStepIndex = currentStep
		? (stepSlugToIndex.get(currentStep.slug) ?? 0)
		: 0; // Determina qual é o index do step atual

	const elements: JourneyElement[] = currentStep?.elements || []; // Pega os elementos do step atual, ou um array vazio se não houver

	const navigationElements = elements.filter(
		(element) => element.type === "NAVIGATION",
	); // Filtra os elementos para pegar apenas os do tipo 'NAVIGATION'

	function syncBusiness() {
		mergeBusiness({
			journeyId: journey.id,
			journeySlug: journey.slug,
			stepSlug: currentStep?.slug || null,
		}); // Atualiza os dados de negócio usando a função mergeBusiness do store
	}

	useEffect(() => {
		syncBusiness(); // Sincroniza os dados de negócio sempre que o currentStep mudar
	}, [journey.id, journey.slug, currentStep?.slug, mergeBusiness]);

	return {
		steps,
		currentStep,
		stepCount,
		stepSlugToIndex,
		currentStepIndex,
		elements,
		navigationElements,
	}; // Retorna o step atual e os elementos de navegação
}
