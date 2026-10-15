import { z } from 'zod'

import { conditionActionSchema } from '@/validation/schemas/elements/conditions.schema'

export const serviceErrorRuleSchema = z.object({
  code: z.string(),
  action: conditionActionSchema,
})

export const serviceErrorsSchema = z
  .array(serviceErrorRuleSchema)
  .optional()
  .default([])

export type ServiceErrorRule = z.infer<typeof serviceErrorRuleSchema>
export type ServiceErrorsConfig = z.infer<typeof serviceErrorsSchema>
export type ServiceErrorAction = z.infer<typeof conditionActionSchema>
