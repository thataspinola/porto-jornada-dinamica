'use client'

import { useEffect } from 'react'
import { useShallow } from 'zustand/shallow'

import { useNavigationStore } from '@/store/navigationStore'

type UseNavigationLockParams = {
  isLocked: boolean
}

export function useNavigationLock({ isLocked }: UseNavigationLockParams) {
  const { disableNavigation, enableNavigation } = useNavigationStore(
    useShallow((store) => ({
      disableNavigation: store.disableNavigation,
      enableNavigation: store.enableNavigation,
    }))
  )

  useEffect(() => {
    if (isLocked) {
      disableNavigation()
      return
    }

    enableNavigation()
  }, [isLocked, disableNavigation, enableNavigation])
}
