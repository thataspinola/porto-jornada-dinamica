'use client'

import { useEffect, useState } from 'react'

const SIMULATED_TICK_INTERVAL_MS = 300
const SIMULATED_TICK_INCREMENT = 2

type SimulatedProgressConfig = {
  from: number
  to: number
  complete?: boolean
}

export function useSimulatedProgress({
  from,
  to,
  complete = false
}: SimulatedProgressConfig) {
  const [value, setValue] = useState(from)

  useEffect(() => {
    if (complete) {
      setValue(to)
      return
    }

    const tickId = setInterval(() => {
      setValue((current) => Math.min(current + SIMULATED_TICK_INCREMENT, to))
    }, SIMULATED_TICK_INTERVAL_MS)

    return () => clearInterval(tickId)
  }, [to, complete])

  return value
}
