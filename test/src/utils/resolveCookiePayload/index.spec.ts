import { resolveCookiePayload } from '@/utils/resolveCookiePayload'
it('resolve apenas cookies referenciados no payload', () => {
  const get = vi.fn((name: string) =>
    name === 'id' ? { value: '123' } : undefined
  )
  expect(resolveCookiePayload({ id: '{{cookies.id}}' }, { get })).toEqual({
    id: '123',
  })
  expect(get).toHaveBeenCalledWith('id')
})
