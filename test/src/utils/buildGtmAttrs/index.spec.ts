import { buildGtmAttrs } from '@/utils/buildGtmAttrs'
it('diferencia atributos de formulário e botão sem dados extras', () => {
  expect(
    buildGtmAttrs({
      kind: 'format-input',
      stepTitle: 'CPF',
      label: 'Documento',
    })
  ).toMatchObject({
    'data-gtm-type': 'form',
    'data-gtm-name': 'cpf',
    'data-gtm-subname': 'documento',
  })
  expect(
    buildGtmAttrs({ kind: 'button', stepTitle: 'CPF', label: 'Continuar' })[
      'data-gtm-clicktype'
    ]
  ).toBe('button')
})
