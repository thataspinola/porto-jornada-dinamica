import { z } from 'zod'

import { baseElementSchema } from './baseElement.schema'
import { composableCardElementSchema } from './composableCard.schema'
import { conditionCheckSchema } from './conditions.schema'
import { gridElementSchema } from './grid.schema'
import { iconElementSchema } from './icon.schema'
import { iconContentListElementSchema } from './iconContentList.schema'
import { navigationElementSchema } from './navigation.schema'
import { paragraphElementSchema } from './paragraph.schema'
import { textElementSchema } from './text.schema'
import { titleElementSchema } from './title.schema'
import { checklistElementSchema } from './checklist.schema'

const conditionalWrapperChildSchema = z.discriminatedUnion('type', [
  titleElementSchema,
  textElementSchema,
  paragraphElementSchema,
  iconElementSchema,
  iconContentListElementSchema,
  navigationElementSchema,
  composableCardElementSchema,
  checklistElementSchema,
  gridElementSchema,
])

export const conditionalWrapperElementSchema = baseElementSchema.extend({
  type: z.literal('CONDITIONAL_WRAPPER'),
  config: z.object({
    checks: z.array(conditionCheckSchema).min(1),
    children: z.array(conditionalWrapperChildSchema).min(1),
  }),
})
