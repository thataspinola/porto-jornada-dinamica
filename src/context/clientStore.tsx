import { create } from "zustand";

type State = { data: Record<string, Record<string, unknown>> }
type Actions = {
  hydrate: (journey: string) => void;
  setValue: (journey: string, field: string, value: unknown) => void;
  setMany: (journey: string, obj: Record<string, unknown>) => void;
  clear: (journey: string) => void;
}

export const useJourneyStore = create<State & Actions>((set, get) => ({
  data: {},
  hydrate: (journey: string) => {
    try {
      const raw = localStorage.getItem(`journey:${journey}:data`);
      const json = raw ? JSON.parse(raw) : {};
      set({ data: { ...get().data, [journey]: json } })
    } catch {
      console.error(`Error hydrating journey ${journey}`);
    }
  },
  setValue: (journey: string, field: string, value: unknown) => {
    try {
      const oldJourneyData = get().data[journey] || {};
      const currentJourneyData = { ...oldJourneyData, [journey]: value };
      set({ data: { ...get().data, [journey]: currentJourneyData } });
      localStorage.setItem(`jorney:${journey}:data`, JSON.stringify(currentJourneyData));
    } catch {
      console.error(`Error setting value for field ${field} in journey ${journey}`);

    }
  },
  setMany(journey: string, obj: Record<string, unknown>) {
    try {
      const oldJourneyData = get().data[journey] || {};
      const currentJourneyData = { ...oldJourneyData, [journey]: obj };
      set({ data: { ...get().data, [journey]: currentJourneyData } });
      localStorage.setItem(`Jorney:${journey}:data`, JSON.stringify(currentJourneyData));
    } catch {
      console.error(`Error setting values for jorney ${journey}`);
    }
  },
  clear(journey: string) {
    try {
      const journeis = { ...get().data }
      delete journeis[journey];
      set({ data: journeis });
      localStorage.removeItem(`journey:${journey}:data`);
    } catch {
      console.error(`Error clearing journey ${journey}`);
    }
  },
}))
