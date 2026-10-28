'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

import { NAVIGATE_EVENT } from '@/constants'

export function useCurrentPathname() {
  const routePathname = usePathname()
  const [pathname, setPathname] = useState(routePathname ?? '/')

  useEffect(() => {
    if (routePathname) setPathname(routePathname)
  }, [routePathname])

  useEffect(() => {
    const handleSyncNavigate = () => setPathname(window.location.pathname)
    window.addEventListener('popstate', handleSyncNavigate)
    window.addEventListener(NAVIGATE_EVENT, handleSyncNavigate)
    return () => {
      window.removeEventListener('popstate', handleSyncNavigate)
      window.removeEventListener(NAVIGATE_EVENT, handleSyncNavigate)
    }
  }, [])

  return pathname
}
