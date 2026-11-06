import { buildVehicleViewItem } from '@/utils/buildVehicleViewItem'

const baseInput = {
  branchId: 20,
  productName: 'emprestimo-com-garantia-de-veiculo',
  withInsurance: true,
  installmentValue: 899.9,
  quantity: 36
}

describe('buildVehicleViewItem', () => {
  it('should build the item from form vehicle fields', () => {
    expect(
      buildVehicleViewItem({
        ...baseInput,
        fields: {
          vehicleBrand: 'Volkswagen',
          vehicleModel: 'Gol 1.0',
          vehicleManufacturingYear: '2020',
          vehicleModelYear: '2021',
          vehicleValue: 45000
        }
      })
    ).toEqual({
      item_id: 20,
      item_name: 'emprestimo-com-garantia-de-veiculo',
      item_category: 'volkswagen:gol-10:2020-2021',
      item_brand: 'volkswagen',
      item_variant: 'tipo-veiculo:seguro|valor-veiculo:45000',
      price: 899.9,
      quantity: 36,
      affiliation: 'porto'
    })
  })

  it('should fall back to standardVehicle when plate data is missing', () => {
    expect(
      buildVehicleViewItem({
        ...baseInput,
        withInsurance: false,
        fields: {
          vehicleValue: 30000
        },
        standardVehicle: {
          brand: 'Fiat',
          model: 'Mobi Like',
          manufacturingYear: '2019',
          modelYear: '2020'
        }
      })
    ).toEqual({
      item_id: 20,
      item_name: 'emprestimo-com-garantia-de-veiculo',
      item_category: 'fiat:mobi-like:2019-2020',
      item_brand: 'fiat',
      item_variant: 'tipo-veiculo:nao-seguro|valor-veiculo:30000',
      price: 899.9,
      quantity: 36,
      affiliation: 'porto'
    })
  })

  it('should prefer form fields over standardVehicle', () => {
    const item = buildVehicleViewItem({
      ...baseInput,
      fields: {
        vehicleBrand: 'Honda',
        vehicleModel: 'Civic',
        vehicleManufacturingYear: '2022',
        vehicleModelYear: '2023',
        vehicleValue: 90000
      },
      standardVehicle: {
        brand: 'Fiat',
        model: 'Mobi Like',
        manufacturingYear: '2019',
        modelYear: '2020'
      }
    })

    expect(item.item_category).toBe('honda:civic:2022-2023')
    expect(item.item_brand).toBe('honda')
  })

  it('should append financial protection and installment fields for purchase', () => {
    expect(
      buildVehicleViewItem({
        ...baseInput,
        quantity: 1,
        installments: 36,
        includeFinancialProtection: true,
        fields: {
          vehicleBrand: 'Renault',
          vehicleModel: 'Duster',
          vehicleManufacturingYear: '2021',
          vehicleModelYear: '2022',
          vehicleValue: 60789.4
        }
      })
    ).toEqual({
      item_id: 20,
      item_name: 'emprestimo-com-garantia-de-veiculo',
      item_category: 'renault:duster:2021-2022',
      item_brand: 'renault',
      item_variant:
        'tipo-veiculo:seguro|valor-veiculo:60789.4|protecao-financeira:sim',
      price: 899.9,
      quantity: 1,
      installments: 36,
      installment_value: 899.9,
      affiliation: 'porto'
    })
  })
})
