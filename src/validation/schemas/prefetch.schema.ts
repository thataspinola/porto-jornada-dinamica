import { z } from 'zod'

import { loadingScreenSchema } from './loadingScreen.schema'
import { mockResponseSchema } from './mockResponse.schema'
import { serviceErrorsSchema } from './serviceErrors.schema'

export const prefetchSchema = z.object({
  action: z.string().optional(),
  module: z.string().optional(),
  payload: z.record(z.string(), z.unknown()).optional(),
  loadingScreen: loadingScreenSchema.optional(),
  mockResponse: mockResponseSchema.optional(),
  errors: serviceErrorsSchema,
  alertEvent: z
    .enum([
      'view_item',
      'view_item_list',
      'select_item',
      'view_promotion',
      'select_promotion',
      'add_to_cart',
      'lead',
      'select_content',
    ])
    .optional(),
  alertAction: z.string().optional(),
})

export type PrefetchDefinition = z.infer<typeof prefetchSchema>
