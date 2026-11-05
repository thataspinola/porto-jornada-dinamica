import { z } from 'zod'

export const loadingScreenSchema = z
  .object({
    messages: z.array(z.string()).min(1),
    from: z.number().min(0).max(100).optional().default(0),
    to: z.number().min(0).max(100).optional().default(90),
    completionHold: z.number().int().nonnegative().optional().default(0)
  })
  .refine(({ from, to }) => from <= to, {
    message: 'O progresso inicial deve ser menor ou igual ao progresso final'
  })
