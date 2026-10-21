import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { useForm } from 'react-hook-form'
import { describe, expect, it, vi } from 'vitest'
import type { ComponentType } from 'react'
import type { ConfiguredElementProps } from '@/components/Elements/ConfiguredElement'
import { FCDCLicensePlateElement as Component0 } from '@/features/fcdc/components/Elements/FCDCLicensePlateElement/FCDCLicensePlateElement'
import { FCDCPriceSimulationElement as Component1 } from '@/features/fcdc/components/Elements/FCDCPriceSimulationElement/FCDCPriceSimulationElement'
import { LoanRecalculationButton as Component2 } from '@/features/fcdc/components/Elements/FCDCPriceSimulationElement/components/LoanRecalculationButton/LoanRecalculationButton'
import { VehicleFinancingInputs as Component3 } from '@/features/fcdc/components/Elements/FCDCPriceSimulationElement/components/VehicleFinancingInputs/VehicleFinancingInputs'
import { PaymentMethod as Component4 } from '@/features/fcdc/components/Elements/FCDCPriceSimulationElement/components/PaymentMethod/PaymentMethod'
import { MaritalStatusElement as Component5 } from '@/components/Elements/MaritalStatusElement/MaritalStatusElement'
import { LabelValueElement as Component6 } from '@/components/Elements/LabelValueElement/LabelValueElement'
import { PreApprovedCreditCard as Component7 } from '@/features/fcdc/components/Elements/FCDCPriceSimulationElement/components/PreApprovedCreditCard/PreApprovedCreditCard'
import { NotificationElement as Component8 } from '@/components/Elements/NotificationElement/NotificationElement'
import { FCDCProposalSentElement as Component9 } from '@/features/fcdc/components/Elements/FCDCProposalSentElement/FCDCProposalSentElement'
import { BoxElement as Component10 } from '@/components/Elements/BoxElement/BoxElement'
import { Installments as Component11 } from '@/features/fcdc/components/Elements/FCDCPriceSimulationElement/components/Installments/Installments'
import { REFFLicensePlateElement as Component12 } from '@/features/reff/components/Elements/REFFLicensePlateElement/REFFLicensePlateElement'
import { ProtectedFinancing as Component13 } from '@/features/fcdc/components/Elements/FCDCPriceSimulationElement/components/ProtectedFinancing/ProtectedFinancing'
import { REFFResumeElement as Component14 } from '@/features/reff/components/Elements/REFFResumeElement/REFFResumeElement'
import { TabsElement as Component15 } from '@/components/Elements/TabsElement/TabsElement'
import { REFFSimulationElement as Component16 } from '@/features/reff/components/Elements/REFFSimulationElement/REFFSimulationElement'
import { SelectionModeChips as Component17 } from '@/features/fcdc/components/Elements/FCDCUnknownLicensePlateElement/components/SelectionModeChips/SelectionModeChips'
import { VehicleConditionChips as Component18 } from '@/features/fcdc/components/Elements/FCDCUnknownLicensePlateElement/components/VehicleConditionChips/VehicleConditionChips'
import { OccupationElement as Component19 } from '@/components/Elements/OccupationElement/OccupationElement'
import { LoanRecalculationButton as Component20 } from '@/features/reff/components/Elements/REFFSimulationElement/components/LoanRecalculationButton/LoanRecalculationButton'
import { SelectedVehicleCard as Component21 } from '@/features/fcdc/components/Elements/FCDCUnknownLicensePlateElement/components/SelectedVehicleCard/SelectedVehicleCard'
import { RequestedValueInput as Component22 } from '@/features/reff/components/Elements/REFFSimulationElement/components/RequestedValueInput/RequestedValueInput'
import { FullNameInputElement as Component23 } from '@/components/Elements/FullNameInputElement/FullNameInputElement'
import { FixedWrapperElement as Component24 } from '@/components/Elements/FixedWrapperElement/FixedWrapperElement'
import { PaymentMethod as Component25 } from '@/features/reff/components/Elements/REFFSimulationElement/components/PaymentMethod/PaymentMethod'
import { PreApprovedCreditCard as Component26 } from '@/features/reff/components/Elements/REFFSimulationElement/components/PreApprovedCreditCard/PreApprovedCreditCard'
import { EmptyList as Component27 } from '@/components/Elements/CepElement/components/ModalWithoutCep/components/EmptyList/EmptyList'
import { EditableInput as Component28 } from '@/features/fcdc/components/Elements/FCDCPriceSimulationElement/components/EditableInput/EditableInput'
import { KnownVehicleForm as Component29 } from '@/features/fcdc/components/Elements/FCDCUnknownLicensePlateElement/components/KnownVehicleForm/KnownVehicleForm'
import { AddressCardShimmer as Component30 } from '@/components/Elements/CepElement/components/ModalWithoutCep/components/AddressCardShimmer/AddressCardShimmer'
import { ModalWithoutCep as Component31 } from '@/components/Elements/CepElement/components/ModalWithoutCep/ModalWithoutCep'
import { Installments as Component32 } from '@/features/reff/components/Elements/REFFSimulationElement/components/Installments/Installments'
import { REFFProposalSentElement as Component33 } from '@/features/reff/components/Elements/REFFProposalSentElement/REFFProposalSentElement'
import { ProtectedFinancing as Component34 } from '@/features/reff/components/Elements/REFFSimulationElement/components/ProtectedFinancing/ProtectedFinancing'
import { UnknownVehicleForm as Component35 } from '@/features/fcdc/components/Elements/FCDCUnknownLicensePlateElement/components/UnknownVehicleForm/UnknownVehicleForm'
import { FCDCUnknownLicensePlateElement as Component36 } from '@/features/fcdc/components/Elements/FCDCUnknownLicensePlateElement/FCDCUnknownLicensePlateElement'
import { AddressInfo as Component37 } from '@/components/Elements/CepElement/components/AddressInfo/AddressInfo'
import { CepElement as Component38 } from '@/components/Elements/CepElement/CepElement'
import { ChipsElement as Component39 } from '@/components/Elements/ChipsElement/ChipsElement'
import { ChipsImageElement as Component40 } from '@/components/Elements/ChipsImageElement/ChipsImageElement'
import { PhoneInputElement as Component41 } from '@/components/Elements/PhoneInputElement/PhoneInputElement'
import { DrawerElement as Component42 } from '@/components/Elements/DrawerElement/DrawerElement'
import { PlanCardElement as Component43 } from '@/components/Elements/PlanCardElement/PlanCardElement'
import { FCDCResumeElement as Component44 } from '@/features/fcdc/components/Elements/FCDCResumeElement/FCDCResumeElement'
import { WelcomeElement as Component45 } from '@/components/Elements/WelcomeElement/WelcomeElement'
import { IconElement as Component46 } from '@/components/Elements/IconElement/IconElement'
import { ConfirmNavigationButtonElement as Component47 } from '@/components/Elements/ConfirmNavigationButtonElement/ConfirmNavigationButtonElement'
import { NationalityElement as Component48 } from '@/components/Elements/NationalityElement/NationalityElement'
import { PlanCard as Component49 } from '@/components/Elements/PlanCardElement/components/PlanCard/PlanCard'
import { MiniBannerHighlightElement as Component50 } from '@/components/Elements/MiniBannerHighlightElement/MiniBannerHighlightElement'
import { DialogLimitedOptions as Component51 } from '@/components/Elements/BiologicalSexElement/DialogLimitedOptions/DialogLimitedOptions'
import { BiologicalSexElement as Component52 } from '@/components/Elements/BiologicalSexElement/BiologicalSexElement'
import { AddressRadioElement as Component53 } from '@/components/Elements/AddressRadioElement/AddressRadioElement'
import { PlanCoverageDrawer as Component54 } from '@/components/Elements/PlanCardElement/components/PlanCoverageDrawer/PlanCoverageDrawer'
import { InputHiddenElement as Component55 } from '@/components/Elements/InputHiddenElement/InputHiddenElement'
import { EditableInput as Component56 } from '@/features/reff/components/Elements/REFFSimulationElement/components/EditableInput/EditableInput'
import { SummaryProductCardElement as Component57 } from '@/components/Elements/SummaryProductCardElement/SummaryProductCardElement'
import { ChecklistElement as Component58 } from '@/components/Elements/ChecklistElement/ChecklistElement'
import { IconContentListElement as Component59 } from '@/components/Elements/IconContentListElement/IconContentListElement'
import { PrivacyPolicyElement as Component60 } from '@/components/Elements/PrivacyPolicyElement/PrivacyPolicyElement'
import { FeedbackViewElement as Component61 } from '@/components/Elements/FeedbackViewElement/FeedbackViewElement'
import { CepInputElement as Component62 } from '@/components/Elements/CepInputElement/CepInputElement'
import { NumericInputElement as Component63 } from '@/components/Elements/NumericInputElement/NumericInputElement'
import { ProductCardConsorcioElement as Component64 } from '@/components/Elements/ProductCardConsorcioElement/ProductCardConsorcioElement'
import { GridElement as Component65 } from '@/components/Elements/GridElement/GridElement'
import { OptionCardListElement as Component66 } from '@/components/Elements/OptionCardListElement/OptionCardListElement'
import { PriceSelectorElement as Component67 } from '@/components/Elements/PriceSelectorElement/PriceSelectorElement'
import { LocationBoxElement as Component68 } from '@/components/Elements/LocationBoxElement/LocationBoxElement'
import { BirthDateInputElement as Component69 } from '@/components/Elements/BirthDateInputElement/BirthDateInputElement'
import { SummaryPanelElement as Component70 } from '@/components/Elements/SummaryPanelElement/SummaryPanelElement'
import { TaxvatElement as Component71 } from '@/components/Elements/TaxvatElement/TaxvatElement'
import { MarketingOptinElement as Component72 } from '@/components/Elements/MarketingOptinElement/MarketingOptinElement'
import { ResumeElement as Component73 } from '@/components/Elements/ResumeElement/ResumeElement'
import { ProductListElement as Component74 } from '@/components/Elements/ProductListElement/ProductListElement'
const cases = [
  {
    name: 'features/fcdc/components/Elements/FCDCLicensePlateElement/FCDCLicensePlateElement.tsx',
    Component: Component0,
    type: 'FCDC_LICENSE_PLATE',
    field: false,
  },
  {
    name: 'features/fcdc/components/Elements/FCDCPriceSimulationElement/FCDCPriceSimulationElement.tsx',
    Component: Component1,
    type: 'FCDC_PRICE_SIMULATION',
    field: false,
  },
  {
    name: 'features/fcdc/components/Elements/FCDCPriceSimulationElement/components/LoanRecalculationButton/LoanRecalculationButton.tsx',
    Component: Component2,
    type: 'BOX',
    field: false,
  },
  {
    name: 'features/fcdc/components/Elements/FCDCPriceSimulationElement/components/VehicleFinancingInputs/VehicleFinancingInputs.tsx',
    Component: Component3,
    type: 'BOX',
    field: false,
  },
  {
    name: 'features/fcdc/components/Elements/FCDCPriceSimulationElement/components/PaymentMethod/PaymentMethod.tsx',
    Component: Component4,
    type: 'BOX',
    field: false,
  },
  {
    name: 'components/Elements/MaritalStatusElement/MaritalStatusElement.tsx',
    Component: Component5,
    type: 'MARITAL_STATUS',
    field: true,
  },
  {
    name: 'components/Elements/LabelValueElement/LabelValueElement.tsx',
    Component: Component6,
    type: 'LABEL_VALUE',
    field: false,
  },
  {
    name: 'features/fcdc/components/Elements/FCDCPriceSimulationElement/components/PreApprovedCreditCard/PreApprovedCreditCard.tsx',
    Component: Component7,
    type: 'BOX',
    field: false,
  },
  {
    name: 'components/Elements/NotificationElement/NotificationElement.tsx',
    Component: Component8,
    type: 'NOTIFICATION',
    field: false,
  },
  {
    name: 'features/fcdc/components/Elements/FCDCProposalSentElement/FCDCProposalSentElement.tsx',
    Component: Component9,
    type: 'FCDC_PROPOSAL_SENT',
    field: false,
  },
  {
    name: 'components/Elements/BoxElement/BoxElement.tsx',
    Component: Component10,
    type: 'BOX',
    field: false,
  },
  {
    name: 'features/fcdc/components/Elements/FCDCPriceSimulationElement/components/Installments/Installments.tsx',
    Component: Component11,
    type: 'BOX',
    field: false,
  },
  {
    name: 'features/reff/components/Elements/REFFLicensePlateElement/REFFLicensePlateElement.tsx',
    Component: Component12,
    type: 'REFF_LICENSE_PLATE',
    field: false,
  },
  {
    name: 'features/fcdc/components/Elements/FCDCPriceSimulationElement/components/ProtectedFinancing/ProtectedFinancing.tsx',
    Component: Component13,
    type: 'BOX',
    field: false,
  },
  {
    name: 'features/reff/components/Elements/REFFResumeElement/REFFResumeElement.tsx',
    Component: Component14,
    type: 'REFF_RESUME',
    field: false,
  },
  {
    name: 'components/Elements/TabsElement/TabsElement.tsx',
    Component: Component15,
    type: 'TABS',
    field: false,
  },
  {
    name: 'features/reff/components/Elements/REFFSimulationElement/REFFSimulationElement.tsx',
    Component: Component16,
    type: 'REFF_SIMULATION',
    field: false,
  },
  {
    name: 'features/fcdc/components/Elements/FCDCUnknownLicensePlateElement/components/SelectionModeChips/SelectionModeChips.tsx',
    Component: Component17,
    type: 'BOX',
    field: false,
  },
  {
    name: 'features/fcdc/components/Elements/FCDCUnknownLicensePlateElement/components/VehicleConditionChips/VehicleConditionChips.tsx',
    Component: Component18,
    type: 'BOX',
    field: false,
  },
  {
    name: 'components/Elements/OccupationElement/OccupationElement.tsx',
    Component: Component19,
    type: 'OCCUPATION',
    field: false,
  },
  {
    name: 'features/reff/components/Elements/REFFSimulationElement/components/LoanRecalculationButton/LoanRecalculationButton.tsx',
    Component: Component20,
    type: 'BOX',
    field: false,
  },
  {
    name: 'features/fcdc/components/Elements/FCDCUnknownLicensePlateElement/components/SelectedVehicleCard/SelectedVehicleCard.tsx',
    Component: Component21,
    type: 'BOX',
    field: false,
  },
  {
    name: 'features/reff/components/Elements/REFFSimulationElement/components/RequestedValueInput/RequestedValueInput.tsx',
    Component: Component22,
    type: 'BOX',
    field: false,
  },
  {
    name: 'components/Elements/FullNameInputElement/FullNameInputElement.tsx',
    Component: Component23,
    type: 'FULL_NAME_INPUT',
    field: true,
  },
  {
    name: 'components/Elements/FixedWrapperElement/FixedWrapperElement.tsx',
    Component: Component24,
    type: 'FIXED_WRAPPER',
    field: false,
  },
  {
    name: 'features/reff/components/Elements/REFFSimulationElement/components/PaymentMethod/PaymentMethod.tsx',
    Component: Component25,
    type: 'BOX',
    field: false,
  },
  {
    name: 'features/reff/components/Elements/REFFSimulationElement/components/PreApprovedCreditCard/PreApprovedCreditCard.tsx',
    Component: Component26,
    type: 'BOX',
    field: false,
  },
  {
    name: 'components/Elements/CepElement/components/ModalWithoutCep/components/EmptyList/EmptyList.tsx',
    Component: Component27,
    type: 'BOX',
    field: false,
  },
  {
    name: 'features/fcdc/components/Elements/FCDCPriceSimulationElement/components/EditableInput/EditableInput.tsx',
    Component: Component28,
    type: 'NUMERIC_INPUT',
    field: true,
  },
  {
    name: 'features/fcdc/components/Elements/FCDCUnknownLicensePlateElement/components/KnownVehicleForm/KnownVehicleForm.tsx',
    Component: Component29,
    type: 'BOX',
    field: false,
  },
  {
    name: 'components/Elements/CepElement/components/ModalWithoutCep/components/AddressCardShimmer/AddressCardShimmer.tsx',
    Component: Component30,
    type: 'BOX',
    field: false,
  },
  {
    name: 'components/Elements/CepElement/components/ModalWithoutCep/ModalWithoutCep.tsx',
    Component: Component31,
    type: 'BOX',
    field: false,
  },
  {
    name: 'features/reff/components/Elements/REFFSimulationElement/components/Installments/Installments.tsx',
    Component: Component32,
    type: 'BOX',
    field: false,
  },
  {
    name: 'features/reff/components/Elements/REFFProposalSentElement/REFFProposalSentElement.tsx',
    Component: Component33,
    type: 'REFF_PROPOSAL_SENT',
    field: false,
  },
  {
    name: 'features/reff/components/Elements/REFFSimulationElement/components/ProtectedFinancing/ProtectedFinancing.tsx',
    Component: Component34,
    type: 'BOX',
    field: false,
  },
  {
    name: 'features/fcdc/components/Elements/FCDCUnknownLicensePlateElement/components/UnknownVehicleForm/UnknownVehicleForm.tsx',
    Component: Component35,
    type: 'FCDC_PLATE_INPUT',
    field: true,
  },
  {
    name: 'features/fcdc/components/Elements/FCDCUnknownLicensePlateElement/FCDCUnknownLicensePlateElement.tsx',
    Component: Component36,
    type: 'FCDC_UNKNOWN_LICENSE_PLATE',
    field: false,
  },
  {
    name: 'components/Elements/CepElement/components/AddressInfo/AddressInfo.tsx',
    Component: Component37,
    type: 'BOX',
    field: false,
  },
  {
    name: 'components/Elements/CepElement/CepElement.tsx',
    Component: Component38,
    type: 'CEP',
    field: true,
  },
  {
    name: 'components/Elements/ChipsElement/ChipsElement.tsx',
    Component: Component39,
    type: 'CHIPS',
    field: true,
  },
  {
    name: 'components/Elements/ChipsImageElement/ChipsImageElement.tsx',
    Component: Component40,
    type: 'CHIPS_IMAGE',
    field: true,
  },
  {
    name: 'components/Elements/PhoneInputElement/PhoneInputElement.tsx',
    Component: Component41,
    type: 'PHONE_INPUT',
    field: true,
  },
  {
    name: 'components/Elements/DrawerElement/DrawerElement.tsx',
    Component: Component42,
    type: 'DRAWER',
    field: false,
  },
  {
    name: 'components/Elements/PlanCardElement/PlanCardElement.tsx',
    Component: Component43,
    type: 'PLAN_CARD',
    field: false,
  },
  {
    name: 'features/fcdc/components/Elements/FCDCResumeElement/FCDCResumeElement.tsx',
    Component: Component44,
    type: 'FCDC_RESUME',
    field: false,
  },
  {
    name: 'components/Elements/WelcomeElement/WelcomeElement.tsx',
    Component: Component45,
    type: 'WELCOME',
    field: false,
  },
  {
    name: 'components/Elements/IconElement/IconElement.tsx',
    Component: Component46,
    type: 'ICON',
    field: false,
  },
  {
    name: 'components/Elements/ConfirmNavigationButtonElement/ConfirmNavigationButtonElement.tsx',
    Component: Component47,
    type: 'CONFIRM_NAVIGATION_BUTTON',
    field: false,
  },
  {
    name: 'components/Elements/NationalityElement/NationalityElement.tsx',
    Component: Component48,
    type: 'NATIONALITY',
    field: true,
  },
  {
    name: 'components/Elements/PlanCardElement/components/PlanCard/PlanCard.tsx',
    Component: Component49,
    type: 'BOX',
    field: false,
  },
  {
    name: 'components/Elements/MiniBannerHighlightElement/MiniBannerHighlightElement.tsx',
    Component: Component50,
    type: 'MINI_BANNER_HIGHLIGHT',
    field: false,
  },
  {
    name: 'components/Elements/BiologicalSexElement/DialogLimitedOptions/DialogLimitedOptions.tsx',
    Component: Component51,
    type: 'DRAWER',
    field: false,
  },
  {
    name: 'components/Elements/BiologicalSexElement/BiologicalSexElement.tsx',
    Component: Component52,
    type: 'BIOLOGICAL_SEX',
    field: true,
  },
  {
    name: 'components/Elements/AddressRadioElement/AddressRadioElement.tsx',
    Component: Component53,
    type: 'ADDRESS_RADIO',
    field: true,
  },
  {
    name: 'components/Elements/PlanCardElement/components/PlanCoverageDrawer/PlanCoverageDrawer.tsx',
    Component: Component54,
    type: 'DRAWER',
    field: false,
  },
  {
    name: 'components/Elements/InputHiddenElement/InputHiddenElement.tsx',
    Component: Component55,
    type: 'INPUT_HIDDEN',
    field: true,
  },
  {
    name: 'features/reff/components/Elements/REFFSimulationElement/components/EditableInput/EditableInput.tsx',
    Component: Component56,
    type: 'NUMERIC_INPUT',
    field: true,
  },
  {
    name: 'components/Elements/SummaryProductCardElement/SummaryProductCardElement.tsx',
    Component: Component57,
    type: 'SUMMARY_PRODUCT_CARD',
    field: false,
  },
  {
    name: 'components/Elements/ChecklistElement/ChecklistElement.tsx',
    Component: Component58,
    type: 'CHECKLIST',
    field: false,
  },
  {
    name: 'components/Elements/IconContentListElement/IconContentListElement.tsx',
    Component: Component59,
    type: 'ICON_CONTENT_LIST',
    field: false,
  },
  {
    name: 'components/Elements/PrivacyPolicyElement/PrivacyPolicyElement.tsx',
    Component: Component60,
    type: 'PRIVACY_POLICY',
    field: false,
  },
  {
    name: 'components/Elements/FeedbackViewElement/FeedbackViewElement.tsx',
    Component: Component61,
    type: 'FEEDBACK_VIEW',
    field: false,
  },
  {
    name: 'components/Elements/CepInputElement/CepInputElement.tsx',
    Component: Component62,
    type: 'CEP_INPUT',
    field: true,
  },
  {
    name: 'components/Elements/NumericInputElement/NumericInputElement.tsx',
    Component: Component63,
    type: 'NUMERIC_INPUT',
    field: true,
  },
  {
    name: 'components/Elements/ProductCardConsorcioElement/ProductCardConsorcioElement.tsx',
    Component: Component64,
    type: 'PRODUCT_CARD_CONSORCIO',
    field: false,
  },
  {
    name: 'components/Elements/GridElement/GridElement.tsx',
    Component: Component65,
    type: 'GRID',
    field: false,
  },
  {
    name: 'components/Elements/OptionCardListElement/OptionCardListElement.tsx',
    Component: Component66,
    type: 'OPTION_CARD_LIST',
    field: true,
  },
  {
    name: 'components/Elements/PriceSelectorElement/PriceSelectorElement.tsx',
    Component: Component67,
    type: 'PRICE_SELECTOR',
    field: true,
  },
  {
    name: 'components/Elements/LocationBoxElement/LocationBoxElement.tsx',
    Component: Component68,
    type: 'LOCATION_BOX',
    field: false,
  },
  {
    name: 'components/Elements/BirthDateInputElement/BirthDateInputElement.tsx',
    Component: Component69,
    type: 'BIRTH_DATE_INPUT',
    field: true,
  },
  {
    name: 'components/Elements/SummaryPanelElement/SummaryPanelElement.tsx',
    Component: Component70,
    type: 'SUMMARY_PANEL',
    field: false,
  },
  {
    name: 'components/Elements/TaxvatElement/TaxvatElement.tsx',
    Component: Component71,
    type: 'TAXVAT_INPUT',
    field: true,
  },
  {
    name: 'components/Elements/MarketingOptinElement/MarketingOptinElement.tsx',
    Component: Component72,
    type: 'MARKETING_OPTIN',
    field: true,
  },
  {
    name: 'components/Elements/ResumeElement/ResumeElement.tsx',
    Component: Component73,
    type: 'RESUME',
    field: false,
  },
  {
    name: 'components/Elements/ProductListElement/ProductListElement.tsx',
    Component: Component74,
    type: 'PRODUCT_LIST',
    field: false,
  },
]
function FormStory({
  Component,
  type,
}: {
  Component: ComponentType<ConfiguredElementProps>
  type: string
}) {
  const form = useForm<Record<string, unknown>>()
  return (
    <>
      <Component
        element={{
          id: 'fixture-field',
          type,
          config: {
            name: 'field',
            label: 'Campo da fixture',
            options: [{ label: 'Opção da fixture', value: 'choice' }],
            required: true,
            min: 0,
            max: 100,
          },
        }}
        control={form.control}
      />
      <output data-testid="values">{JSON.stringify(form.watch())}</output>
    </>
  )
}
describe('contratos públicos dos elementos declarativos de produtos', () => {
  it.each(cases)('$name preserva conteúdo, campos ou ações declarados', async ({
    Component,
    type,
    field,
  }) => {
    if (field) {
      const { container } = render(
        <FormStory Component={Component} type={type} />
      )
      if (type === 'INPUT_HIDDEN') {
        expect(
          container.querySelector('input[type="hidden"]')
        ).toBeInTheDocument()
        return
      }
      const input = screen.getByLabelText('Campo da fixture')
      if (input.tagName === 'SELECT') {
        fireEvent.change(input, { target: { value: 'choice' } })
        expect(screen.getByTestId('values')).toHaveTextContent(
          '"field":"choice"'
        )
      } else if (type === 'MARKETING_OPTIN') {
        fireEvent.click(input)
        expect(screen.getByTestId('values')).toHaveTextContent('"field":true')
      } else {
        const value =
          type === 'NUMERIC_INPUT' || type === 'PRICE_SELECTOR'
            ? '25'
            : 'Dado da fixture'
        fireEvent.change(input, { target: { value } })
        await waitFor(() =>
          expect(screen.getByTestId('values')).toHaveTextContent(
            type === 'NUMERIC_INPUT' || type === 'PRICE_SELECTOR'
              ? '"field":25'
              : '"field":"Dado da fixture"'
          )
        )
      }
      return
    }
    const onNavigate = vi.fn()
    const { unmount } = render(
      <Component
        element={{
          id: 'fixture-view',
          type,
          config: {
            label: 'Produto da fixture',
            description: 'Descrição da fixture',
            text: 'Texto da fixture',
            url: '/contrate/produto-da-fixture',
            value: 25,
            items: [{ title: 'Primeira opção', description: 'Detalhes' }],
            elements: [
              {
                id: 'child',
                type: 'TEXT',
                config: { text: 'Conteúdo da fixture' },
              },
            ],
          },
        }}
        onNavigate={onNavigate}
      />
    )
    if (type === 'CONFIRM_NAVIGATION_BUTTON') {
      const confirm = vi.spyOn(window, 'confirm').mockReturnValue(true)
      fireEvent.click(
        screen.getByRole('button', { name: 'Produto da fixture' })
      )
      expect(onNavigate).toHaveBeenCalledWith('/contrate/produto-da-fixture')
      confirm.mockRestore()
    } else if (type === 'ICON') {
      expect(
        screen.getByRole('img', { name: 'Produto da fixture' })
      ).toHaveTextContent('Texto da fixture')
    } else if (type === 'LABEL_VALUE') {
      expect(
        screen.getByText('Produto da fixture').nextSibling
      ).toHaveTextContent('25')
    } else if (type === 'TABS') {
      expect(
        screen.getByRole('tab', { name: 'Primeira opção' })
      ).toHaveAttribute('aria-selected', 'true')
      expect(screen.getByRole('tabpanel')).toHaveTextContent(
        'Conteúdo da fixture'
      )
    } else if (type === 'DRAWER') {
      fireEvent.click(
        screen.getByRole('button', { name: 'Produto da fixture' })
      )
      expect(screen.getByRole('dialog')).toHaveTextContent(
        'Conteúdo da fixture'
      )
      fireEvent.click(screen.getByRole('button', { name: 'Fechar' }))
      expect(screen.queryByRole('dialog')).toBeNull()
    } else {
      expect(
        screen.getByRole('heading', { name: 'Produto da fixture' })
      ).toBeInTheDocument()
      expect(screen.getByText('Conteúdo da fixture')).toBeInTheDocument()
      expect(
        screen.getByRole('link', { name: 'Produto da fixture' })
      ).toHaveAttribute('href', '/contrate/produto-da-fixture')
    }
    unmount()
  })
})
