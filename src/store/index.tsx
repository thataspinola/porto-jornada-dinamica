"use client";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const stores: Record<string, any> = {};

export const createJourneyStore = (journeyId: string) => {
	if (stores[journeyId]) return stores[journeyId];

	const store = create()(
		persist(
			(set) => ({
				fields: {},
				setValue: (field: string, value: any) => {
					set((state) => ({
						fields: {
							...state.fields,
							[field]: value,
						},
					}));
				},
			}),
			{
				name: `journey-storage:${journeyId}`,
				storage: createJSONStorage(() => localStorage),
			},
		),
	);

	stores[journeyId] = store;
	return store;
};
