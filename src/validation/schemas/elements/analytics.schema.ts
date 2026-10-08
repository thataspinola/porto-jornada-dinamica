import { z } from 'zod'

export const analyticsSchema = z
  .object({
    gtmName: z.string().optional(),
    gtmSubname: z.string().optional(),
    gtmSubnamePrefix: z.string().optional(),
  })
  .optional()
