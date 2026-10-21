import { redirectTo } from '@/utils/redirectTo'
afterEach(() => vi.unstubAllGlobals())
it('preserva a base da jornada para slugs e usa a URL externa informada', () => {
  const assign = vi.fn()
  vi.stubGlobal('window', {
    location: { pathname: '/contrate/produto/cpf', assign },
  })
  redirectTo('dados')
  expect(assign).toHaveBeenCalledWith('/contrate/produto/dados')
  redirectTo('https://example.test/produto')
  expect(assign).toHaveBeenCalledWith('https://example.test/produto')
})
