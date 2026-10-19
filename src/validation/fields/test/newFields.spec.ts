import {
  birthDate,
  cnpj,
  cpf,
  phone,
  fullName,
  cep,
  isMaskedCnpj,
  isMaskedCpf,
  isMaskedPhone,
  isMaskedEmail,
} from '@/validation/fields'

describe('campos normalizados e mascarados', () => {
  it.each([cnpj, cpf, phone, birthDate, cep])(
    'aceita ausência somente quando opcional',
    (factory) => {
      expect(factory(false).safeParse(undefined).success).toBe(true)
      expect(factory(false).safeParse('').success).toBe(true)
      expect(factory(true).safeParse(undefined).success).toBe(false)
      expect(factory(true).safeParse('').success).toBe(false)
      expect(factory(false).safeParse(123).success).toBe(false)
    }
  )

  it('normaliza CNPJ e rejeita repetição e dígitos inválidos', () => {
    expect(cnpj(true).parse('11.222.333/0001-81')).toBe('11222333000181')

    for (const value of [
      '00000000000000',
      '11111111111111',
      '11222333000182',
      '123',
    ])
      expect(cnpj(true).safeParse(value).success).toBe(false)
    // Documento sintético: a implementação também aceita bases alfanuméricas.
    expect(cnpj(true).safeParse('12ABC34501DE35').success).toBe(true)
  })

  it.each([
    [isMaskedCpf, '***.982.247-**', '***982247**'],
    [isMaskedCnpj, '**.222.333/0001-**', '**2223330001**'],
    [isMaskedPhone, '(11) *****-8888', '11*****8888'],
    [isMaskedEmail, 'a***@example.test', 'a***@*.test'],
  ])('exige formato para valores mascarados', (check, valid, invalid) => {
    expect(check(valid)).toBe(true)
    expect(check(invalid)).toBe(false)
    expect(check(undefined)).toBe(false)
    expect(check('texto')).toBe(false)
  })

  it('aceita máscaras completas e rejeita máscaras parciais inválidas', () => {
    expect(cpf(true).parse('***.982.247-**')).toBe('***.982.247-**')
    expect(cnpj(false).parse('**.222.333/0001-**')).toBe('**.222.333/0001-**')
    expect(phone(true).parse('(11) *****-8888')).toBe('(11) *****-8888')
    for (const factory of [cpf, cnpj, phone])
      expect(factory(false).safeParse('*').success).toBe(false)
  })

  it('valida datas ISO, anos bissextos, limites e datas futuras', () => {
    for (const value of ['2000-02-29', '29/02/2000'])
      expect(birthDate(true).safeParse(value).success).toBe(true)

    for (const value of [
      '1900-02-29',
      '1899-12-31',
      '2000-00-01',
      '2000-13-01',
      '2000-01-00',
      '2000-01-32',
      '2999-01-01',
      '12',
    ])
      expect(birthDate(true).safeParse(value).success).toBe(false)
  })

  it('mantém os contratos de telefone e nome completo', () => {
    expect(phone(false).parse('(11) 99999-8888')).toBe('11999998888')
    expect(fullName(true).parse(' Ana Silva ')).toBe('Ana Silva')
    expect(fullName(false).parse('')).toBe('')
    expect(isMaskedEmail('*@')).toBe(false)
    expect(isMaskedEmail('*@@example.test')).toBe(false)
  })
})

it('normaliza letras minúsculas de CNPJ sem aceitar acentos como letras oficiais', () => {
  expect(cnpj(true).parse('12abc34501de35')).toBe('12ABC34501DE35')
  expect(cnpj(true).safeParse('12ÁBC34501DE35').success).toBe(false)
})
