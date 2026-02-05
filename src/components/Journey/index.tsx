'use client'
import { useEffect } from "react";
import { useJourneyStore } from "../../context/clientStore";
import type { JourneyProps } from "../../types";
import { FormStep } from "../FormStep";

export const Journey = ({ config, initialData, slug }: JourneyProps) => {
  const journey = config.slug;
  const hydrate = useJourneyStore((state) => state.hydrate);
  const setValue = useJourneyStore((state) => state.setValue);
  const setMany = useJourneyStore((state) => state.setMany);
  const data = useJourneyStore((state) => state.data[journey] || {});
  const step = config.steps.find((step) => step.slug === slug);
  const onChange = (id: string, value: any) => setValue(journey, id, value);

  function loadInitialData() {
    if (!initialData) return;
    if (!Object.keys(initialData).length) return;

    setMany(journey, initialData);
  }

  if (!step) return null;

  useEffect(() => {
    hydrate(journey);
  }, [journey, hydrate]);

  useEffect(() => {
    loadInitialData();
  }, [journey, initialData, setMany]);

  return (
    <FormStep config={config} data={data} step={step} onChange={onChange} />
  );
};
