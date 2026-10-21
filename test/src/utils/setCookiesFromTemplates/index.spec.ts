import Cookies from 'js-cookie'
import { setCookiesFromTemplates } from '@/utils/setCookiesFromTemplates'
vi.mock('js-cookie', () => ({ default: { set: vi.fn() } }))
it('resolve templates antes de delegar a gravação de cookie', () => {
  setCookiesFromTemplates({ campaign: '{{value}}' }, { value: 'porto' })
  expect(Cookies.set).toHaveBeenCalledWith(
    'campaign',
    'porto',
    expect.objectContaining({ secure: true, sameSite: 'lax' })
  )
})
