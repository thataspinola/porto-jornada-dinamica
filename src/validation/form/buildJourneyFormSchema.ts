import { z } from 'zod'

import type { JourneyDefinition } from '@/validation/schemas'

import { buildStepFormSchema } from './buildStepFormSchema'
import type { StepFields } from './types'

export function buildJourneyFormSchema(journey: JourneyDefinition) {
  const steps = journey.steps.map((step) => ({
    id: step.id,
    ...buildStepFormSchema(step),
  }))

  const stepFields: StepFields = {}
  const defaultValues: Record<string, unknown> = {}

  for (const step of steps) {
    stepFields[step.id] = Object.keys(step.schema.shape)
    Object.assign(defaultValues, step.defaultValues)
  }

  const schema = z.record(z.string(), z.unknown()).transform((data, ctx) => {
    const values: Record<string, unknown> = {}

    for (const step of steps) {
      const result = step.schema.safeParse(data)
      if (result.success) Object.assign(values, result.data)
      else for (const issue of result.error.issues) ctx.addIssue({ ...issue })
    }

    return values
  })

  return { schema, stepFields, defaultValues }
}
