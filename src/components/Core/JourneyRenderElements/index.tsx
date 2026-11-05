import {
  AddressRadioElement,
  BiologicalSexElement,
  BirthDateInputElement,
  BoxElement,
  CepElement,
  CepInputElement,
  CheckboxElement,
  ChecklistElement,
  ChipsElement,
  ComposableCardElement,
  ConditionalWrapperElement,
  ConfirmNavigationButtonElement,
  DrawerElement,
  DropdownElement,
  EmailInputElement,
  FCDCLicensePlateElement,
  FCDCPriceSimulationElement,
  FCDCProposalSentElement,
  FCDCResumeElement,
  FCDCUnknownLicensePlateElement,
  FixedWrapperElement,
  GridElement,
  IconContentListElement,
  IconElement,
  InputHiddenElement,
  LabelValueElement,
  LocationBoxElement,
  MaritalStatusElement,
  MarketingOptinElement,
  NationalityElement,
  NavigationElement,
  NotificationElement,
  NumericInputElement,
  OccupationElement,
  OptionCardListElement,
  ParagraphElement,
  PhoneInputElement,
  PlanCardElement,
  PriceSelectorElement,
  PrivacyPolicyElement,
  ProductsListElement,
  RadioElement,
  REFFLicensePlateElement,
  REFFProposalSentElement,
  REFFResumeElement,
  REFFSimulationElement,
  ServiceCallElement,
  SocialNamElement,
  SummaryPanelElement,
  SummaryProductCardElement,
  TabsElement,
  TaxvatInputElement,
  TextElement,
  TextInputElement,
  TitleElement,
  WelcomeElement
} from '@/components/Elements'
import { FullNameInputElement } from '@/components/Elements/FullNameInputElement'
import { ResumeElement } from '@/components/Elements/ResumeElement/ResumeElement'

import { renderJourneyElement } from './renderJourneyElement'
import type { JourneyElementRenderers } from './types'

export const renderers: JourneyElementRenderers = {
  NUMERIC_INPUT: (element) => <NumericInputElement element={element} />,
  FULL_NAME_INPUT: (element) => <FullNameInputElement element={element} />,
  ADDRESS_RADIO: (element) => <AddressRadioElement element={element} />,
  BOX: (element) => <BoxElement element={element} />,
  TITLE: (element) => <TitleElement element={element} />,
  TEXT: (element) => <TextElement element={element} />,
  PARAGRAPH: (element) => <ParagraphElement element={element} />,
  TEXT_INPUT: (element) => <TextInputElement element={element} />,
  PHONE_INPUT: (element) => <PhoneInputElement element={element} />,
  EMAIL_INPUT: (element) => <EmailInputElement element={element} />,
  TAXVAT_INPUT: (element) => <TaxvatInputElement element={element} />,
  BIRTH_DATE_INPUT: (element) => <BirthDateInputElement element={element} />,
  CEP_INPUT: (element) => <CepInputElement element={element} />,
  CEP: (element) => <CepElement element={element} />,
  RADIO: (element) => <RadioElement element={element} />,
  SELECT: (element) => <DropdownElement element={element} />,
  CHECKBOX: (element) => <CheckboxElement element={element} />,
  CHIPS: (element) => <ChipsElement element={element} />,
  SOCIAL_NAME: (element) => <SocialNamElement element={element} />,
  PRIVACY_POLICY: (element) => <PrivacyPolicyElement element={element} />,
  OCCUPATION: (element) => <OccupationElement element={element} />,
  SERVICE_CALL: (element) => <ServiceCallElement element={element} />,
  NAVIGATION: (element) => <NavigationElement element={element} />,
  PRODUCTS_LIST: (element) => <ProductsListElement element={element} />,
  GRID: (element) => <GridElement element={element} />,
  INPUT_HIDDEN: (element) => <InputHiddenElement element={element} />,
  RESUME: (element) => <ResumeElement element={element} />,
  MARITAL_STATUS: (element) => <MaritalStatusElement element={element} />,
  BIOLOGICAL_SEX: (element) => <BiologicalSexElement element={element} />,
  NATIONALITY: (element) => <NationalityElement element={element} />,
  NOTIFICATION: (element) => <NotificationElement element={element} />,
  WELCOME: (element) => <WelcomeElement element={element} />,
  ICON: (element) => <IconElement element={element} />,
  ICON_CONTENT_LIST: (element) => <IconContentListElement element={element} />,
  LABEL_VALUE: (element) => <LabelValueElement element={element} />,
  LOCATION_BOX: (element) => <LocationBoxElement element={element} />,
  MARKETING_OPTIN: (element) => <MarketingOptinElement element={element} />,
  OPTION_CARD_LIST: (element) => <OptionCardListElement element={element} />,
  CHECKLIST: (element) => <ChecklistElement element={element} />,
  CONFIRM_NAVIGATION_BUTTON: (element) => (
    <ConfirmNavigationButtonElement element={element} />
  ),
  COMPOSABLE_CARD: (element) => <ComposableCardElement element={element} />,
  SUMMARY_PANEL: (element) => <SummaryPanelElement element={element} />,
  SUMMARY_PRODUCT_CARD: (element) => (
    <SummaryProductCardElement element={element} />
  ),
  FIXED_WRAPPER: (element) => <FixedWrapperElement element={element} />,
  TABS: (element) => <TabsElement element={element} />,
  PRICE_SELECTOR: (element) => <PriceSelectorElement element={element} />,
  PLAN_CARD: (element) => <PlanCardElement element={element} />,
  DRAWER: (element) => <DrawerElement element={element} />,
  CONDITIONAL_WRAPPER: (element) => (
    <ConditionalWrapperElement element={element} />
  ),

  FCDC_UNKNOWN_PLATE: (element) => (
    <FCDCUnknownLicensePlateElement element={element} />
  ),
  FCDC_PLATE_INPUT: (element) => <FCDCLicensePlateElement element={element} />,
  FCDC_RESUME: (element) => <FCDCResumeElement element={element} />,
  FCDC_PRICE_SIMULATION: (element) => (
    <FCDCPriceSimulationElement element={element} />
  ),
  FCDC_PROPOSAL_SENT: (element) => (
    <FCDCProposalSentElement element={element} />
  ),

  REFF_SIMULATION: (element) => <REFFSimulationElement element={element} />,
  REFF_RESUME: (element) => <REFFResumeElement element={element} />,
  REFF_PROPOSAL_SENT: (element) => (
    <REFFProposalSentElement element={element} />
  ),
  REFF_PLATE_INPUT: (element) => <REFFLicensePlateElement element={element} />
}

export { renderJourneyElement }
