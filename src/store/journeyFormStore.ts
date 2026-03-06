import { create } from "zustand";

export type JourneyFormFields = Record<string, unknown>;
export type JourneyFormError = Record<string, unknown>;
export type JourneyFormBussines = Record<string, unknown>;
export type JourneyFormServices = Record<string, unknown>;

type JourneyFormStore = {
	stepSlug: string;
	fields: JourneyFormFields;
	error: JourneyFormError;
	bussines: JourneyFormBussines;
	services: JourneyFormServices;
	setStepSlug: (stepSlug: string) => void;
	setFields: (fields: JourneyFormFields) => void;
	mergeFields: (partial: JourneyFormFields) => void;
	setError: (error: JourneyFormError) => void;
	mergeBussines: (partial: JourneyFormBussines) => void;
	mergeServices: (partial: JourneyFormServices) => void;
	reset: () => void;
};

export const useJourneyFormStore = create<JourneyFormStore>((set) => ({
	stepSlug: "",
	fields: {},
	error: {},
	bussines: {},
	services: {},
	setStepSlug: (stepSlug) => set({ stepSlug }),
	setFields: (fields) => set({ fields }),
	mergeFields: (partial) =>
		set((state) => ({ fields: { ...state.fields, ...partial } })),
	setError: (error) => set({ error }),
	mergeBussines: (partial) =>
		set((state) => ({ bussines: { ...state.bussines, ...partial } })),
	mergeServices: (partial) =>
		set((state) => ({ services: { ...state.services, ...partial } })),
	reset: () =>
		set({ stepSlug: "", fields: {}, error: {}, bussines: {}, services: {} }),
}));
