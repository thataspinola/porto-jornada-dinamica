import { z } from "zod";
import {
	composableCardElementSchema,
	conditionalWrapperElementSchema,
	textElementSchema,
} from "@/validation/schemas";

import { checkboxElementSchema } from "./checkbox.schema";
import { cpfInputElementSchema } from "./cpfInput.schema";
import { navigationElementSchema } from "./navigation.schema";
import { paragraphElementSchema } from "./paragraph.schema";
import { phoneInputElementSchema } from "./phoneInput.schema";
import { radioElementSchema } from "./radio.schema";
import { selectElementSchema } from "./select.schema";
import { serviceCallElementSchema } from "./serviceCall.schema";
import { socialNameElementSchema } from "./socialName.schema";
import { textInputElementSchema } from "./textInput.schema";
import { titleElementSchema } from "./title.schema";

export const journeyElementSchema = z.discriminatedUnion("type", [
	textElementSchema,
	composableCardElementSchema,
	conditionalWrapperElementSchema,
	titleElementSchema,
	paragraphElementSchema,
	textInputElementSchema,
	cpfInputElementSchema,
	radioElementSchema,
	selectElementSchema,
	checkboxElementSchema,
	phoneInputElementSchema,
	socialNameElementSchema,
	serviceCallElementSchema,
	navigationElementSchema,
]);
