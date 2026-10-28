import { recaptcha } from '@/utils/recaptchaGenerator'
vi.mock('@/scripts/recaptchaClient', () => ({ RECAPTCHA_KEY: 'test-key' }))
afterEach(() => {
  delete window.grecaptcha
})
it('encaminha a ação à API enterprise', async () => {
  const execute = vi.fn().mockResolvedValue('token')
  window.grecaptcha = { enterprise: { ready: (fn) => fn(), execute } }
  expect(await recaptcha('eligibility')).toBe('token')
  expect(execute).toHaveBeenCalledWith('test-key', { action: 'eligibility' })
})
it('ausência do script nunca produz um token de sucesso', async () =>
  expect(await recaptcha('eligibility')).toBe(''))
