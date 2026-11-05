'use client'

import { useState } from 'react'

export function useLocalTabs() {
  const [activeIndex, setActiveIndex] = useState(0)

  function select(index: number) {
    setActiveIndex(index)
  }

  return { activeIndex, select }
}
