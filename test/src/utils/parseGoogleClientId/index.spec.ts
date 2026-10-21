import { resolveGoogleClientId } from '@/utils/parseGoogleClientId'
it('extrai o client ID do cookie GA', () => {
  document.cookie = '_ga=GA1.2.123.456; path=/'
  expect(resolveGoogleClientId()).toBe('123.456')
  document.cookie = '_ga=; max-age=0; path=/'
})
