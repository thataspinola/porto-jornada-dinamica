'use client'

import { useFormContext, useWatch } from 'react-hook-form'

import type { TabItems } from '../types'

export function useFormTabs(name: string | undefined, items: TabItems) {
  const { setValue } = useFormContext()

  const value = useWatch({ name: name ?? '__tabs__' })

  const activeIndex = Math.max(
    0,
    items.findIndex((item) => item.value === value)
  )

  function select(index: number) {
    if (name) {
      setValue(name, items[index].value, {
        shouldDirty: true,
        shouldValidate: true
      })
    }
  }

  return { activeIndex, select }
}
