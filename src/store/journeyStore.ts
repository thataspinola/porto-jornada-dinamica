/** biome-ignore-all lint/suspicious/noExplicitAny: </> */
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import type { ServiceErrorsConfig } from '@/validation/schemas'

type JourneyState = {
  fields: Record<string, any>
  error: Record<string, any>
  business: Record<string, any>
  services: Record<string, any>
  parameters: Record<string, any>
  errors: ServiceErrorsConfig
  _hasHydrated: boolean
  setHasHydrated: (value: boolean) => void
  mergeFields: (partial: Record<string, any>) => void
  setError: (error: Record<string, any>) => void
  mergeBusiness: (partial: Record<string, any>) => void
  mergeServices: (partial: Record<string, any>) => void
  mergeParameters: (partial: Record<string, any>) => void
  setErrors: (errors: ServiceErrorsConfig) => void
  reset: () => void
}

export const useJourneyStore = create<JourneyState>()(
  persist(
    (set) => ({
      fields: {},
      error: {},
      business: {},
      services: {},
      parameters: {},
      errors: [],
      _hasHydrated: false,
      setHasHydrated: (value) => set({ _hasHydrated: value }),
      mergeFields: (partial) =>
        set((state) => ({ fields: { ...state.fields, ...partial } })),
      setError: (error) => set({ error }),
      mergeBusiness: (partial) =>
        set((state) => ({ business: { ...state.business, ...partial } })),
      mergeServices: (partial) =>
        set((state) => ({ services: { ...state.services, ...partial } })),
      mergeParameters: (partial) =>
        set((state) => ({
          parameters: { ...state.parameters, ...partial }
        })),
      setErrors: (errors) => set({ errors }),
      reset: () =>
        set({
          fields: {},
          error: {},
          business: {},
          services: {},
          parameters: {},
          errors: []
        })
    }),
    {
      name: 'journey-storage',
      storage: createJSONStorage(() => window.sessionStorage),
      partialize: (state) => ({
        fields: state.fields,
        error: state.error,
        business: state.business,
        services: state.services
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true)
      }
    }
  )
)
