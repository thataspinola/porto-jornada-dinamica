/** biome-ignore-all lint/suspicious/noExplicitAny: <explanation> */
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

  return (
    <Component
      value={fields[element.config.name]}
      onChange={value => setValue(element.config.name, value)}
      onClick={value => setValue(element.config.name, value)}
      errorMessage=''
      {...element.config}
    />
  );
};
