import { render, screen } from '@testing-library/react'

import { Tabs } from '@/components/UI/Tabs/index'

describe('Tabs', () => {
  it('renders list and triggers with tab semantics', () => {
    render(
      <Tabs.Root defaultValue="tab-1">
        <Tabs.List>
          <Tabs.Trigger value="tab-1">Tab 1</Tabs.Trigger>
          <Tabs.Trigger value="tab-2">Tab 2</Tabs.Trigger>
        </Tabs.List>
      </Tabs.Root>
    )

    expect(screen.getByRole('tablist')).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'Tab 1' })).toHaveAttribute(
      'aria-selected',
      'true'
    )
    expect(screen.getByRole('tab', { name: 'Tab 2' })).toHaveAttribute(
      'aria-selected',
      'false'
    )
  })

  it('renders content and forwards props/className', () => {
    render(
      <Tabs.Root className="custom-root" defaultValue="tab-1">
        <Tabs.List className="custom-list" data-testid="tabs-list" />
        <Tabs.Content
          value="tab-1"
          className="custom-content"
          data-testid="tabs-content"
        >
          Conteudo
        </Tabs.Content>
      </Tabs.Root>
    )

    expect(screen.getByTestId('tabs-list')).toHaveClass('custom-list')
    expect(screen.getByTestId('tabs-content')).toHaveClass('custom-content')
    expect(screen.getByText('Conteudo')).toBeInTheDocument()
  })

  it('exposes compound parts', () => {
    expect(Tabs.Root).toBeDefined()
    expect(Tabs.List).toBeDefined()
    expect(Tabs.Trigger).toBeDefined()
    expect(Tabs.Content).toBeDefined()
  })
})
