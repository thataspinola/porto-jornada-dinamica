import { renderHook } from '@testing-library/react'
import { vi } from 'vitest'
import { useJourneyNavigation } from '@/hooks/useJourneyNavigation'

const { push, route } = vi.hoisted(() => ({
  push: vi.fn(),
  route: { path: '/contrate/produto/cpf', query: '' }
}))
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push }),
  usePathname: () => route.path,
  useSearchParams: () => new URLSearchParams(route.query)
}))
beforeEach(() => {
  push.mockClear()
  route.query = ''
})

it('navega entre etapas preservando a base da jornada', () => {
  const { result } = renderHook(useJourneyNavigation)
  result.current.navigateTo('dados')
  expect(push).toHaveBeenCalledWith('/contrate/produto/dados')
})
it('preserva a query e remove somente os parâmetros solicitados', () => {
  route.query = 'campaign=porto&temporary=1'
  const { result } = renderHook(useJourneyNavigation)
  result.current.navigateTo('dados', { removeSearchParams: ['temporary'] })
  expect(push).toHaveBeenCalledWith('/contrate/produto/dados?campaign=porto')
})
it('altera a query sem trocar a etapa', () => {
  route.query = 'keep=1'
  const { result } = renderHook(useJourneyNavigation)
  result.current.navigateTo('?selected=2')
  expect(push).toHaveBeenCalledWith('/contrate/produto/cpf?keep=1&selected=2')
})
it('só retorna quando existe etapa de retorno', () => {
  const { result } = renderHook(useJourneyNavigation)
  result.current.goBack()
  expect(push).not.toHaveBeenCalled()
  result.current.goBack('inicio')
  expect(push).toHaveBeenCalledWith('/contrate/produto/inicio')
})
it('mantém a origem do retorno externo durante a navegação', () => {
  route.query = 'backUrl=https%3A%2F%2Fexample.com%2Freturn'
  const { result } = renderHook(useJourneyNavigation)
  result.current.navigateTo('dados')
  const url = new URL(push.mock.calls[0][0], 'https://example.com')
  expect(url.searchParams.get('backOrigin')).toBe('/contrate/produto/cpf')
  expect(url.searchParams.get('backUrl')).toBe('https://example.com/return')
})
