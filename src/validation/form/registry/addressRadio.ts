import { z } from 'zod'

import { optionalBoolean, requiredString } from '@/validation/primitives'

import type { ElementHandler } from './types'

export const addressRadio: ElementHandler<'ADDRESS_RADIO'> = ({
  name,
  required,
}: {
  name: string
  required: boolean
  variant?: string
}) => ({
  schema: {
    [name]: required ? requiredString() : z.string().optional(),
    addressZipCode: requiredString(),
    addressStreetName: requiredString(),
    addressNeighborhood: requiredString(),
    addressNumber: z.string().optional(),
    hasNoNumber: optionalBoolean(),
    addressAdditionalInfo: z.string().optional(),
    addressState: requiredString(),
    addressCity: requiredString(),
  },
  defaultValues: {
    [name]: '',
    addressZipCode: '',
    addressStreetName: '',
    addressNeighborhood: '',
    addressNumber: '',
    hasNoNumber: false,
    addressAdditionalInfo: '',
    addressState: '',
    addressCity: '',
  },
})
