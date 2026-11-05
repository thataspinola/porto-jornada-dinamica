import {
  buildInitialAddressFields,
  formatAddressOption,
  normalizeResidentialAddress,
  resolveAddressSource,
  shouldInitializeAddress
} from './addressRadio'

const address = {
  addressZipCode: '01205-000',
  addressStreetName: 'Av. Rio Branco',
  addressNumber: '182',
  addressNeighborhood: 'Campos Elíseos',
  addressCity: 'São Paulo',
  addressState: 'SP'
}

describe('addressRadio', () => {
  it('maps the residential address to editable journey fields', () => {
    expect(buildInitialAddressFields(address, 'enderecoSelecionado')).toEqual({
      addressZipCode: '01205-000',
      addressStreetName: 'Av. Rio Branco',
      addressNeighborhood: 'Campos Elíseos',
      addressNumber: '182',
      addressCity: 'São Paulo',
      addressState: 'SP',
      enderecoSelecionado: '01205-000|Av. Rio Branco|182|São Paulo|SP'
    })
  })

  it('does not replace an address already initialized with the same key', () => {
    expect(shouldInitializeAddress('address-key-1', 'address-key-1')).toBe(
      false
    )
    expect(shouldInitializeAddress('address-key-2', 'address-key-1')).toBe(true)
  })

  it('formats the current edited fields instead of the prefetch response', () => {
    expect(
      formatAddressOption([
        '01205-000|Rua Nova|25|Santos|SP',
        'Rua Nova',
        '25',
        '',
        'Centro',
        'Santos',
        'SP'
      ])
    ).toEqual({
      value: '01205-000|Rua Nova|25|Santos|SP',
      label: 'Rua Nova, 25',
      description: 'Centro - Santos - SP'
    })
  })

  it('normalizes root location aliases into CEP field names', () => {
    expect(
      normalizeResidentialAddress({
        zipcode: '04012090',
        address: 'R Dr Amâncio de Carvalho',
        neighborhood: 'Vila Mariana',
        addressNumber: '23',
        complement: '',
        city: 'São Paulo',
        state: 'SP'
      })
    ).toEqual({
      addressZipCode: '04012090',
      addressStreetName: 'R Dr Amâncio de Carvalho',
      addressNeighborhood: 'Vila Mariana',
      addressNumber: '23',
      addressCity: 'São Paulo',
      addressState: 'SP',
      addressAdditionalInfo: ''
    })
  })

  it('prefers the first sourcePath with content and falls back when empty', () => {
    const parameters = {
      location: {
        zipcode: '04012090',
        address: 'R Dr Amâncio de Carvalho',
        neighborhood: 'Vila Mariana',
        addressNumber: '23',
        city: 'São Paulo',
        state: 'SP'
      },
      products: {
        residential: {
          location: {
            addressZipCode: '01001000',
            addressStreetName: 'Rua Batatais',
            addressNeighborhood: 'Centro',
            addressNumber: '100',
            addressCity: 'São Paulo',
            addressState: 'SP'
          }
        }
      }
    }

    expect(
      resolveAddressSource(parameters, [
        'location',
        'products.residential.location'
      ])?.addressZipCode
    ).toBe('04012090')

    expect(
      resolveAddressSource(
        {
          location: {},
          products: parameters.products
        },
        ['location', 'products.residential.location']
      )?.addressStreetName
    ).toBe('Rua Batatais')
  })
})
