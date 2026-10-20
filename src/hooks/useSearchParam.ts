'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'

type SetSearchParam = (value: string | undefined | null) => void

export function useSearchParam<T = string>(
  key: string,
  parser?: (value: string) => T
): [value: T | undefined, setValue: SetSearchParam] {
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()
  const searchParam = searchParams.get(key)

  const value = searchParam
    ? (parser?.(searchParam) ?? (searchParam as T))
    : undefined

  const setValue = (nextValue: string | undefined | null) => {
    const params = new URLSearchParams(searchParams.toString())

    if (nextValue === undefined || nextValue === null) {
      params.delete(key)
    } else {
      params.set(key, nextValue)
    }

    const query = params.toString()
    router.replace(query ? `${pathname}?${query}` : pathname)
  }

  return [value, setValue]
}
