import { journeyStepSchema } from '@/validation/schemas'
import { buildStepFormSchema } from '@/validation/form'

const checkbox = {
  id: 'check',
  type: 'CHECKBOX',
  config: { name: 'accepted', label: { text: 'Aceito' }, required: true },
}

const textInput = {
  id: 'text',
  type: 'TEXT_INPUT',
  config: { name: 'value', label: 'Valor', required: true },
}

it.each([
  ['SUMMARY_PANEL', { children: [checkbox] }, 'accepted', true],
  ['FIXED_WRAPPER', { children: [textInput] }, 'value', 'test'],
  ['DRAWER', { slug: 'detalhes', bodyChildren: [textInput] }, 'value', 'test'],
  [
    'GRID',
    {
      children: [
        {
          id: 'column',
          type: 'GRID_ITEM',
          config: { colSpan: 12, children: [textInput] },
        },
      ],
    },
    'value',
    'test',
  ],
  [
    'TABS',
    {
      items: [
        {
          label: 'Primeira',
          value: 'first',
          children: [
            {
              id: 'price',
              type: 'PRICE_SELECTOR',
              config: { name: 'value', min: 0, max: 10, step: 1 },
            },
          ],
        },
      ],
    },
    'value',
    1,
  ],
  [
    'FEEDBACK_VIEW',
    {
      title: 'Teste',
      children: [{ id: 'box', type: 'BOX', config: { children: [checkbox] } }],
    },
    'accepted',
    true,
  ],
])(
  '%s inclui os campos descendentes na validação',
  (type, config, name, valid) => {
    const step = journeyStepSchema.parse({
      id: 'step',
      name: 'Teste',
      slug: 'teste',
      elements: [{ id: 'container', type, config }],
    })

    const { schema } = buildStepFormSchema(step)
    expect(Object.keys(schema.shape)).toContain(name)
    expect(schema.safeParse({}).success).toBe(false)
    expect(schema.safeParse({ [String(name)]: valid }).success).toBe(true)
  }
)

it('card composto permanece sem campos e mantém conteúdo visual', () => {
  const step = journeyStepSchema.parse({
    id: 'step',
    name: 'Teste',
    slug: 'teste',
    elements: [
      {
        id: 'card',
        type: 'COMPOSABLE_CARD',
        config: {
          children: [
            {
              id: 'child',
              element: {
                id: 'title',
                type: 'TEXT',
                config: { text: 'Título' },
              },
            },
          ],
        },
      },
    ],
  })

  expect(buildStepFormSchema(step).schema.parse({})).toEqual({})
})
