import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'

const mockTypography = vi.fn(
  ({ children, ...props }: Record<string, unknown>) => (
    <p {...props}>{children as string}</p>
  )
)

vi.mock('@porto-stack/ui', () => ({
  Typography: (props: Record<string, unknown>) => mockTypography(props)
}))

import { Text } from '@/components/UI/Text/Text'

const mockUseJourneyStore = vi.fn()

vi.mock('@/store/journeyStore', () => ({
  useJourneyStore: (selector?: (state: unknown) => unknown) => {
    const state = mockUseJourneyStore()
    return typeof selector === 'function' ? selector(state) : state
  }
}))

describe('Text', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    mockUseJourneyStore.mockReturnValue({
      fields: {},
      services: {},
      business: {},
      parameters: {}
    })
  })

  it('renders text with default element', () => {
    render(<Text text="Conteudo de teste" />)

    const renderedText = screen.getByText('Conteudo de teste')

    expect(renderedText).toBeInTheDocument()
    expect(renderedText.tagName).toBe('P')
  })

  it('interpolates text when interpolation context is provided', () => {
    mockUseJourneyStore.mockReturnValue({
      fields: { name: 'Maria' },
      services: {},
      business: {},
      parameters: {}
    })

    render(<Text text="Ola, {{fields.name}}" />)

    expect(screen.getByText('Ola, Maria')).toBeInTheDocument()
  })

  it('keeps missing placeholders in the text', () => {
    mockUseJourneyStore.mockReturnValue({
      fields: {},
      services: {},
      business: {},
      parameters: {}
    })

    render(<Text text="Produto: {{business.product}}" />)

    expect(
      screen.getByText('Produto: {{business.product}}')
    ).toBeInTheDocument()
  })

  it('allows overriding the rendered HTML tag', () => {
    render(<Text text="Texto inline" as="span" />)

    const typographyProps = mockTypography.mock.calls[0]?.[0] as {
      as: string
    }

    expect(typographyProps.as).toBe('span')
  })
})
