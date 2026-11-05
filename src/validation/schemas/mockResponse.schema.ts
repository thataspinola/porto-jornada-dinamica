import { z } from 'zod'

export const mockResponseSchema = z.object({
  data: z.record(z.string(), z.unknown()),
  delayMs: z.number().int().nonnegative().optional().default(1000)
})
