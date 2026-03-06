"use client";

import type { JourneyDefinition } from "@/validation/schemaValidation/journey.schema";
import type { Control, FieldErrors, UseFormRegister } from "react-hook-form";
import { CheckboxElement } from "./Elements/CheckboxElement";
import { CpfInputElement } from "./Elements/CpfInputElement";
import { NavigationElement } from "./Elements/NavigationElement";
import { ParagraphElement } from "./Elements/ParagraphElement";
import { RadioElement } from "./Elements/RadioElement";
import { SelectElement } from "./Elements/SelectElement";
import { ServiceCallElement } from "./Elements/ServiceCallElement";
import { type FormValues, TextInputElement } from "./Elements/TextInputElement";
import { TitleElement } from "./Elements/TitleElement";

export type JourneyElement =
	JourneyDefinition["steps"][number]["elements"][number];
export type NavigationElementType = Extract<
	JourneyElement,
	{ type: "NAVIGATION" }
>;

export type ElementRenderContext = {
	register: UseFormRegister<FormValues>;
	control: Control<FormValues>;
	errors: FieldErrors<FormValues>;
	navigateToStepSlug: (stepSlug: string) => void;
	callService: (service: string, targetStepOnSuccess: string) => void;
	bussines: Record<string, unknown>;
};

export function renderJourneyElement(
	element: JourneyElement,
	ctx: ElementRenderContext,
) {
	if (element.type === "TITLE") {
		return <TitleElement element={element} />;
	}

	if (element.type === "PARAGRAPH") {
		return <ParagraphElement element={element} />;
	}

	if (element.type === "TEXT_INPUT") {
		return <TextInputElement element={element} control={ctx.control} />;
	}

	if (element.type === "CPF_INPUT") {
		return <CpfInputElement element={element} control={ctx.control} />;
	}

	if (element.type === "RADIO") {
		return (
			<RadioElement
				element={element}
				register={ctx.register}
				errors={ctx.errors}
			/>
		);
	}

	if (element.type === "SELECT") {
		return (
			<SelectElement
				element={element}
				register={ctx.register}
				errors={ctx.errors}
			/>
		);
	}

	if (element.type === "CHECKBOX") {
		return (
			<CheckboxElement
				element={element}
				register={ctx.register}
				errors={ctx.errors}
			/>
		);
	}

	if (element.type === "SERVICE_CALL") {
		return (
			<ServiceCallElement
				element={element}
				onCall={(service, targetStepOnSuccess) =>
					ctx.callService(service, targetStepOnSuccess)
				}
			/>
		);
	}

	if (element.type === "NAVIGATION") {
		return (
			<NavigationElement
				element={element}
				onNavigate={ctx.navigateToStepSlug}
				bussines={ctx.bussines}
			/>
		);
	}

	return null;
}
