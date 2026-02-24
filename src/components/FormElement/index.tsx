/** biome-ignore-all lint/suspicious/noExplicitAny: <explanation> */
"use client";
import { ElementNotFound } from "@/components";
import { useState } from "react";
import { ElementRegistry } from "./elementRegistry";
import type { FormElementProps } from "./type";

export const FormElement = ({
  journeySlug,
  element,
  onStepAction,
}: FormElementProps) => {
  const [fields, setFields] = useState({});
  const [errors, setErrors] = useState({});

  const Component = ElementRegistry[element.type];
  if (!Component) return <ElementNotFound />;

  return (
    <Component
      value={fields[element.id]}
      errorMessage={errors[element.id]}
      {...element.config}
    />
  );
};
