import { z } from 'zod'

export const requiredNumber = (message = 'Insira um valor válido.') =>
  z.number({ message }).positive(message)
