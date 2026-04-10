"use client";

import { journeyStore } from "./journeyStore";

export function useJourneyStore() {
  const fields = journeyStore(({ fields }) => fields);
  const mergeFields = journeyStore(({ mergeFields }) => mergeFields);
  const error = journeyStore(({ error }) => error);
  const setError = journeyStore(({ setError }) => setError);
  const business = journeyStore(({ business }) => business);
  const mergeBusiness = journeyStore(({ mergeBusiness }) => mergeBusiness);
  const services = journeyStore(({ services }) => services);
  const mergeServices = journeyStore(({ mergeServices }) => mergeServices);
  const reset = journeyStore(({ reset }) => reset);
  const hasHydrated = journeyStore(({ _hasHydrated }) => _hasHydrated);

  return {
    fields,
    mergeFields,
    error,
    setError,
    business,
    mergeBusiness,
    services,
    mergeServices,
    reset,
    hasHydrated
  };
}
