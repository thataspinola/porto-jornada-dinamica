import { journeyElementSchema } from '@/validation/schemas'
import { buildStepFormSchema } from '@/validation/form'
import { journeyStepSchema } from '@/validation/schemas'

describe('registry de campos declarativos', () => {
  it.each([
    ['EMAIL_INPUT', 'ana@porto.test', 'inválido'],
    ['NUMERIC_INPUT', '25', ''],
    ['PRICE_SELECTOR', 1000, Infinity],
    ['CHECKBOX', true, false],
    ['TEXT_INPUT', 'Ana', ''],
  ])('valida %s pelo contrato do elemento', (type, valid, invalid) => {
    const element = journeyElementSchema.parse({
      id: 'field',
      type,
      config: {
        name: 'value',
        label: 'Valor',
        required: true,
        min: 0,
        max: 2000,
        step: 1,
      },
    })

    const { schema } = buildStepFormSchema(
      journeyStepSchema.parse({
        id: 'step',
        name: 'Etapa',
        slug: 'etapa',
        elements: [element],
      })
    )

    expect(schema.safeParse({ value: valid }).success).toBe(true)
    expect(schema.safeParse({ value: invalid }).success).toBe(false)
  })
})
