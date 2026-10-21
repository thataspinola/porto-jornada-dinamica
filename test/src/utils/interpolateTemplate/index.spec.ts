import { interpolateTemplate } from '@/utils/interpolateTemplate/index'
test('interpolateTemplate: transforma entrada sem incluir dados extras', () => {
  expect(
    interpolateTemplate('Olá {{ user.name }}', { user: { name: 'Ana' } })
  ).toEqual('Olá Ana')
})
