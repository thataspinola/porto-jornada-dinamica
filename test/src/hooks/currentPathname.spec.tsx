import { act, renderHook } from '@testing-library/react'
import { useCurrentPathname } from '@/hooks/useCurrentPathname'
import { NAVIGATE_EVENT } from '@/constants'
const { route } = vi.hoisted(() => ({
  route: { path: '/contrate/produto/cpf' },
}))
vi.mock('next/navigation', () => ({ usePathname: () => route.path }))
it('sincroniza navegação Next e remove os listeners da ponte', () => {
  const remove = vi.spyOn(window, 'removeEventListener')
  const { result, rerender, unmount } = renderHook(useCurrentPathname)
  expect(result.current).toBe('/contrate/produto/cpf')
  route.path = '/contrate/produto/dados'
  rerender()
  expect(result.current).toBe('/contrate/produto/dados')
  act(() => {
    window.history.replaceState({}, '', '/contrate/produto/resumo')
    window.dispatchEvent(new Event(NAVIGATE_EVENT))
  })
  expect(result.current).toBe('/contrate/produto/resumo')
  unmount()
  expect(remove).toHaveBeenCalledWith(NAVIGATE_EVENT, expect.any(Function))
  remove.mockRestore()
})
