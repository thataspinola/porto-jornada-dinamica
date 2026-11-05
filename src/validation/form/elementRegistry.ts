import { z } from 'zod'

import { priceSimulation } from '@/features/fcdc/validation/form/registry/priceSimulation'
import { unknownPlate } from '@/features/fcdc/validation/form/registry/unknownPlate'
import { plate as reffPlate } from '@/features/reff/validation/form/registry/plate'
import { reffSimulation } from '@/features/reff/validation/form/registry/reffSimulation'
import {
  birthDate,
  cep as cepValidation,
  cpf,
  fullName,
  isMaskedEmail,
  phone
} from '@/validation/fields'
import {
  optionalBoolean,
  optionalString,
  requiredString,
  requiredTrueBoolean
} from '@/validation/primitives'
import type { JourneyDefinition } from '@/validation/schemas'

import { plate } from '../../features/fcdc/validation/form/registry/plate'
import { applyOptionalValidations, applyValidations } from './applyValidations'
import { addressRadio } from './registry/addressRadio'
import { biologicalSex } from './registry/biologicalSex'
import { cep } from './registry/cep'
import { occupation } from './registry/occupation'
import { socialName } from './registry/socialName'
import type { ElementDefinition } from './types'

type JourneyStep = JourneyDefinition['steps'][number]
type JourneyElement = JourneyStep['elements'][number]

type ElementRegistryMap = Partial<{
  [K in JourneyElement['type']]: (
    config: Extract<JourneyElement, { type: K }>['config']
  ) => ElementDefinition
}>

export const elementRegistry: ElementRegistryMap = {
  NUMERIC_INPUT: ({ name, required, defaultValue, validations }) => ({
    schema: {
      [name]: required
        ? applyValidations(requiredString(), validations)
        : applyOptionalValidations(validations)
    },
    defaultValues: { [name]: defaultValue }
  }),

  FULL_NAME_INPUT: ({ name, required, defaultValue }) => ({
    schema: { [name]: fullName(required) },
    defaultValues: { [name]: defaultValue }
  }),

  ADDRESS_RADIO: addressRadio,

  BIRTH_DATE_INPUT: ({ name, required, defaultValue }) => ({
    schema: { [name]: birthDate(required) },
    defaultValues: { [name]: defaultValue }
  }),

  TEXT_INPUT: ({ name, required, defaultValue, validations }) => ({
    schema: {
      [name]: required
        ? applyValidations(
            z.string().trim().nonempty('Insira um valor válido.'),
            validations
          )
        : applyOptionalValidations(validations, { trim: true })
    },
    defaultValues: { [name]: defaultValue }
  }),

  INPUT_HIDDEN: ({ name, value }) => ({
    schema: { [name]: requiredString() },
    defaultValues: { [name]: value }
  }),

  TAXVAT_INPUT: ({ name, required, defaultValue }) => ({
    schema: { [name]: cpf(required) },
    defaultValues: { [name]: defaultValue }
  }),
  CEP: cep,
  CEP_INPUT: ({ name, required, defaultValue }) => ({
    schema: { [name]: cepValidation(required) },
    defaultValues: { [name]: defaultValue }
  }),

  PHONE_INPUT: ({ name, required, defaultValue }) => ({
    schema: { [name]: phone(required) },
    defaultValues: { [name]: defaultValue }
  }),

  EMAIL_INPUT: ({ name, required, defaultValue }) => ({
    schema: {
      [name]: z.string().refine((val) => {
        if (!val) return !required
        if (isMaskedEmail(val)) return true
        return z.email().safeParse(val).success
      }, 'Insira um e-mail válido.')
    },
    defaultValues: { [name]: defaultValue }
  }),

  FCDC_PLATE_INPUT: plate,
  REFF_PLATE_INPUT: reffPlate,
  FCDC_UNKNOWN_PLATE: unknownPlate,
  FCDC_PRICE_SIMULATION: priceSimulation,

  REFF_SIMULATION: reffSimulation,

  RADIO: ({ name, required, defaultValue }) => ({
    schema: { [name]: required ? requiredString() : optionalString() },
    defaultValues: { [name]: defaultValue }
  }),

  CHIPS: ({ name, required, defaultValue }) => ({
    schema: { [name]: required ? requiredString() : optionalString() },
    defaultValues: { [name]: defaultValue }
  }),

  OPTION_CARD_LIST: ({ name }) => ({
    schema: name ? { [name]: requiredString() } : {},
    defaultValues: name ? { [name]: '' } : {}
  }),

  SELECT: ({ name, required, defaultValue }) => ({
    schema: { [name]: required ? requiredString() : optionalString() },
    defaultValues: { [name]: defaultValue }
  }),

  CHECKBOX: ({ name, required, defaultValue }) => ({
    schema: { [name]: required ? requiredTrueBoolean() : optionalBoolean() },
    defaultValues: { [name]: defaultValue }
  }),

  PLAN_CARD: () => ({
    schema: {
      productSku: optionalString(),
      boost: optionalString()
    },
    defaultValues: {}
  }),

  SUMMARY_PRODUCT_CARD: () => ({
    schema: {
      productSku: optionalString(),
      boost: optionalString()
    },
    defaultValues: {}
  }),

  SOCIAL_NAME: socialName,

  OCCUPATION: occupation,

  MARITAL_STATUS: ({ name, required }) => ({
    schema: {
      [name]: required
        ? requiredString('Insira o seu estado civil.')
        : optionalString()
    },
    defaultValues: { [name]: '' }
  }),

  BIOLOGICAL_SEX: biologicalSex,

  NATIONALITY: ({ name, required }) => ({
    schema: {
      [name]: required
        ? requiredString('Insira a sua nacionalidade.')
        : optionalString()
    },
    defaultValues: { [name]: '' }
  }),

  MARKETING_OPTIN: ({ name }) => ({
    schema: { [name]: optionalBoolean() },
    defaultValues: { [name]: false }
  }),

  TABS: ({ name, items }) => ({
    schema: name ? { [name]: requiredString() } : {},
    defaultValues: name ? { [name]: items[0]?.value ?? '' } : {}
  }),

  PRICE_SELECTOR: ({ name, min, defaultValue }) => ({
    schema: { [name]: z.number() },
    defaultValues: { [name]: defaultValue ?? min }
  })
}
