import { z } from 'zod'

import { baseElementSchema } from '@/validation/schemas/elements/baseElement.schema'
import { checkboxElementSchema } from '@/validation/schemas/elements/checkbox.schema'
import { checklistElementSchema } from '@/validation/schemas/elements/checklist.schema'
import { chipsElementSchema } from '@/validation/schemas/elements/chips.schema'
import { composableCardElementSchema } from '@/validation/schemas/elements/composableCard.schema'
import { inputUiFields } from '@/validation/schemas/elements/elementUi.schemas'
import { gridElementSchema } from '@/validation/schemas/elements/grid.schema'
import { iconElementSchema } from '@/validation/schemas/elements/icon.schema'
import { iconContentListElementSchema } from '@/validation/schemas/elements/iconContentList.schema'
import { inputHiddenElementSchema } from '@/validation/schemas/elements/inputHidden.schema'
import { labelValueElementSchema } from '@/validation/schemas/elements/labelValue.schema'
import { navigationElementSchema } from '@/validation/schemas/elements/navigation.schema'
import { optionCardListElementSchema } from '@/validation/schemas/elements/optionCardList.schema'
import { paragraphElementSchema } from '@/validation/schemas/elements/paragraph.schema'
import { radioElementSchema } from '@/validation/schemas/elements/radio.schema'
import { selectElementSchema } from '@/validation/schemas/elements/select.schema'
import { tabsElementSchema } from '@/validation/schemas/elements/tabs.schema'
import { textElementSchema } from '@/validation/schemas/elements/text.schema'
import { textInputElementSchema } from '@/validation/schemas/elements/textInput.schema'
import { titleElementSchema } from '@/validation/schemas/elements/title.schema'

const childElementSchema = z.discriminatedUnion('type', [
  checkboxElementSchema,
  chipsElementSchema,
  composableCardElementSchema,
  iconElementSchema,
  iconContentListElementSchema,
  inputHiddenElementSchema,
  labelValueElementSchema,
  navigationElementSchema,
  optionCardListElementSchema,
  paragraphElementSchema,
  radioElementSchema,
  selectElementSchema,
  tabsElementSchema,
  textElementSchema,
  textInputElementSchema,
  titleElementSchema,
  gridElementSchema,
  checklistElementSchema
])

export const reffPlateInputElementSchema = baseElementSchema.extend({
  type: z.literal('REFF_PLATE_INPUT'),
  config: z.object({
    label: z.string(),
    placeholder: z.string().optional(),
    required: z.boolean().default(false),
    name: z.string(),
    defaultValue: z.string().optional(),
    defaultValueFrom: z.any().optional(),
    children: z.array(childElementSchema).default([]).optional(),
    ...inputUiFields
  })
})
