"use client";

import { useJourneyController } from "@/hooks/useJourneyController";
import { redirectTo } from "@/utils";
import type { JourneyDefinition } from "@/validation/schemaValidation/journey.schema";
import { DebugFloatingButton } from "../DebugFloatingButton";
import { Header } from "../Header";
import { renderJourneyElement } from "../JourneyRenderElements";
import { ProgressBar } from "../ProgressBar";

import './styles.scss';

export function JourneyBuilder({ journey }: { journey: JourneyDefinition }) {
  const controller = useJourneyController(journey);

  return (
    <>
      <Header handleGoBack={() => redirectTo(controller.currentStep.backStepSlug)} />
      <ProgressBar
        initialValue={controller.currentStepIndex}
        value={controller.currentStepIndex + 1}
        length={journey.steps.length}
        style={{ marginBottom: '40px' }}
      />
      <main
        key={controller.currentStep.id}
        className="animate-step-container"
        style={{ width: "600px", margin: "0 auto", marginBottom: '32px' }}
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
              canProceed: controller.canProceed,
            })}
          </div>
        ))}
      </main>
      <DebugFloatingButton
        data={{
          business: controller.business,
          formValues: controller.getValues(),
          services: controller.services,
          errors: controller.storedError,
        }}
      />
    </>
  );
}
