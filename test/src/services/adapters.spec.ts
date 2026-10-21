import { fetchSelectOptions } from '@/services/optionsService'
it('rejeita fontes não registradas sem inventar opções', async () => {
  expect(await fetchSelectOptions({ source: 'missing' })).toMatchObject({
    success: false,
    error: 'OPTIONS_SOURCE_NOT_REGISTERED',
  })
})
