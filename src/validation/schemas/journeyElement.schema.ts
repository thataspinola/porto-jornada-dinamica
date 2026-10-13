import { z } from "zod";
import { cpfInputElementSchema } from "@/validation/schemaValidation/cpfInput.schema";

import { fcdcPlateInputElementSchema } from "@/features/fcdc/validation/schemas/elements/fcdcPlateInput.schema";
import { fcdcPriceSimulationElementSchema } from "@/features/fcdc/validation/schemas/elements/fcdcPriceSimulation.schema";
import { fcdcProposalSentElementSchema } from "@/features/fcdc/validation/schemas/elements/fcdcProposalSent.schema";
import { fcdcResumeElementSchema } from "@/features/fcdc/validation/schemas/elements/fcdcResume.schema";
import { fcdcUnknownLicensePlateElementSchema } from "@/features/fcdc/validation/schemas/elements/fcdcUnknownLicensePlate.schema";
import { reffPlateInputElementSchema } from "@/features/reff/validation/schemas/elements/reffPlateInput.schema";
import { reffProposalSentElementSchema } from "@/features/reff/validation/schemas/elements/reffProposalSent.schema";
import { reffResumeElementSchema } from "@/features/reff/validation/schemas/elements/reffResume.schema";
import { reffSimulationElementSchema } from "@/features/reff/validation/schemas/elements/reffSimulation.schema";

import { addressRadioElementSchema } from "@/validation/schemas/elements/addressRadio.schema";
import { biologicalSexElementSchema } from "@/validation/schemas/elements/biologicalSex.schema";
import { birthDateInputElementSchema } from "@/validation/schemas/elements/birthDateInput.schema";
import { boxElementSchema } from "@/validation/schemas/elements/box.schema";
import { cepElementSchema } from "@/validation/schemas/elements/cep.schema";
import { cepInputElementSchema } from "@/validation/schemas/elements/cepInput.schema";
import { checkboxElementSchema } from "@/validation/schemas/elements/checkbox.schema";
import { checklistElementSchema } from "@/validation/schemas/elements/checklist.schema";
import { chipsElementSchema } from "@/validation/schemas/elements/chips.schema";
import { chipsImageElementSchema } from "@/validation/schemas/elements/chipsImage.schema";
import { composableCardElementSchema } from "@/validation/schemas/elements/composableCard.schema";
import { conditionalWrapperElementSchema } from "@/validation/schemas/elements/conditionalWrapper.schema";
import { confirmNavigationButtonElementSchema } from "@/validation/schemas/elements/confirmNavigationButton.schema";
import { drawerElementSchema } from "@/validation/schemas/elements/drawer.schema";
import { emailInputElementSchema } from "@/validation/schemas/elements/emailInput.schema";
import { feedbackViewElementSchema } from "@/validation/schemas/elements/feedbackView.schema";
import { fixedWrapperElementSchema } from "@/validation/schemas/elements/fixedWrapper.schema";
import { fullNameInputElementSchema } from "@/validation/schemas/elements/fullNameInput.schema";
import { gridElementSchema } from "@/validation/schemas/elements/grid.schema";
import { iconElementSchema } from "@/validation/schemas/elements/icon.schema";
import { iconContentListElementSchema } from "@/validation/schemas/elements/iconContentList.schema";
import { inputHiddenElementSchema } from "@/validation/schemas/elements/inputHidden.schema";
import { labelValueElementSchema } from "@/validation/schemas/elements/labelValue.schema";
import { locationBoxElementSchema } from "@/validation/schemas/elements/locationBox.schema";
import { maritalStatusElementSchema } from "@/validation/schemas/elements/maritalStatus.schema";
import { marketingOptinElementSchema } from "@/validation/schemas/elements/marketingOptinElement.schema";
import { miniBannerHighlightElementSchema } from "@/validation/schemas/elements/miniBannerHighlight.schema";
import { nationalityElementSchema } from "@/validation/schemas/elements/nationality.schema";
import { navigationElementSchema } from "@/validation/schemas/elements/navigation.schema";
import { notificationElementSchema } from "@/validation/schemas/elements/notification.schema";
import { numericInputElementSchema } from "@/validation/schemas/elements/numericInput.schema";
import { occupationElementSchema } from "@/validation/schemas/elements/occupation.schema";
import { optionCardListElementSchema } from "@/validation/schemas/elements/optionCardList.schema";
import { paragraphElementSchema } from "@/validation/schemas/elements/paragraph.schema";
import { phoneInputElementSchema } from "@/validation/schemas/elements/phoneInput.schema";
import { planCardElementSchema } from "@/validation/schemas/elements/planCard.schema";
import { priceSelectorElementSchema } from "@/validation/schemas/elements/priceSelector.schema";
import { privacyPoliceElementSchema } from "@/validation/schemas/elements/privacyPolicy.schema";
import { productCardConsorcioElementSchema } from "@/validation/schemas/elements/productCardConsorcio.schema";
import { productsListElementSchema } from "@/validation/schemas/elements/productList.schema";
import { radioElementSchema } from "@/validation/schemas/elements/radio.schema";
import { resumeElementSchema } from "@/validation/schemas/elements/resume.schema";
import { selectElementSchema } from "@/validation/schemas/elements/select.schema";
import { serviceCallElementSchema } from "@/validation/schemas/elements/serviceCall.schema";
import { socialNameElementSchema } from "@/validation/schemas/elements/socialName.schema";
import { summaryPanelElementSchema } from "@/validation/schemas/elements/summaryPanel.schema";
import { summaryProductCardElementSchema } from "@/validation/schemas/elements/summaryProductCard.schema";
import { tabsElementSchema } from "@/validation/schemas/elements/tabs.schema";
import { taxvatInputElementSchema } from "@/validation/schemas/elements/taxvatInput.schema";
import { textElementSchema } from "@/validation/schemas/elements/text.schema";
import { textInputElementSchema } from "@/validation/schemas/elements/textInput.schema";
import { titleElementSchema } from "@/validation/schemas/elements/title.schema";
import { welcomeElementSchema } from "@/validation/schemas/elements/welcome.schema";

export const journeyElementSchema = z.discriminatedUnion("type", [
	addressRadioElementSchema,
	cpfInputElementSchema,
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
]);
