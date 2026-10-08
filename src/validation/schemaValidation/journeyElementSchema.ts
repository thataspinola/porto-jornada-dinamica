import { z } from "zod";
import {
 composableCardElementSchema,
 conditionalWrapperElementSchema,
 textElementSchema,
} from "@/validation/schemas";

import { checkboxElementSchema } from "./checkboxElementSchema";
import { cpfInputElementSchema } from "./cpfInputElementSchema";
import { navigationElementSchema } from "./navigationElementSchema";
import { paragraphElementSchema } from "./paragraphElementSchema";
import { phoneInputElementSchema } from "./phoneInputElementSchema";
import { radioElementSchema } from "./radioElementSchema";
import { selectElementSchema } from "./selectElementSchema";
import { serviceCallElementSchema } from "./serviceCallElementSchema";
import { socialNameElementSchema } from "./socialNameElementSchema";
import { textInputElementSchema } from "./textInputElementSchema";
import { titleElementSchema } from "./titleElementSchema";

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
