import { z } from 'zod'

export const optionalNumber = () => z.number().finite().optional()
