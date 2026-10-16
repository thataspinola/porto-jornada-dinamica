import { z } from 'zod'

import { baseElementSchema } from './baseElement.schema'
import { loadingScreenSchema } from '../loadingScreen.schema'
import { mockResponseSchema } from '../mockResponse.schema'
import { serviceErrorsSchema } from '../serviceErrors.schema'
import { analyticsSchema } from './analytics.schema'
import { conditionsSchema } from './conditions.schema'
import { buttonUiFields } from './elementUi.schemas'

const serviceRefSchema = z.object({
  action: z.string(),
  module: z.string(),
  successEvent: z.enum(['purchase', 'add_to_cart']).optional(),
})

const additionalPayloadSchema = z.record(z.string(), z.unknown())
const payloadSchema = z.record(z.string(), z.unknown())

export const serviceCallElementSchema = baseElementSchema.extend({
  type: z.literal('SERVICE_CALL'),
  config: z.object({
    label: z.string(),
    service: z
      .union([z.string().min(1), serviceRefSchema, z.array(serviceRefSchema)])
      .optional(),
    additionalPayload: z
      .union([additionalPayloadSchema, z.array(additionalPayloadSchema)])
      .optional(),
    payload: z.union([payloadSchema, z.array(payloadSchema)]).optional(),
    cookiesOnSuccess: z.record(z.string(), z.string()).optional(),
    targetStepOnSuccess: z.string(),
    fullPageRedirect: z.boolean().optional().default(false),
    conditions: conditionsSchema,
    errors: serviceErrorsSchema,
    loadingScreen: z
      .union([loadingScreenSchema, z.array(loadingScreenSchema)])
      .optional(),
    mockResponse: z
      .union([mockResponseSchema, z.array(mockResponseSchema)])
      .optional(),
    fixed: z.boolean().optional().default(false),
    requiresStepCompletion: z.boolean().optional().default(false),
    onlyDirtyFields: z.boolean().optional().default(false),
    revalidatePrefetch: z.boolean().optional().default(false),
    alertEvent: z
      .enum([
        'view_item',
        'view_item_list',
        'select_item',
        'view_promotion',
        'select_promotion',
        'add_to_cart',
        'lead',
        'purchase',
      ])
      .optional(),
    analytics: analyticsSchema,
    ...buttonUiFields,
  }),
})
