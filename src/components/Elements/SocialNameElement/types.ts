import type { Control, FieldErrors, UseFormRegister } from "react-hook-form";
import type { JourneyDefinition } from "../../../validation/schemaValidation/journey.schema";

export type FormValues = Record<string, unknown>;

export type CheckboxElementType = Extract<
  JourneyDefinition["steps"][number]["elements"][number],
  { type: "CHECKBOX" }
>;

export type SocialNameElementProps = {
  element: CheckboxElementType;
  register: UseFormRegister<FormValues>;
  control: Control<FormValues>;
  errors: FieldErrors<FormValues>;
};
