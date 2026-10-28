import { renderHook } from '@testing-library/react'
import { useJourneyNavigation } from '@/hooks/useJourneyNavigation'
const { push, route } = vi.hoisted(() => ({
  push: vi.fn(),
  route: { path: '/contrate/produto/cpf', query: '' },
}))
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push }),
  usePathname: () => route.path,
  useSearchParams: () => new URLSearchParams(route.query),
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
it('preserva query e remove somente parâmetros solicitados', () => {
  route.query = 'campaign=porto&temporary=1'
  const { result } = renderHook(useJourneyNavigation)
  result.current.navigateTo('dados', { removeSearchParams: ['temporary'] })
  expect(push).toHaveBeenCalledWith('/contrate/produto/dados?campaign=porto')
})
it('atualiza query sem trocar etapa', () => {
  route.query = 'keep=1'
  const { result } = renderHook(useJourneyNavigation)
  result.current.navigateTo('?selected=2')
  expect(push).toHaveBeenCalledWith('/contrate/produto/cpf?keep=1&selected=2')
})
it('retorno ausente não altera a rota', () => {
  const { result } = renderHook(useJourneyNavigation)
  result.current.goBack()
  expect(push).not.toHaveBeenCalled()
  result.current.goBack('inicio')
  expect(push).toHaveBeenCalledWith('/contrate/produto/inicio')
})
