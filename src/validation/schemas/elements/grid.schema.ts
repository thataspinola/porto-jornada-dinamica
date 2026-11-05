import { z } from 'zod'

import { fcdcPlateInputElementSchema } from '@/features/fcdc/validation/schemas/elements/fcdcPlateInput.schema'

import { addressRadioElementSchema } from './addressRadio.schema'
import { baseElementSchema } from './baseElement.schema'
import { biologicalSexElementSchema } from './biologicalSex.schema'
import { birthDateInputElementSchema } from './birthDateInput.schema'
import { cepElementSchema } from './cepElementSchema'
import { cepInputElementSchema } from './cepInput.schema'
import { checkboxElementSchema } from './checkbox.schema'
import { chipsElementSchema } from './chips.schema'
import { composableCardElementSchema } from './composableCard.schema'
import { confirmNavigationButtonElementSchema } from './confirmNavigationButton.schema'
import { emailInputElementSchema } from './emailInput.schema'
import { fixedWrapperElementSchema } from './fixedWrapper.schema'
import { iconElementSchema } from './icon.schema'
import { iconContentListElementSchema } from './iconContentList.schema'
import { inputHiddenElementSchema } from './inputHidden.schema'
import { labelValueElementSchema } from './labelValue.schema'
import { maritalStatusElementSchema } from './maritalStatus.schema'
import { marketingOptinElementSchema } from './marketingOptinElement.schema'
import { nationalityElementSchema } from './nationality.schema'
import { navigationElementSchema } from './navigation.schema'
import { occupationElementSchema } from './occupation.schema'
import { optionCardListElementSchema } from './optionCardList.schema'
import { paragraphElementSchema } from './paragraph.schema'
import { phoneInputElementSchema } from './phoneInput.schema'
import { priceSelectorElementSchema } from './priceSelector.schema'
import { privacyPoliceElementSchema } from './privacyPolicy.schema'
import { radioElementSchema } from './radio.schema'
import { selectElementSchema } from './select.schema'
import { serviceCallElementSchema } from './serviceCall.schema'
import { socialNameElementSchema } from './socialName.schema'
import { spacingTokenSchema } from './styling.schema'
import { summaryProductCardElementSchema } from './summaryProductCard.schema'
import { tabsElementSchema } from './tabs.schema'
import { taxvatInputElementSchema } from './taxvatInput.schema'
import { textElementSchema } from './text.schema'
import { textInputElementSchema } from './textInput.schema'
import { titleElementSchema } from './title.schema'

const gridChildElementSchema = z.discriminatedUnion('type', [
  addressRadioElementSchema,
  biologicalSexElementSchema,
  birthDateInputElementSchema,
  cepElementSchema,
  cepInputElementSchema,
  checkboxElementSchema,
  chipsElementSchema,
  composableCardElementSchema,
  confirmNavigationButtonElementSchema,
  emailInputElementSchema,
  fixedWrapperElementSchema,
  iconElementSchema,
  iconContentListElementSchema,
  inputHiddenElementSchema,
  labelValueElementSchema,
  maritalStatusElementSchema,
  marketingOptinElementSchema,
  nationalityElementSchema,
  navigationElementSchema,
  occupationElementSchema,
  optionCardListElementSchema,
  paragraphElementSchema,
  phoneInputElementSchema,
  fcdcPlateInputElementSchema,
  priceSelectorElementSchema,
  privacyPoliceElementSchema,
  radioElementSchema,
  selectElementSchema,
  serviceCallElementSchema,
  socialNameElementSchema,
  summaryProductCardElementSchema,
  tabsElementSchema,
  taxvatInputElementSchema,
  textElementSchema,
  textInputElementSchema,
  titleElementSchema
])

const colSpanSchema = z.union([
  z.number().int().min(1).max(12),
  z.object({
    desktop: z.number().int().min(1).max(12),
    mobile: z.number().int().min(1).max(12)
  })
])

const gridItemSchema = baseElementSchema.extend({
  type: z.literal('GRID_ITEM'),
  config: z.object({
    colSpan: colSpanSchema,
    children: z.array(gridChildElementSchema).default([])
  })
})

export const gridElementSchema = baseElementSchema.extend({
  type: z.literal('GRID'),
  config: z.object({
    columns: z.number().int().min(1).max(12).optional().default(12),
    gap: spacingTokenSchema.optional(),
    stretchItems: z.boolean().optional().default(false),
    children: z.array(gridItemSchema).min(1)
  })
})
