"use client";

import { useJourneyController } from "@/hooks/useJourneyController";
import { redirectTo } from "@/utils";
import type { JourneyDefinition } from "@/validation/schemas";
import { DebugFloatingButton } from "@/components/Core/DebugFloatingButton";
import { Header } from "@/components/Core/Header";
import { renderJourneyElement } from "@/components/Core/JourneyRenderElements";
import { ProgressBar } from "@/components/Core/ProgressBar";

import "./JourneyBuilder.scss";

export function JourneyBuilder({ journey }: { journey: JourneyDefinition }) {
	const controller = useJourneyController(journey);

	if (!controller.currentStep) return <p role="alert">Etapa não encontrada.</p>;
	return (
		<>
			<Header
				handleGoBack={() => redirectTo(controller.currentStep.backStepSlug)}
			/>
			<ProgressBar
				initialValue={controller.currentStepIndex}
				value={controller.currentStepIndex + 1}
				length={journey.steps.length}
				style={{ marginBottom: "40px" }}
			/>
			{controller.storedErrorEntries.length > 0 && (
				<div role="alert">
					{controller.storedErrorEntries.map(([key, message]) => (
						<p key={key}>{String(message)}</p>
					))}
				</div>
			)}
			<main
				key={controller.currentStep.id}
				className="animate-step-container"
				style={{ width: "600px", margin: "0 auto", marginBottom: "32px" }}
			>
				{controller.sortedElements.map((element, index) => (
					<div
						className={`animate-item animate-item--delay-${index + 2}`}
						key={element.id}
					>
						{renderJourneyElement(element, {
							register: controller.register,
							control: controller.control,
							errors: controller.formState.errors,
							goNext: controller.goNext,
							business: controller.business,
							fields: controller.fields,
							services: controller.services,
							journeySlug: journey.slug,
							canProceed: controller.canProceed,
						})}
					</div>
				))}
			</main>
			{process.env.NODE_ENV === "development" && (
				<DebugFloatingButton
					data={{
						business: controller.business,
						formValues: controller.getValues(),
						services: controller.services,
						errors: controller.storedError,
					}}
				/>
			)}
		</>
	);
}
