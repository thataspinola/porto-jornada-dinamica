import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { JourneyBuilder } from '@/components/Core/JourneyBuilder/JourneyBuilder'
import { journeySchema } from '@/validation/schemas'
import { useJourneyStore } from '@/store/journeyStore'
const { execute } = vi.hoisted(() => ({ execute: vi.fn() }))
vi.mock('@/hooks/useJourneyService', () => ({
  useJourneyService: () => ({ executeJourneyService: execute }),
}))
vi.mock('next/navigation', () => ({
  usePathname: () => '/contrate/fixture/cpf',
  useSearchParams: () => new URLSearchParams(),
  useRouter: () => ({ push: vi.fn() }),
}))
it('CPF inválido impede envio ao serviço', async () => {
  execute.mockClear()
  window.history.replaceState({}, '', '/contrate/fixture/cpf')
  useJourneyStore.setState({
    fields: {},
    business: {},
    services: {},
    errors: [],
    _hasHydrated: true,
  })
  const journey = journeySchema.parse({
    id: 'fixture',
    name: 'Fixture',
    slug: 'fixture',
    product: 'fixture',
    steps: [
      {
        id: 'cpf',
        name: 'CPF',
        slug: 'cpf',
        elements: [
          {
            id: 'cpf',
            type: 'CPF_INPUT',
            config: { name: 'taxvat', label: 'CPF', required: true },
          },
          {
            id: 'send',
            type: 'SERVICE_CALL',
            config: {
              label: 'Continuar',
              service: { module: 'customer', action: 'eligibility' },
              targetStepOnSuccess: 'dados',
            },
          },
        ],
      },
    ],
  })
  render(<JourneyBuilder journey={journey} />)
  fireEvent.change(screen.getByLabelText('CPF'), {
    target: { value: '11111111111' },
  })
  await waitFor(() =>
    expect(screen.getByRole('button', { name: 'Continuar' })).toBeDisabled()
  )
  fireEvent.click(screen.getByRole('button', { name: 'Continuar' }))
  expect(execute).not.toHaveBeenCalled()
})
