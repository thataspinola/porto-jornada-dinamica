
'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'

const EXTERNAL_URL_REGEX = /^https?:\/\//i
const HOME_ROUTE = '/'
const EXTERNAL_BACK_PARAM = 'backUrl'
const BACK_ORIGIN_PARAM = 'backOrigin'

type NavigateOptions = {
  removeSearchParams?: string[]
}

function isExternalUrl(destination: string) {
  return EXTERNAL_URL_REGEX.test(destination)
}

function resolveInternalPath(destination: string, pathname: string) {
  if (destination === HOME_ROUTE) {
    return HOME_ROUTE
  }

  const normalizedPath = destination.replace(/^\/+/, '')

  const isAbsolutePath = normalizedPath.includes('/')
  if (isAbsolutePath) {
    return `/${normalizedPath}`
  }

  const currentSegments = pathname.split('/').filter(Boolean)
  const journeyBasePath =
    currentSegments.length >= 2
      ? `/${currentSegments[0]}/${currentSegments[1]}`
      : `/${currentSegments[0] ?? ''}`

  return `${journeyBasePath}/${normalizedPath}`
}

function buildQueryWithOrigin(
  currentQuery: string,
  pathname: string,
  removeSearchParams: string[] = []
) {
  const params = new URLSearchParams(currentQuery)

  for (const key of removeSearchParams) params.delete(key)

  if (params.has(EXTERNAL_BACK_PARAM) && !params.has(BACK_ORIGIN_PARAM)) {
    params.set(BACK_ORIGIN_PARAM, pathname)
  }

  return params.toString()
}

function appendQuery(path: string, queryString: string) {
  return queryString ? `${path}?${queryString}` : path
}

function isBackOrigin(backOrigin: string | null, pathname: string) {
  return !backOrigin || backOrigin === pathname
}

export function useJourneyNavigation() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const navigateTo = useCallback(
    (destination: string, options: NavigateOptions = {}) => {
      if (destination.startsWith('?')) {
        const params = new URLSearchParams(searchParams.toString())
        const destinationParams = new URLSearchParams(destination)

        destinationParams.forEach((value: string, key: string) => {
          params.set(key, value)
        })

        for (const key of options.removeSearchParams ?? []) {
          params.delete(key)
        }

        router.push(`${pathname}?${params.toString()}`)
        return
      }

      if (isExternalUrl(destination)) {
        window.location.assign(destination)
        return
      }

      const queryString = buildQueryWithOrigin(
        searchParams.toString(),
        pathname,
        options.removeSearchParams
      )

      const targetPath = resolveInternalPath(destination, pathname)
      router.push(appendQuery(targetPath, queryString))
    },
    [router, pathname, searchParams]
  )

  const goBack = useCallback(
    (backSlug?: string | null) => {
      const externalBackUrl = searchParams.get(EXTERNAL_BACK_PARAM)
      const backOrigin = searchParams.get(BACK_ORIGIN_PARAM)

      if (externalBackUrl && isBackOrigin(backOrigin, pathname)) {
        navigateTo(externalBackUrl)
        return
      }

      if (!backSlug) return

      navigateTo(backSlug)
    },
    [navigateTo, searchParams, pathname]
  )

  return { navigateTo, goBack }
}
