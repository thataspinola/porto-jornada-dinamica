import { create } from 'zustand'

type NavigationState = {
  isNavigationVisible: boolean
  isNavigationDisabled: boolean
  hideNavigation: () => void
  showNavigation: () => void
  disableNavigation: () => void
  enableNavigation: () => void
}

export const useNavigationStore = create<NavigationState>()((set) => ({
  isNavigationVisible: true,
  isNavigationDisabled: false,
  hideNavigation: () => set({ isNavigationVisible: false }),
  showNavigation: () => set({ isNavigation: true }),
  disableNavigation: () => set({ isNavigationDisabled: true }),
  enableNavigation: () => set({ isNavigationDisabled: false }),
}))
