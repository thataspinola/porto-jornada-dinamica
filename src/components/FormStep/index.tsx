"use client";
import type { FormStepProps } from "../../types";
import { FormElement } from "../FormElement";

export const FormStep = ({ step }: FormStepProps) => {

  return (
    <>
      {step?.elements.map((element) => (
        <div key={element.id} style={{ ...element.layout }}>
          <FormElement
            element={element}
            action={step.action}
          />
        </div>
      ))}
    </>
  );
};
