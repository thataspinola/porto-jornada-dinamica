import { z } from 'zod'

export const requiredString = (message = 'Insira um valor válido.') =>
  z.string().nonempty(message)
