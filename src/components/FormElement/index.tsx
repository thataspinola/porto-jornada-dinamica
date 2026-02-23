/** biome-ignore-all lint/suspicious/noExplicitAny: <explanation> */
"use client";
import { ElementNotFound } from "@/components";
import { journeyRegistryServices } from "@/services";
import { createJourneyStore } from "@/store";
import { useCallback, useEffect } from "react";
import { ElementRegistry } from "./elementRegistry";
import type { FormElementProps } from "./type";

export const FormElement = ({
  journeySlug,
  element,
  onStepAction,
}: FormElementProps) => {
  const useStore = createJourneyStore(journeySlug);
  const {
    fields,
    actionsData,
    errors,
    setValue,
    setActionResponse,
    isLoading,
    setLoading,
  } = useStore();

  const actionConfig = element.action;

  const handleActionExecution = useCallback(async () => {
    if (!actionConfig?.service) return;

    try {
      const serviceFn = journeyRegistryServices[actionConfig.service];
      if (serviceFn) {
        setLoading(true);
        const response = await serviceFn(fields);
        setActionResponse(element.id, response);
      }
    } catch (error) {
      console.error(
        `Erro na action [${actionConfig.trigger}] de ${element.id}:`,
        error,
      );
    } finally {
      setLoading(false);
    }
  }, [element.id, actionConfig, fields, setActionResponse]);

  useEffect(() => {
    if (actionConfig?.trigger === "onInit") {
      handleActionExecution();
    }
  }, [handleActionExecution, actionConfig?.trigger]);

  const Component = ElementRegistry[element.type];
  if (!Component) return <ElementNotFound />;

  if (element.dependsOn) {
    const { field, value, operator } = element.dependsOn;
    const rawValue =
      fields[field] !== undefined ? fields[field] : actionsData[field];
    const isVisible = operator === "===" ? rawValue === value : false;
    if (!isVisible) return null;
  }

  const handleChange = (val: any) => {
    setValue(element.id, val);

    if (actionConfig?.trigger === "onChange") {
      handleActionExecution();
    }
  };

  const handleClick = () => {
    if (element.type === "button" && onStepAction) {
      onStepAction();
      return;
    }

    if (actionConfig?.trigger === "onClick") {
      handleActionExecution();
    }
  };

  return (
    <Component
      value={fields[element.id]}
      onChange={handleChange}
      handleClick={handleClick}
      errorMessage={errors[element.id]}
      {...element.uiProps}
      isLoading={isLoading}
    />
  );
};
