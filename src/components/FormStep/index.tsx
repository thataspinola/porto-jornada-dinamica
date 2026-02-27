"use client";
import type { FormStepProps } from "../../types";
import { FormElement } from "../FormElement";

export const FormStep = ({ slug, step }: FormStepProps) => (
  <>
    {step?.elements.map((element) => (
      <FormElement key={element.id} element={element} slug={slug} />
    ))}
  </>
);
