import { z } from 'zod'

import {
  FEEDBACK_VIEW_STYLES,
  FEEDBACK_VIEW_TONES,
} from '@/components/UI/FeedbackView/types'

import { baseElementSchema } from './baseElement.schema'
import { boxElementSchema } from './box.schema'
import { confirmNavigationButtonElementSchema } from './confirmNavigationButton.schema'
import { fixedWrapperElementSchema } from './fixedWrapper.schema'
import { iconNameSchema } from './icon.schema'
import { navigationElementSchema } from './navigation.schema'
import { serviceCallElementSchema } from './serviceCall.schema'
import { textElementSchema } from './text.schema'

const feedbackViewChildSchema = z.discriminatedUnion('type', [
  serviceCallElementSchema,
  navigationElementSchema,
  confirmNavigationButtonElementSchema,
  textElementSchema,
  boxElementSchema,
  fixedWrapperElementSchema,
])

export const feedbackViewElementSchema = baseElementSchema.extend({
  type: z.literal('FEEDBACK_VIEW'),
  config: z.object({
    styles: z.enum(FEEDBACK_VIEW_STYLES).optional(),
    tone: z.enum(FEEDBACK_VIEW_TONES).optional(),
    icon: iconNameSchema.optional(),
    iconSize: z.number().int().positive().optional(),
    title: z.string(),
    description: z.string().optional(),
    notification: z
      .object({
        title: z.string().optional(),
        text: z.string(),
        variant: z
          .enum(['default', 'information', 'warning', 'success', 'danger'])
          .optional(),
        styles: z.enum(['stroke', 'filled', 'flat']).optional(),
      })
      .optional(),
    disclaimer: z.string().optional(),
    children: z.array(feedbackViewChildSchema).optional().default([]),
  }),
})
