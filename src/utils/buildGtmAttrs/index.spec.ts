import { buildGtmAttrs } from '.'

describe('buildGtmAttrs', () => {
  it('should build attrs for a form input (card 2)', () => {
    expect(
      buildGtmAttrs({
        kind: 'form-input',
        stepTitle: 'Dados Pessoais',
        label: 'Nome completo'
      })
    ).toEqual({
      'data-gtm-type': 'form',
      'data-gtm-form': 'input',
      'data-gtm-name': 'dados-pessoais',
      'data-gtm-subname': 'nome-completo'
    })
  })

  it('should build attrs for a button (card 4)', () => {
    expect(
      buildGtmAttrs({
        kind: 'button',
        stepTitle: 'Simulação',
        label: 'Continuar'
      })
    ).toEqual({
      'data-gtm-type': 'click',
      'data-gtm-clicktype': 'button',
      'data-gtm-name': 'simulacao',
      'data-gtm-subname': 'continuar'
    })
  })

  it('should compose clicktype and subname for a generic click component (card 5)', () => {
    expect(
      buildGtmAttrs({
        kind: 'click-component',
        stepTitle: 'Escolha o plano',
        componentName: 'plan-card',
        target: 'self',
        title: 'Plano Basico',
        subtitle: 'R$ 199,90',
        label: 'selecionar'
      })
    ).toEqual({
      'data-gtm-type': 'click',
      'data-gtm-clicktype': 'plan-card-self',
      'data-gtm-name': 'escolha-o-plano',
      'data-gtm-subname': 'plano-basico:r-19990:selecionar'
    })
  })

  it('should default click-component target to "self" when omitted', () => {
    const attrs = buildGtmAttrs({
      kind: 'click-component',
      stepTitle: 'x',
      componentName: 'address-card',
      label: 'endereco'
    })
    expect(attrs['data-gtm-clicktype']).toBe('address-card-self')
  })

  it('should skip missing subname parts', () => {
    const attrs = buildGtmAttrs({
      kind: 'click-component',
      stepTitle: 'x',
      componentName: 'card',
      title: undefined,
      subtitle: '',
      label: 'ver-dados-pessoais'
    })
    expect(attrs['data-gtm-subname']).toBe('ver-dados-pessoais')
  })
})
