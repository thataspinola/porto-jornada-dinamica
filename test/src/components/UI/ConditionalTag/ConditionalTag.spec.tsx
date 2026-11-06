import { render, screen } from '@testing-library/react'

import { ConditionalTag } from '@/components/UI/ConditionalTag/ConditionalTag'
import type { ConditionalTagRule } from '@/components/UI/ConditionalTag/types'

const rules: ConditionalTagRule[] = [
  {
    label: 'Aprovado',
    variant: 'green',
    negative: true,
    when: { field: 'customer.status', equals: 'approved' }
  },
  {
    label: 'Pendente',
    variant: 'yellow',
    when: { field: 'customer.status', notEquals: 'approved' }
  }
]

describe('ConditionalTag', () => {
  it('renders children directly when no rules are provided', () => {
    render(<ConditionalTag variant="green">Direct</ConditionalTag>)

    expect(screen.getByText('Direct')).toBeInTheDocument()
  })

  it('renders the matched rule label over children', () => {
    render(
      <ConditionalTag
        conditionalRules={rules}
        fields={{ customer: { status: 'approved' } }}
      >
        Fallback
      </ConditionalTag>
    )

    expect(screen.getByText('Aprovado')).toBeInTheDocument()
    expect(screen.queryByText('Fallback')).not.toBeInTheDocument()
  })

  it('resolves a notEquals rule when the value differs', () => {
    render(
      <ConditionalTag
        conditionalRules={rules}
        fields={{ customer: { status: 'pending' } }}
      />
    )

    expect(screen.getByText('Pendente')).toBeInTheDocument()
  })

  it('falls back to children when rules exist but none match', () => {
    render(
      <ConditionalTag
        conditionalRules={[
          {
            label: 'Never',
            when: { field: 'status', equals: 'x' }
          }
        ]}
        fields={{ status: 'y' }}
      >
        Fallback
      </ConditionalTag>
    )

    expect(screen.getByText('Fallback')).toBeInTheDocument()
  })

  it('renders nothing when there is no resolved label nor children', () => {
    const { container } = render(
      <ConditionalTag
        conditionalRules={[
          {
            label: 'Never',
            when: { field: 'status', equals: 'x' }
          }
        ]}
        fields={{ status: 'y' }}
      />
    )

    expect(container).toBeEmptyDOMElement()
  })

  it('interpolates the label through resolveLabel', () => {
    render(
      <ConditionalTag
        conditionalRules={[
          {
            label: 'Olá, {{name}}',
            when: { field: 'ready', equals: true }
          }
        ]}
        fields={{ ready: true }}
        resolveLabel={(template) => template?.replace('{{name}}', 'Maria')}
      />
    )

    expect(screen.getByText('Olá, Maria')).toBeInTheDocument()
  })

  it('forwards extra Tag props to the rendered tag', () => {
    render(
      <ConditionalTag data-testid="tag" variant="green">
        Direct
      </ConditionalTag>
    )

    expect(screen.getByTestId('tag')).toBeInTheDocument()
  })
})
