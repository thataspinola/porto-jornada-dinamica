import type { z } from 'zod'

export type StepFields = Record<string, string[]>

export type ElementDefinition = {
  schema: Record<string, z.ZodTypeAny>
  defaultValues: Record<string, unknown>
  refine?: (data: Record<string, unknown>, ctx: z.RefinementCtx) => void
}
