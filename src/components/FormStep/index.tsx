"use client";
import type { FormStepProps } from "../../types";
import { FormElement } from "../FormElement";

export const FormStep = ({ step, journeySlug }: FormStepProps) => {

  console.log('Step', step)
  return (
    <>
      {step?.elements.map((element) => (
        <div key={element.id} style={{ ...element.layout }}>
          <FormElement
            journeySlug={journeySlug}
            element={element}
          />
        </div>
      ))}
    </>
  );
};
