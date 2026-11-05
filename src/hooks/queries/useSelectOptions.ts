'use client'

import { useQuery } from '@tanstack/react-query'

import { fetchSelectOptions } from '@/services'

import { getByPath, interpolateTemplate } from '@/utils'

import type { SelectOptionsSource } from '@/validation/schemas'

export function useSelectOptions(optionsSource?: SelectOptionsSource) {
  const {
    source = '',
    valueKey = 'value',
    labelTemplate = '{{label}}'
  } = optionsSource ?? {}

  const { data: options, isLoading: isOptionsLoading } = useQuery({
    queryKey: ['select-options', source],
    queryFn: async () => {
      const result = await fetchSelectOptions({ source })

      return result.data ?? []
    },
    select: (items) =>
      items.map((item) => ({
        value: String(getByPath(item, valueKey) ?? ''),
        label: interpolateTemplate(labelTemplate, item) ?? ''
      })),
    enabled: !!source,
    staleTime: Infinity,
    refetchOnWindowFocus: false
  })

  return {
    options: options ?? [],
    isOptionsLoading
  }
}
