'use client'

import type { FocusEvent, KeyboardEvent } from 'react'
import { useCallback, useRef } from 'react'

type UseClearPrefillOnInputParams = {
  enabled?: boolean
  value: string
  onReplace: (next: string) => void
}

export function useClearPrefillOnInput({
  enabled,
  value,
  onReplace
}: UseClearPrefillOnInputParams) {
  const initialValueRef = useRef<string | undefined>(undefined)
  const clearedPrefillRef = useRef(false)

  if (initialValueRef.current === undefined && value) {
    initialValueRef.current = value
  }

  const shouldReplace =
    enabled &&
    !clearedPrefillRef.current &&
    initialValueRef.current &&
    value === initialValueRef.current

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.ctrlKey || event.metaKey) {
        return
      }

      if (
        !shouldReplace ||
        (event.key !== 'Backspace' &&
          event.key !== 'Delete' &&
          event.key.length !== 1)
      ) {
        return
      }

      event.preventDefault()
      clearedPrefillRef.current = true
      onReplace(event.key.length === 1 ? event.key : '')
    },
    [onReplace, shouldReplace]
  )

  const handleFocus = useCallback(
    (event: FocusEvent<HTMLInputElement>) => {
      if (!shouldReplace) {
        return
      }

      event.currentTarget.select()
    },
    [shouldReplace]
  )

  const markChanged = useCallback((nextValue: string) => {
    if (nextValue !== initialValueRef.current) {
      clearedPrefillRef.current = true
    }
  }, [])

  return { handleKeyDown, handleFocus, markChanged }
}
