"use client";

import type { GoNextOptions } from "@/hooks/useJourneyNavigation";
import type { JourneyDefinition } from "@/validation/schemaValidation/journey.schema";
import type { Control, FieldErrors, UseFormRegister } from "react-hook-form";
import { CheckboxElement } from "../../Elements/CheckboxElement";
import { CpfInputElement } from "../../Elements/CpfInputElement";
import { NavigationElement } from "../../Elements/NavigationElement";
import { ParagraphElement } from "../../Elements/ParagraphElement";
import { RadioElement } from "../../Elements/RadioElement";
import { SelectElement } from "../../Elements/SelectElement";
import { ServiceCallElement } from "../../Elements/ServiceCallElement";
import {
	type FormValues,
	TextInputElement,
} from "../../Elements/TextInputElement";
import { TitleElement } from "../../Elements/TitleElement";

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
	goNext: (options: GoNextOptions) => Promise<void>;
	business: Record<string, unknown>;
	canProceed: boolean;
};

type ElementRenderer<T extends JourneyElement = JourneyElement> = (
	element: T,
	ctx: ElementRenderContext,
) => React.ReactNode;

const renderers: {
	[K in JourneyElement["type"]]: ElementRenderer<
		Extract<JourneyElement, { type: K }>
	>;
} = {
	TITLE: (element) => <TitleElement element={element} />,
	PARAGRAPH: (element) => <ParagraphElement element={element} />,
	TEXT_INPUT: (element, ctx) => (
		<TextInputElement element={element} control={ctx.control} />
	),
	PHONE_INPUT: (element, ctx) => (
		<TextInputElement element={element} control={ctx.control} />
	),
	CPF_INPUT: (element, ctx) => (
		<CpfInputElement element={element} control={ctx.control} />
	),
	RADIO: (element, ctx) => (
		<RadioElement
			element={element}
			register={ctx.register}
			errors={ctx.errors}
		/>
	),
	SELECT: (element, ctx) => (
		<SelectElement
			element={element}
			register={ctx.register}
			errors={ctx.errors}
		/>
	),
	CHECKBOX: (element, ctx) => (
		<CheckboxElement
			element={element}
			register={ctx.register}
			errors={ctx.errors}
		/>
	),
	SERVICE_CALL: (element, ctx) => (
		<ServiceCallElement
			element={element}
			canProceed={ctx.canProceed}
			onCall={(serviceName, targetSlug) =>
				ctx.goNext({ type: "service", serviceName, targetSlug })
			}
		/>
	),
	NAVIGATION: (element, ctx) => (
		<NavigationElement
			element={element}
			onNavigate={(targetSlug) =>
				ctx.goNext({ type: "navigation", targetSlug })
			}
			business={ctx.business}
			canProceed={ctx.canProceed}
		/>
	),
};

export function renderJourneyElement(
	element: JourneyElement,
	ctx: ElementRenderContext,
) {
	const renderer = renderers[element.type] as ElementRenderer;
	return renderer(element, ctx) ?? null;
}
