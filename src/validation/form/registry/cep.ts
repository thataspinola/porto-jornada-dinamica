import { z } from 'zod'

import { CEP_FIELD_NAMES } from '@/components/Elements/CepElement/hooks/constants'

import { optionalBoolean } from '@/validation/primitives'

import type { ElementHandler } from './types'

export const cep: ElementHandler<'CEP'> = () => ({
  schema: {
    [CEP_FIELD_NAMES.addressZipCode]: z
      .string()
      .nonempty('Insira o CEP.')
      .length(8, 'Insira um CEP válido.'),
    [CEP_FIELD_NAMES.addressStreetName]: z
      .string()
      .nonempty('Insira o endereço.'),
    [CEP_FIELD_NAMES.addressNeighborhood]: z
      .string()
      .nonempty('Insira o bairro.'),
    [CEP_FIELD_NAMES.addressNumber]: z.string().optional(),
    [CEP_FIELD_NAMES.hasNoNumber]: optionalBoolean(),
    [CEP_FIELD_NAMES.addressAdditionalInfo]: z.string().optional(),
    [CEP_FIELD_NAMES.addressState]: z.string().nonempty('Insira o estado.'),
    [CEP_FIELD_NAMES.addressCity]: z.string().nonempty('Insira a localidade.'),
  },
  defaultValues: {
    [CEP_FIELD_NAMES.addressZipCode]: '',
    [CEP_FIELD_NAMES.addressStreetName]: '',
    [CEP_FIELD_NAMES.addressNeighborhood]: '',
    [CEP_FIELD_NAMES.addressNumber]: '',
    [CEP_FIELD_NAMES.hasNoNumber]: false,
    [CEP_FIELD_NAMES.addressAdditionalInfo]: '',
    [CEP_FIELD_NAMES.addressState]: '',
    [CEP_FIELD_NAMES.addressCity]: '',
  },
  refine: (data: Record<string, unknown>, ctx: $RefinementCtx<unknown>) => {
    if (
      !data[CEP_FIELD_NAMES.hasNoNumber] &&
      !String(data[CEP_FIELD_NAMES.addressNumber] ?? '').trim()
    ) {
      ctx.addIssue({
        path: [CEP_FIELD_NAMES.addressNumber],
        code: 'custom',
        message: 'Insira o número.',
      })
    }

    if (
      data[CEP_FIELD_NAMES.hasNoNumber] === true &&
      !String(data[CEP_FIELD_NAMES.addressAdditionalInfo] ?? '').trim()
    ) {
      ctx.addIssue({
        path: [CEP_FIELD_NAMES.addressAdditionalInfo],
        code: 'custom',
        message: 'Insira o complemento.',
      })
    }
  },
})
