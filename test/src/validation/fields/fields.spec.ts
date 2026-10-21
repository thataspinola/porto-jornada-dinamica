import { describe, expect, it } from 'vitest'
import { birthDate, cep, cpf, fullName, phone } from '@/validation/fields'

describe('validadores de domínio', () => {
  it.each([
    [cpf, '529.982.247-25', '52998224724'],
    [cep, '01310-100', '01310'],
    [phone, '(11) 99999-8888', '099998888'],
    [fullName, 'Maria da Silva', 'Maria'],
    [birthDate, '10/10/1990', '31/02/2000'],
  ])('aceita formato válido e rejeita inválido', (validator, valid, invalid) => {
    expect(validator(true).safeParse(valid).success).toBe(true)
    expect(validator(true).safeParse(invalid).success).toBe(false)
    expect(validator(true).safeParse('').success).toBe(false)
    expect(validator(false).safeParse('').success).toBe(true)
    expect(validator(false).safeParse(valid).success).toBe(true)
  })

  it.each([
    '',
    '123',
    '11111111111',
    '52998224724',
    '52998224825',
  ])('rejeita CPF %s', (value) =>
    expect(cpf(true).safeParse(value).success).toBe(false))
})
