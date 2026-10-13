import { z } from 'zod'

import { analyticsSchema } from './analytics.schema'
import { baseElementSchema } from './baseElement.schema'
import { buttonUiFields } from './elementUi.schemas'

export const navigationConfigSchema = z.object({
  label: z.string(),
  url: z.string().optional().default(''),
  cookies: z.record(z.string(), z.string()).optional(),
  fixed: z.boolean().optional().default(false),
  requiresStepCompletion: z.boolean().optional().default(false),
  presentation: z.enum(['button', 'link']).default('button'),
  analytics: analyticsSchema,
  ...buttonUiFields,
})

export const navigationElementSchema = baseElementSchema.extend({
  type: z.literal('NAVIGATION'),
  config: navigationConfigSchema,
})
