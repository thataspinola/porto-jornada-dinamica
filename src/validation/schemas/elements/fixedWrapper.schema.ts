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
import { confirmNavigationButtonElementSchema } from './confirmNavigationButton.schema'
import { emailInputElementSchema } from './emailInput.schema'
import { iconContentListElementSchema } from './iconContentList.schema'
import { inputHiddenElementSchema } from './inputHidden.schema'
import { labelValueElementSchema } from './labelValue.schema'
import { maritalStatusElementSchema } from './maritalStatus.schema'
import { marketingOptinElementSchema } from './marketingOptinElement.schema'
import { nationalityElementSchema } from './nationality.schema'
import { navigationElementSchema } from './navigation.schema'
import { occupationElementSchema } from './occupation.schema'
import { optionCardListElementSchema } from './optionCardList.schema'
import { phoneInputElementSchema } from './phoneInput.schema'
import { priceSelectorElementSchema } from './priceSelector.schema'
import { privacyPoliceElementSchema } from './privacyPolicy.schema'
import { radioElementSchema } from './radio.schema'
import { selectElementSchema } from './select.schema'
import { serviceCallElementSchema } from './serviceCall.schema'
import { socialNameElementSchema } from './socialName.schema'
import { summaryPanelElementSchema } from './summaryPanel.schema'
import { tabsElementSchema } from './tabs.schema'
import { taxvatInputElementSchema } from './taxvatInput.schema'
import { textElementSchema } from './text.schema'
import { textInputElementSchema } from './textInput.schema'

export const fixedModeSchema = z.enum(['none', 'mobile', 'all'])

export const fixedPositionSchema = z.literal('bottom-center')

const fixedWrapperChildSchema = z.discriminatedUnion('type', [
  addressRadioElementSchema,
  biologicalSexElementSchema,
  birthDateInputElementSchema,
  cepElementSchema,
  cepInputElementSchema,
  checkboxElementSchema,
  chipsElementSchema,
  confirmNavigationButtonElementSchema,
  emailInputElementSchema,
  iconContentListElementSchema,
  inputHiddenElementSchema,
  labelValueElementSchema,
  maritalStatusElementSchema,
  marketingOptinElementSchema,
  nationalityElementSchema,
  navigationElementSchema,
  occupationElementSchema,
  optionCardListElementSchema,
  phoneInputElementSchema,
  fcdcPlateInputElementSchema,
  priceSelectorElementSchema,
  privacyPoliceElementSchema,
  radioElementSchema,
  selectElementSchema,
  serviceCallElementSchema,
  socialNameElementSchema,
  summaryPanelElementSchema,
  tabsElementSchema,
  taxvatInputElementSchema,
  textElementSchema,
  textInputElementSchema
])

export const fixedWrapperElementSchema = baseElementSchema.extend({
  type: z.literal('FIXED_WRAPPER'),
  config: z.object({
    fixedMode: fixedModeSchema.optional().default('none'),
    fixedPosition: fixedPositionSchema.optional().default('bottom-center'),
    zIndex: z.number().int().optional().default(20),
    fillHeight: z.boolean().optional().default(false),
    children: z.array(fixedWrapperChildSchema).optional().default([])
  })
})
