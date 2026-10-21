import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useRemoteQuery } from '@/hooks/queries/useRemoteQuery'
const { execute } = vi.hoisted(() => ({ execute: vi.fn() }))
vi.mock('@/hooks/useJourneyService', () => ({
  useJourneyService: () => ({ executeJourneyService: execute }),
}))
it('consulta pelo contrato de produto, módulo e ação e respeita cache', async () => {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  execute.mockResolvedValue({ success: true, data: ['resultado'] })
  const input = {
    product: 'fixture',
    module: 'support',
    action: 'search',
    recaptchaAction: 'search',
    fields: {},
  }
  const { result, unmount } = renderHook(
    () => useRemoteQuery<string[]>(input),
    {
      wrapper: ({ children }) => (
        <QueryClientProvider client={client}>{children}</QueryClientProvider>
      ),
    }
  )
  await waitFor(() => expect(result.current.data).toEqual(['resultado']))
  expect(execute).toHaveBeenCalledWith(input)
  unmount()
  client.clear()
})
