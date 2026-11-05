import { vi } from 'vitest'
import type { JourneyElement } from '@/components/Core/JourneyStepForm/types'
import { validateStepDataQuality } from '@/components/Core/JourneyStepForm/validateStepDataQuality'

const elements = [
  { type: 'EMAIL_INPUT', config: { name: 'email' } },
  { type: 'PHONE_INPUT', config: { name: 'phone' } },
  { type: 'SOCIAL_NAME', config: { name: 'socialName' } },
  { type: 'TEXT', config: { text: 'Informação' } }
] as JourneyElement[]

it('retorna as mensagens na ordem dos campos inválidos', async () => {
  const validate = vi.fn().mockResolvedValue(false)
  await expect(
    validateStepDataQuality(
      elements,
      {
        email: 'email@example.com',
        phone: '11999990000',
        hasSocialName: true,
        socialName: 'Nome'
      },
      validate
    )
  ).resolves.toEqual([
    { fieldName: 'email', message: 'E-mail inválido.' },
    { fieldName: 'phone', message: 'Celular inválido.' },
    { fieldName: 'socialName', message: 'Nome social inválido.' }
  ])
})
it('ignora valores vazios, contatos mascarados e nome social desmarcado', async () => {
  const validate = vi.fn()
  expect(await validateStepDataQuality(elements, {}, validate)).toEqual([])
  expect(
    await validateStepDataQuality(
      elements,
      {
        email: 'e***@example.com',
        phone: '(11) *****-0000',
        hasSocialName: false,
        socialName: 'Nome'
      },
      validate
    )
  ).toEqual([])
  expect(validate).not.toHaveBeenCalled()
})
it('permite prosseguir quando todas as validações passam', async () => {
  const validate = vi.fn().mockResolvedValue(true)
  expect(
    await validateStepDataQuality(
      elements,
      { email: 'email@example.com' },
      validate
    )
  ).toEqual([])
  expect(validate).toHaveBeenCalledExactlyOnceWith('email', 'email@example.com')
})
it('propaga falha do serviço de qualidade para o tratamento existente', async () => {
  const error = new Error('unavailable')
  await expect(
    validateStepDataQuality(
      elements,
      { phone: '11999990000' },
      vi.fn().mockRejectedValue(error)
    )
  ).rejects.toBe(error)
})
