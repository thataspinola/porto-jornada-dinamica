import { env } from 'next-runtime-env'
import { useShallow } from 'zustand/shallow'

import { interpolateTemplate } from '@/utils'

import { useJourneyStore } from '@/store/journeyStore'

import { resolveConditionalTag } from '@/components/UI/ConditionalTag'

import type { ResumePdfProps } from './ResumePdf'
import type { ResumeDisplayOption, ResumeElementProps } from './types'

const keepMissing = env('NEXT_PUBLIC_NODE_ENV') !== 'production'

export function useResumeElementController(
  element: ResumeElementProps['element']
) {
  const { preTitle, title, options, children } = element.config

  const fields = useJourneyStore(useShallow((state) => state.fields))

  const resolve = (template: string | undefined) =>
    interpolateTemplate(template, fields, { keepMissing })

  const resolvedPreTitle = resolve(preTitle)
  const resolvedTitle = resolve(title)

  const resolvedOptions = options.reduce<ResumeDisplayOption[]>(
    (acc, option) => {
      const resolvedLabel = resolve(option.label)

      if (!resolvedLabel) {
        return acc
      }

      acc.push({
        label: resolvedLabel,
        value: resolve(option.value),
        tag: option.tag,
        hasDivider: option.hasDivider
      })

      return acc
    },
    []
  )

  const pdfOptions = resolvedOptions.reduce<ResumePdfProps['options']>(
    (acc, option) => {
      acc.push({
        ...option,
        tag: resolveConditionalTag({
          conditionalRules: option.tag,
          fields: fields as Record<string, unknown>,
          resolveLabel: resolve
        })
      })

      return acc
    },
    []
  )

  const pdfFileName = `${Date.now().toString()}.pdf`

  return {
    preTitle: resolvedPreTitle,
    title: resolvedTitle,
    options: resolvedOptions,
    pdfOptions,
    fields: fields as Record<string, unknown>,
    resolveLabel: resolve,
    children,
    pdfFileName
  }
}
