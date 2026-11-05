import { useEffect, useRef, useState } from 'react'

export function usePanelHeight() {
  const panelRef = useRef<HTMLDivElement>(null)
  const [panelHeight, setPanelHeight] = useState(0)

  useEffect(() => {
    const el = panelRef.current
    if (!el) return

    const updateHeight = () => {
      setPanelHeight(Math.ceil(el.getBoundingClientRect().height))
    }

    updateHeight()

    const resizeObserver = new ResizeObserver(updateHeight)
    resizeObserver.observe(el)

    return () => {
      resizeObserver.disconnect()
    }
  }, [])

  return { panelRef, panelHeight }
}
