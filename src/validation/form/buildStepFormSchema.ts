import { z } from 'zod'

import type { JourneyDefinition } from '@/validation/schemas'

import { elementRegistry } from './elementRegistry'
import type { ElementDefinition } from './types'

type JourneyStep = JourneyDefinition['steps'][number]
type JourneyElement = JourneyStep['elements'][number]

function getNestedElements(element: JourneyElement): JourneyElement[] {
  const config = element.config as Record<string, unknown>

  switch (element.type) {
    case 'CONDITIONAL_WRAPPER':
    case 'BOX':
    case 'FIXED_WRAPPER':
    case 'FEEDBACK_VIEW':
    case 'RESUME':
    case 'SUMMARY_PANEL':
      return (config.children ?? []) as JourneyElement[]
    case 'DRAWER':
      return [
        ...((config.headerChildren ?? []) as JourneyElement[]),
        ...((config.bodyChildren ?? []) as JourneyElement[]),
        ...((config.footerChildren ?? []) as JourneyElement[]),
      ]
    case 'GRID':
      return (
        (config.children ?? []) as Array<{
          config: { children: JourneyElement[] }
        }>
      ).flatMap((item) => item.config.children)
    case 'TABS':
      return (
        (config.items ?? []) as Array<{ children?: JourneyElement[] }>
      ).flatMap((item) => item.children ?? [])
    case 'COMPOSABLE_CARD':
      return (
        (config.children ?? []) as Array<{ element: JourneyElement }>
      ).map((child) => child.element)
    default:
      return []
  }
}

function flattenElements(elements: JourneyElement[]): JourneyElement[] {
  return elements.flatMap((element) => [
    element,
    ...flattenElements(getNestedElements(element)),
  ])
}

export function buildStepFormSchema(step: JourneyStep) {
  const shape: Record<string, z.ZodTypeAny> = {}
  const defaultValues: Record<string, unknown> = {}
  const refiners: NonNullable<ElementDefinition['refine']>[] = []
  const requiredFields = new Set<string>()
  const elements = flattenElements(step.elements)

  for (const element of elements) {
    const config = element.config as Record<string, unknown>

    if (config.required === true && typeof config.name === 'string') {
      requiredFields.add(config.name)
    }

    const factory = elementRegistry[element.type]
    if (!factory) continue

    const definition = (factory as (config: any) => ElementDefinition)(
      element.config,
    )

    Object.assign(shape, definition.schema)
    Object.assign(defaultValues, definition.defaultValues)
    if (definition.refine) refiners.push(definition.refine)
  }

  const base = z.object(shape)

  const schema =
    refiners.length === 0
      ? base
      : base.superRefine((data, ctx) => {
          for (const refine of refiners) {
            refine(data as Record<string, unknown>, ctx)
          }
        })

  return {
    schema,
    defaultValues,
    requiredFields: [...requiredFields],
  }
}
