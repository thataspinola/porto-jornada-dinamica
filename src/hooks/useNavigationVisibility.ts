'use client'

import { useEffect } from 'react'
import { useShallow } from 'zustand/shallow'

import { useNavigationStore } from '@/store/navigationStore'

type UseNavigationVisibilityParams = {
  isHidden: boolean
}

export function useNavigationVisibility({
  isHidden
}: UseNavigationVisibilityParams) {
  const { hideNavigation, showNavigation } = useNavigationStore(
    useShallow((store) => ({
      hideNavigation: store.hideNavigation,
      showNavigation: store.showNavigation
    }))
  )

  useEffect(() => {
    if (isHidden) {
      hideNavigation()
      return
    }

    showNavigation()
  }, [isHidden, hideNavigation, showNavigation])
}
