import { formatPrice } from '@/utils/formatPrice/index'
test('formatPrice: transforma entrada sem incluir dados extras', () => {
  expect(formatPrice(12.5)).toEqual('12,50')
})
