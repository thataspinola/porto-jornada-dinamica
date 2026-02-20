"use client";
import { useJourneyActions, useJourneyValidation } from "@/hooks";
import type { FormStepProps } from "../../types";
import { FormElement } from "../FormElement";

export const FormStep = ({ step, journeySlug }: FormStepProps) => {
  const { executeStepAction } = useJourneyActions(journeySlug, step);
  const { validateStep } = useJourneyValidation(journeySlug, step.elements);

  const handleTriggerAction = async () => {
    const isValid = validateStep();
    console.log('isValid:', isValid);

    if (isValid) {
      await executeStepAction();
    }
  };

  return (
    <>
      {step?.elements.map((element) => (
        <div key={element.id} style={{ ...element.layout }}>
          <FormElement
            journeySlug={journeySlug}
            element={element}
            onStepAction={handleTriggerAction}
          />
        </div>
      ))}
    </>
  );
};

