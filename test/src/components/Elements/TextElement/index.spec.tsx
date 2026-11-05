import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'

import { TextElement } from '@/components/Elements/TextElement/index'
import type { TextElementProps } from '@/components/Elements/TextElement/types'

const mockText = vi.fn(({ text }: { text: string }) => (
  <div data-testid="text-element">{text}</div>
))

vi.mock('@/components/UI/Text/Text', () => ({
  Text: (props: {
    text: string
    style?: unknown
    variant?: string
    color?: string
    weight?: string
  }) => {
    mockText(props)
    return <div data-testid="text-element">{props.text}</div>
  }
}))

describe('TextElement', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('forwards the expected text structure to UI Text', () => {
    const element: TextElementProps['element'] = {
      id: 'text-1',
      type: 'TEXT',
      order: 1,
      config: {
        text: 'Ola, {{fields.name}}',
        variant: 'body1',
        color: 'neutral-800',
        weight: 'regular',
        cssProperties: { marginBottom: 24 }
      }
    }

    render(<TextElement element={element} />)

    expect(screen.getByTestId('text-element')).toHaveTextContent(
      'Ola, {{fields.name}}'
    )
    expect(mockText).toHaveBeenCalledWith(
      expect.objectContaining({
        text: 'Ola, {{fields.name}}',
        variant: 'body1',
        color: 'neutral-800',
        weight: 'regular',
        style: { marginBottom: 24 }
      })
    )
  })
})
