import type { Control, FieldErrors, UseFormRegister } from "react-hook-form";
import type { GoNextOptions } from "../../../hooks/useJourneyNavigation";
import type { JourneyDefinition } from "../../../validation/schemaValidation/journey.schema";

type FormValues = Record<string, unknown>

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

export type ElementRenderer<T extends JourneyElement = JourneyElement> = (
  element: T,
  ctx: ElementRenderContext,
) => React.ReactNode;
