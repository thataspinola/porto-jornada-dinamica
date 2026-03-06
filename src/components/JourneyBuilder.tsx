"use client";

import { callService } from "@/services/serviceRegistry";
import { redirectTo } from "@/utils";
import type { JourneyDefinition } from "@/validation/schemaValidation/journey.schema";
import { buildJourneyFormSchema } from "@/validation/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useJourneyFormStore } from "../store/journeyFormStore";
import { DebugCode } from "./DebugCode";
import { Header } from "./Elements/Header";
import { ProgressBar } from "./Elements/ProgressBar";
import type { FormValues } from "./Elements/TextInputElement";
import {
	type NavigationElementType,
	renderJourneyElement,
} from "./elementRegistry";

type JourneyBuilderProps = {
	journey: JourneyDefinition;
};

type SubmittedPayload = {
	fields: FormValues;
	error: Record<string, unknown>;
	bussines: Record<string, unknown>;
	services: Record<string, unknown>;
};

export function JourneyBuilder({ journey }: JourneyBuilderProps) {
	const steps = journey.steps;
	const { schema, stepFields } = useMemo(
		() => buildJourneyFormSchema(journey),
		[journey],
	);
	const {
		control,
		register,
		handleSubmit,
		trigger,
		getValues,
		getFieldState,
		formState: { errors },
	} = useForm<FormValues>({
		resolver: zodResolver(schema),
		defaultValues: useRef(useJourneyFormStore.getState().fields).current,
		mode: "onSubmit",
	});
	const [submitted, setSubmitted] = useState<SubmittedPayload | null>(null);
	const stepCount = steps.length;
	const stepSlug = useJourneyFormStore((s) => s.stepSlug);
	const setStepSlug = useJourneyFormStore((s) => s.setStepSlug);
	const setFields = useJourneyFormStore((s) => s.setFields);
	const setError = useJourneyFormStore((s) => s.setError);
	const mergeBussines = useJourneyFormStore((s) => s.mergeBussines);
	const mergeServices = useJourneyFormStore((s) => s.mergeServices);
	const bussines = useJourneyFormStore((s) => s.bussines);
	const storedError = useJourneyFormStore((s) => s.error);
	const services = useJourneyFormStore((s) => s.services);

	const stepSlugToIndex = useMemo(() => {
		const map = new Map<string, number>();
		for (let i = 0; i < steps.length; i += 1) {
			map.set(steps[i].slug, i);
		}
		return map;
	}, [steps]);

	const currentStep =
		stepSlug && stepSlugToIndex.has(stepSlug)
			? steps[stepSlugToIndex.get(stepSlug) as number]
			: steps[0];

	const currentStepIndex = stepSlugToIndex.get(currentStep.slug) ?? 0;
	const sortedElements = currentStep ? currentStep.elements : [];

	const navigationElements = sortedElements.filter(
		(e): e is NavigationElementType => e.type === "NAVIGATION",
	);

	function goToStepSlug(stepSlug: string) {
		setStepSlug(stepSlug);
	}

	useEffect(() => {
		if (stepCount === 0) return;
		if (!stepSlug || !stepSlugToIndex.has(stepSlug)) {
			setStepSlug(steps[0].slug);
		}
	}, [stepCount, stepSlug, stepSlugToIndex, steps, setStepSlug]);

	useEffect(() => {
		mergeBussines({
			journeyId: journey.id,
			journeySlug: journey.slug,
			stepSlug: currentStep?.slug ?? "",
		});
	}, [journey.id, journey.slug, currentStep?.slug, mergeBussines]);

	async function navigateToStepSlug(stepSlug: string) {
		if (!currentStep) return;
		if (!stepSlug) {
			await goNext();
			return;
		}

		const fields = stepFields[currentStep.id] ?? [];
		const ok = fields.length === 0 ? true : await trigger(fields);
		if (!ok) {
			const fieldErrors: Record<string, string> = {};
			for (const field of fields) {
				const message = getFieldState(field).error?.message;
				if (typeof message === "string" && message.length > 0) {
					fieldErrors[field] = message;
				}
			}
			setError(fieldErrors);
			return;
		}

		setError({});
		setFields(getValues());
		goToStepSlug(stepSlug);
		redirectTo(stepSlug, bussines);
	}

	async function callServiceAndNavigate(
		serviceName: string,
		targetStepOnSuccess: string,
	) {
		if (!currentStep) return;

		const fields = stepFields[currentStep.id] ?? [];
		const ok = fields.length === 0 ? true : await trigger(fields);
		if (!ok) {
			const fieldErrors: Record<string, string> = {};
			for (const field of fields) {
				const message = getFieldState(field).error?.message;
				if (typeof message === "string" && message.length > 0) {
					fieldErrors[field] = message;
				}
			}
			setError(fieldErrors);
			return;
		}

		const input = getValues();
		setError({});
		setFields(input);

		const result = await callService(serviceName, {
			fieds: input,
			bussines,
		});

		mergeServices({ [serviceName]: result });

		if (!result.success) {
			setError({ service: result.error });
			return;
		}

		goToStepSlug(targetStepOnSuccess);
		redirectTo(targetStepOnSuccess, bussines);
	}

	async function goNext() {
		if (!currentStep) return;
		const fields = stepFields[currentStep.id] ?? [];
		const ok = fields.length === 0 ? true : await trigger(fields);
		if (!ok) {
			const fieldErrors: Record<string, string> = {};
			for (const field of fields) {
				const message = getFieldState(field).error?.message;
				if (typeof message === "string" && message.length > 0) {
					fieldErrors[field] = message;
				}
			}
			setError(fieldErrors);
			return;
		}

		setError({});
		setFields(getValues());

		const nextStep = steps[currentStepIndex + 1];
		if (nextStep) {
			setStepSlug(nextStep.slug);
			redirectTo(nextStep.slug, bussines);
			return;
		}

		handleSubmit((values) => {
			setFields(values);
			setError({});
			setSubmitted({ fields: values, error: {}, bussines, services });
		})();
	}

	function goPrev() {
		if (!currentStep) return;
		const backStepSlug = currentStep.backStepSlug?.trim() ?? "";
		if (!backStepSlug) return;
		setFields(getValues());
		if (backStepSlug === "/") {
			setStepSlug(steps[0].slug ?? "");
			redirectTo("/", bussines);
			return;
		}
		goToStepSlug(backStepSlug);
		redirectTo(backStepSlug, bussines);
	}

	if (!currentStep) {
		return <div>Jornada sem steps.</div>;
	}

	if (submitted) {
		return (
			<div>
				<h2>Resultado</h2>
				<pre>{JSON.stringify(submitted, null, 2)}</pre>
				<button type="button" onClick={() => setSubmitted(null)}>
					Voltar
				</button>
			</div>
		);
	}

	return (
		<div>
			<Header goBackLink={currentStep?.backStepSlug} />
			<ProgressBar
				initialValue={currentStep?.progress.initialValue}
				value={currentStep?.progress.value}
				style={{ marginBottom: "40px" }}
			/>
			<div style={{ maxWidth: "600px", margin: "0 auto" }}>
				<form
					onSubmit={(event) => {
						event.preventDefault();
						goNext();
					}}
				>
					{sortedElements.map((element) => (
						<div key={element.id}>
							{renderJourneyElement(element, {
								register,
								control,
								errors,
								navigateToStepSlug,
								callService: callServiceAndNavigate,
								bussines,
							})}
						</div>
					))}
					{navigationElements.length === 0 ? (
						<div>
							<button
								type="button"
								onClick={goPrev}
								disabled={!currentStep.backStepSlug}
							>
								Anterior
							</button>
							<button type="button" onClick={goNext}>
								{currentStepIndex === stepCount - 1 ? "Enviar" : "Próximo"}
							</button>
						</div>
					) : null}
				</form>
				<DebugCode
					fieds={getValues()}
					error={storedError}
					bussines={bussines}
					services={services}
				/>
			</div>
		</div>
	);
}
