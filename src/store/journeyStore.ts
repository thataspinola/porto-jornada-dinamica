import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import type { ServiceErrorsConfig } from '@/validation/schemas'

// biome-ignore lint/suspicious/noExplicitAny: preserva o contrato de dados dinâmicos definido pelos schemas das jornadas e serviços
type JourneyData = Record<string, any>

type JourneyState = {
  fields: JourneyData
  error: JourneyData
  business: JourneyData
  services: JourneyData
  parameters: JourneyData
  errors: ServiceErrorsConfig
  _hasHydrated: boolean
  setHasHydrated: (value: boolean) => void
  mergeFields: (partial: JourneyData) => void
  setError: (error: JourneyData) => void
  mergeBusiness: (partial: JourneyData) => void
  mergeServices: (partial: JourneyData) => void
  mergeParameters: (partial: JourneyData) => void
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
