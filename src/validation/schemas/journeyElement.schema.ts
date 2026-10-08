import { z } from 'zod'

import { fcdcPlateInputElementSchema } from '@/features/fcdc/validation/schemas/elements/fcdcPlateInput.schema'
import { fcdcPriceSimulationElementSchema } from '@/features/fcdc/validation/schemas/elements/fcdcPriceSimulation.schema'
import { fcdcProposalSentElementSchema } from '@/features/fcdc/validation/schemas/elements/fcdcProposalSent.schema'
import { fcdcResumeElementSchema } from '@/features/fcdc/validation/schemas/elements/fcdcResume.schema'
import { fcdcUnknownLicensePlateElementSchema } from '@/features/fcdc/validation/schemas/elements/fcdcUnknownLicensePlateElement.schema'
import { reffPlateInputElementSchema } from '@/features/reff/validation/schemas/elements/reffPlateInput.schema'
import { reffProposalSentElementSchema } from '@/features/reff/validation/schemas/elements/reffProposalSent.schema'
import { reffResumeElementSchema } from '@/features/reff/validation/schemas/elements/reffResume.schema'
import { reffSimulationElementSchema } from '@/features/reff/validation/schemas/elements/reffSimulation.schema'

import { addressRadioElementSchema } from './elements/addressRadio.schema'
import { biologicalSexElementSchema } from './elements/biologicalSex.schema'
import { birthDateInputElementSchema } from './elements/birthDateInput.schema'
import { boxElementSchema } from './elements/box.schema'
import { cepElementSchema } from './elements/cepElement.schema'
import { cepInputElementSchema } from './elements/cepInput.schema'
import { checkboxElementSchema } from './elements/checkbox.schema'
import { checklistElementSchema } from './elements/checklist.schema'
import { chipsElementSchema } from './elements/chips.schema'
import { chipsImageElementSchema } from './elements/chipsImage.schema'
import { composableCardElementSchema } from './elements/composableCard.schema'
import { conditionalWrapperElementSchema } from './elements/conditionalWrapper.schema'
import { confirmNavigationButtonElementSchema } from './elements/confirmNavigationButton.schema'
import { drawerElementSchema } from './elements/drawer.schema'
import { emailInputElementSchema } from './elements/emailInput.schema'
import { feedbackViewElementSchema } from './elements/feedbackView.schema'
import { fixedWrapperElementSchema } from './elements/fixedWrapper.schema'
import { fullNameInputElementSchema } from './elements/fullNameInput.schema'
import { gridElementSchema } from './elements/grid.schema'
import { iconElementSchema } from './elements/icon.schema'
import { iconContentListElementSchema } from './elements/iconContentList.schema'
import { inputHiddenElementSchema } from './elements/inputHidden.schema'
import { labelValueElementSchema } from './elements/labelValue.schema'
import { locationBoxElementSchema } from './elements/locationBox.schema'
import { maritalStatusElementSchema } from './elements/maritalStatus.schema'
import { marketingOptinElementSchema } from './elements/marketingOptinElement.schema'
import { miniBannerHighlightElementSchema } from './elements/miniBannerHighlight.schema'
import { nationalityElementSchema } from './elements/nationality.schema'
import { navigationElementSchema } from './elements/navigation.schema'
import { notificationElementSchema } from './elements/notification.schema'
import { numericInputElementSchema } from './elements/numericInput.schema'
import { occupationElementSchema } from './elements/occupation.schema'
import { optionCardListElementSchema } from './elements/optionCardList.schema'
import { paragraphElementSchema } from './elements/paragraph.schema'
import { phoneInputElementSchema } from './elements/phoneInput.schema'
import { planCardElementSchema } from './elements/planCard.schema'
import { priceSelectorElementSchema } from './elements/priceSelector.schema'
import { privacyPoliceElementSchema } from './elements/privacyPolicy.schema'
import { productCardConsorcioElementSchema } from './elements/productCardConsorcio.schema'
import { productsListElementSchema } from './elements/productsList.schema'
import { radioElementSchema } from './elements/radio.schema'
import { resumeElementSchema } from './elements/resume.schema'
import { selectElementSchema } from './elements/select.schema'
import { serviceCallElementSchema } from './elements/serviceCall.schema'
import { socialNameElementSchema } from './elements/socialName.schema'
import { summaryPanelElementSchema } from './elements/summaryPanel.schema'
import { summaryProductCardElementSchema } from './elements/summaryProductCard.schema'
import { tabsElementSchema } from './elements/tabs.schema'
import { taxvatInputElementSchema } from './elements/taxvatInput.schema'
import { textElementSchema } from './elements/text.schema'
import { textInputElementSchema } from './elements/textInput.schema'
import { titleElementSchema } from './elements/title.schema'
import { welcomeElementSchema } from './elements/welcome.schema'

export const journeyElementSchema = z.discriminatedUnion('type', [
  addressRadioElementSchema,
  boxElementSchema,
  fullNameInputElementSchema,
  titleElementSchema,
  textElementSchema,
  paragraphElementSchema,
  textInputElementSchema,
  taxvatInputElementSchema,
  radioElementSchema,
  selectElementSchema,
  checkboxElementSchema,
  chipsElementSchema,
  chipsImageElementSchema,
  composableCardElementSchema,
  phoneInputElementSchema,
  socialNameElementSchema,
  serviceCallElementSchema,
  navigationElementSchema,
  gridElementSchema,
  emailInputElementSchema,
  cepElementSchema,
  cepInputElementSchema,
  birthDateInputElementSchema,
  privacyPoliceElementSchema,
  occupationElementSchema,
  maritalStatusElementSchema,
  biologicalSexElementSchema,
  nationalityElementSchema,
  notificationElementSchema,
  numericInputElementSchema,
  fixedWrapperElementSchema,
  feedbackViewElementSchema,
  resumeElementSchema,
  welcomeElementSchema,
  inputHiddenElementSchema,
  marketingOptinElementSchema,
  optionCardListElementSchema,
  confirmNavigationButtonElementSchema,
  iconContentListElementSchema,
  iconElementSchema,
  labelValueElementSchema,
  locationBoxElementSchema,
  summaryPanelElementSchema,
  summaryProductCardElementSchema,
  productCardConsorcioElementSchema,
  tabsElementSchema,
  miniBannerHighlightElementSchema,
  priceSelectorElementSchema,
  productsListElementSchema,
  planCardElementSchema,
  drawerElementSchema,
  checklistElementSchema,
  conditionalWrapperElementSchema,

  fcdcPlateInputElementSchema,
  fcdcPriceSimulationElementSchema,
  fcdcResumeElementSchema,
  fcdcProposalSentElementSchema,
  fcdcUnknownLicensePlateElementSchema,

  reffSimulationElementSchema,
  reffResumeElementSchema,
  reffProposalSentElementSchema,
  reffPlateInputElementSchema,
])
