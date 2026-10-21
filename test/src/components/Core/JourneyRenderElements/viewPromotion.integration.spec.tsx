import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { readFileSync } from 'node:fs'
import { JourneyBuilder } from '@/components/Core/JourneyBuilder/JourneyBuilder'
import { journeySchema } from '@/validation/schemas'
import { useJourneyStore } from '@/store/journeyStore'
import { ServiceError } from '@/services/types'

const { execute, push } = vi.hoisted(() => ({
  execute: vi.fn(),
  push: vi.fn(),
}))
vi.mock('@/hooks/useJourneyService', () => ({
  useJourneyService: () => ({ executeJourneyService: execute }),
}))
vi.mock('next/navigation', () => ({
  usePathname: () => window.location.pathname,
  useSearchParams: () => new URLSearchParams(),
  useRouter: () => ({ push }),
}))

afterEach(() => useJourneyStore.getState().reset())
it.each([
  'financiamento-de-veiculos',
  'emprestimo-com-garantia-de-veiculo',
])('mostra a negativa CPF e envia uma promoção em %s', async (slug) => {
  window.history.replaceState({}, '', `/contrate/${slug}/cpf`)
  window.dataLayer = []
  useJourneyStore.setState({
    fields: {},
    services: {},
    business: {},
    errors: [],
    _hasHydrated: true,
  })
  const content = JSON.parse(
    readFileSync(`public/jsonContent/${slug}.json`, 'utf8')
  )
  content.product = 'fixture'
  content.steps = [content.steps[0]]
  const service = content.steps[0].elements.find(
    (element: { type: string }) => element.type === 'SERVICE_CALL'
  )
  service.config.service = { action: 'eligibility', module: 'customer' }
  execute.mockRejectedValue(new ServiceError('NOT_ELIGIBLE', 422))
  const journey = journeySchema.parse(content)
  const { rerender } = render(<JourneyBuilder journey={journey} />)
  fireEvent.change(screen.getByLabelText('CPF'), {
    target: { value: '52998224725' },
  })
  await waitFor(() =>
    expect(screen.getByRole('button', { name: 'Continuar' })).toBeEnabled()
  )
  fireEvent.click(screen.getByRole('button', { name: 'Continuar' }))
  await screen.findByText('Empréstimo Consignado')
  expect(screen.getByText('Empréstimo Pessoal')).toBeInTheDocument()
  await waitFor(() =>
    expect(
      window.dataLayer?.filter(
        (event) => (event as { event?: string }).event === 'view_promotion'
      )
    ).toHaveLength(1)
  )
  const promotion = window.dataLayer?.find(
    (event) => (event as { event?: string }).event === 'view_promotion'
  )
  expect(promotion).toMatchObject({
    event: 'view_promotion',
    ev_action: 'ecommerce:visualizar:promocao:sucesso',
    items: [
      expect.objectContaining({ creative_name: 'produtos-recomendados' }),
      expect.objectContaining({ creative_slot: 'cpf-negativa-elegibilidade' }),
    ],
  })
  expect(promotion).not.toHaveProperty('currency')
  expect(promotion).not.toHaveProperty('value')
  rerender(<JourneyBuilder journey={journey} />)
  expect(
    window.dataLayer?.filter(
      (event) => (event as { event?: string }).event === 'view_promotion'
    )
  ).toHaveLength(1)
})
