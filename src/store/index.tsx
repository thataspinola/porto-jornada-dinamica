'use client'
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const stores: Record<string, any> = {};

export const createJourneyStore = (journeyId: string) => {
  if (stores[journeyId]) return stores[journeyId];

  const store = create()(
    persist(
      (set) => ({
        fields: {},
        errors: {},
        setValue: (field: string, value: any) => {
          set((state) => ({
            fields: {
              ...state.fields,
              [field]: value,
            },
            errors: {
              ...state.errors,
              [field]: null,
            },
          }));
        },

        setError: (field: string, message: string | null) => {
          set((state) => ({
            errors: {
              ...state.errors,
              [field]: message,
            },
          }));
        },

        clearErrors: () => set({ errors: {} }),

        reset: () => set({ fields: {}, errors: {} }),
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
