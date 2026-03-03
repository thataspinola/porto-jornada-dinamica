"use client";
import { ElementNotFound } from "@/components";
import { createJourneyStore } from "@/store";
import { ElementRegistry } from "./elementRegistry";
import type { FormElementProps } from "./type";

export const FormElement = ({ slug, element }: FormElementProps) => {
  const useJourneyStore = createJourneyStore(slug);
  const fields = useJourneyStore((state) => state.fields);
  const setValue = useJourneyStore((state) => state.setValue);

  const Component = ElementRegistry[element.type];
  if (!Component) return <ElementNotFound />;

  function handleSelectValueByClick(value: string, type: string) {
    if (type === 'CPF_INPUT') return;
    if (type === 'TEXT_INPUT') return;

    setValue(element.config.name, value)
  }
  return (
    <Component
      value={fields[element.config.name] || ""}
      onChange={(value) => setValue(element.config.name, value)}
      onClick={(value) => handleSelectValueByClick(value, element.type)}
      errorMessage=""
      {...element.config}
    />
  );
};
