import { addressRadio } from '@/components/Elements/AddressRadioElement/addressRadio'
test('formata endereço sem partes ausentes', () =>
  expect(addressRadio({ id: '1', street: 'Rua A', city: 'São Paulo' })).toEqual(
    { value: '1', label: 'Rua A, São Paulo' }
  ))
