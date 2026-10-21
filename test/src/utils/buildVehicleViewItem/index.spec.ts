import { buildVehicleViewItem } from '@/utils/buildVehicleViewItem'
it('usa dados do veículo e não inventa preço ausente', () => {
  const result = buildVehicleViewItem({
    branchId: 1,
    productName: 'Produto',
    fields: {
      vehicleBrand: 'Marca',
      vehicleModel: 'Modelo',
      vehicleManufacturingYear: 2020,
      vehicleModelYear: 2021,
    },
    withInsurance: false,
    quantity: 1,
  })
  expect(result).toMatchObject({
    item_id: 1,
    item_name: 'Produto',
    item_brand: 'marca',
    item_category: 'marca:modelo:2020-2021',
    affiliation: 'porto',
  })
  expect(result.price).toBeUndefined()
})
