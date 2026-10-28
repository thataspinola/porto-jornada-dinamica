import { getMarketingParams } from '@/utils/getMarketingParams/index'
test('getMarketingParams: transforma entrada sem incluir dados extras', () => {
  expect(getMarketingParams('?utm_source=porto&secret=x')).toEqual({
    utmSource: 'porto',
  })
})
