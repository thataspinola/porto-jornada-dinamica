/** biome-ignore-all lint/suspicious/noExplicitAny: <explanation> */
"use client";
import { ElementNotFound } from "@/components";
import { createJourneyStore } from "@/store";
import { ElementRegistry } from "./elementRegistry";
import type { FormElementProps } from "./type";

export const FormElement = ({
  journeySlug,
  element,
  onStepAction,
}: FormElementProps) => {
  const useStore = createJourneyStore(journeySlug);
  const fields = useStore((state) => state.fields);
  const setValue = useStore((state) => state.setValue);

  const Component = ElementRegistry[element.type];

  if (!Component) return <ElementNotFound />;

  if (element.dependsOn) {
    const { field, value, operator } = element.dependsOn;
    const fieldValue = fields[field];

    const isVisible = operator === "===" ? fieldValue === value : false;

    if (!isVisible) return null;
  }

  // Se o elemento for um botão, vinculamos o clique à action do STEP
  const handleClick =
    element.type === "button" ? onStepAction : (value) => setValue([element.id], value);

  return (
    <Component
      value={fields[element.id]}
      onChange={(value) => setValue([element.id], value)}
      handleClick={handleClick}
      errorMessage={""}
      {...element.uiProps}
    />
  );
};
