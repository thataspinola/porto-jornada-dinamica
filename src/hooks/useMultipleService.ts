'use client'

import { useCallback, useRef, useState } from 'react'

export function useMultipleService() {
  const activeIndexRef = useRef(0)
  const [activeIndex, setActiveIndex] = useState(0)

  const reset = useCallback(() => {
    activeIndexRef.current = 0
    setActiveIndex(0)
  }, [])

  const callMultiple = useCallback(
    async <T>(
      items: readonly T[],
      execute: (item: T, index: number) => Promise<void>
    ) => {
      for (const [index, item] of items.entries()) {
        activeIndexRef.current = index
        setActiveIndex(index)
        await execute(item, index)
      }
    },
    []
  )

  return { activeIndex, activeIndexRef, reset, callMultiple }
}
