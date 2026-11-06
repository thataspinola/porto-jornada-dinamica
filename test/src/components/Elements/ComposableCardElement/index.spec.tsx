import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import '@/components/Core/JourneyRenderElements'

import { ComposableCardElement } from '@/components/Elements/ComposableCardElement/index'
import type { ComposableCardElementProps } from '@/components/Elements/ComposableCardElement/types'

const navigateTo = vi.fn()

vi.mock('@/hooks/useJourneyNavigation', () => ({
  useJourneyNavigation: () => ({ navigateTo, goBack: vi.fn() })
}))

vi.mock('@/components/Core/JourneyStepForm/context', () => ({
  useJourneyStepForm: () => ({ stepTitle: 'Test Step' })
}))

function createElement(): ComposableCardElementProps['element'] {
  return {
    id: 'composable-card',
    type: 'COMPOSABLE_CARD',
    order: 1,
    config: {
      url: '/seguros/residencial',
      children: [
        {
          id: 'caption',
          element: {
            id: 'caption-text',
            type: 'TEXT',
            order: 0,
            config: {
              text: 'Plano sugerido',
              variant: 'body2',
              color: 'neutral-800',
              weight: 'regular'
            }
          }
        },
        {
          id: 'subtitle',
          element: {
            id: 'subtitle-text',
            type: 'TEXT',
            order: 1,
            config: {
              text: 'Plano {{services.insurance.id}} - Casa',
              variant: 'body2',
              color: 'neutral-800',
              weight: 'regular'
            }
          }
        },
        {
          id: 'title',
          element: {
            id: 'main-text',
            type: 'TEXT',
            order: 2,
            config: {
              text: '{{services.insurance.name}}',
              variant: 'title5',
              color: 'neutral-black'
            }
          }
        },
        {
          id: 'price',
          element: {
            id: 'price-text',
            type: 'TEXT',
            order: 3,
            config: {
              text: '{{services.insurance.installments}}x R$ {{services.insurance.installmentsValue}}',
              variant: 'title2',
              color: 'seguro-900'
            }
          }
        },
        {
          id: 'action',
          element: {
            id: 'action-text',
            type: 'TEXT',
            order: 4,
            config: {
              text: 'Ver coberturas',
              color: 'seguro-900',
              variant: 'body1',
              weight: 'medium'
            }
          }
        }
      ]
    }
  }
}

describe('ComposableCardElement', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders children', () => {
    render(<ComposableCardElement element={createElement()} />)

    expect(screen.getByText('Plano sugerido')).toBeInTheDocument()
    expect(screen.getByText('Ver coberturas')).toBeInTheDocument()
  })

  it('renders action button when url is provided', () => {
    render(<ComposableCardElement element={createElement()} />)

    expect(
      screen.getByRole('button', { name: 'Abrir card' })
    ).toBeInTheDocument()
  })

  it('navigates when action button is clicked', () => {
    render(<ComposableCardElement element={createElement()} />)

    fireEvent.click(screen.getByRole('button', { name: 'Abrir card' }))

    expect(navigateTo).toHaveBeenCalledTimes(1)
    expect(navigateTo).toHaveBeenNthCalledWith(1, '/seguros/residencial')
  })

  it('does not render action button when url is absent', () => {
    const element = createElement()
    const { config, ...rest } = element
    const { url: _url, ...configWithoutUrl } = config

    render(
      <ComposableCardElement element={{ ...rest, config: configWithoutUrl }} />
    )

    expect(
      screen.queryByRole('button', { name: 'Abrir card' })
    ).not.toBeInTheDocument()
  })
})
