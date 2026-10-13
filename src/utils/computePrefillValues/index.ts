/**
 * Percorre os elementos da etapa atual para descobrir quais campos podem ser
 * pré-preenchidos automaticamente com dados externos.
 */
import type { JourneyDefinition } from "@/validation/schemaValidation";

import { resolveDefaultValue } from "@/utils/resolveDefaultValue";

type FormValues = Record<string, unknown>;
type JourneyStep = JourneyDefinition["steps"][number];
type JourneyElement = JourneyStep["elements"][number];

export function computePrefillValues(
	elements: JourneyElement[],
	currentValues: FormValues,
	services: Record<string, unknown>,
): Record<string, string> {
	const prefill: Record<string, string> = {};

	for (const element of elements) {
		// Apenas campos de texto ou CPF suportam pre-fill neste caso
		// if (element.type !== "TEXT_INPUT" && element.type !== "CPF_INPUT") continue;

		const cfg = element.config as Record<string, unknown>;
		const name = cfg.name as string;

		const isFieldFilled =
			currentValues[name] != null && currentValues[name] !== "";

		// Se o campo já estiver preenchido pelo usuário, não sobrescrevemos
		if (!name || isFieldFilled) continue;

		const defaultValue = resolveDefaultValue(cfg, services);
		if (defaultValue) prefill[name] = defaultValue;
	}

	return prefill;
}
