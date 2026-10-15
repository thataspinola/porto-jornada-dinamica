import { z } from 'zod'

import { baseElementSchema } from './baseElement.schema'
import { checkboxElementSchema } from './checkbox.schema'
import { navigationElementSchema } from './navigation.schema'
import { paragraphElementSchema } from './paragraph.schema'
import { radioElementSchema } from './radio.schema'
import { selectElementSchema } from './select.schema'
import { textElementSchema } from './text.schema'
import { textInputElementSchema } from './textInput.schema'
import { titleElementSchema } from './title.schema'

const drawerChildSchema = z.discriminatedUnion('type', [
  titleElementSchema,
  textElementSchema,
  paragraphElementSchema,
  textInputElementSchema,
  radioElementSchema,
  selectElementSchema,
  checkboxElementSchema,
  navigationElementSchema,
])

export const drawerElementSchema = baseElementSchema.extend({
  type: z.literal('DRAWER'),
  config: z.object({
    slug: z.string().min(1, 'Informe o identificador do drawer'),
    headerChildren: z.array(drawerChildSchema).optional().default([]),
    bodyChildren: z.array(drawerChildSchema).optional().default([]),
    footerChildren: z.array(drawerChildSchema).optional().default([]),
  }),
})
