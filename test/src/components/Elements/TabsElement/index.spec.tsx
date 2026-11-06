import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FormProvider, useForm, useWatch } from 'react-hook-form'

import { TabsElement } from '@/components/Elements/TabsElement/index'
import type { TabsElementProps } from '@/components/Elements/TabsElement/types'

vi.mock('@/components/Core/JourneyRenderElements/renderJourneyElement', () => ({
  renderJourneyElement: (child: { id: string }) => (
    <div data-testid={`child-${child.id}`}>{child.id}</div>
  )
}))

function createElement(
  config: TabsElementProps['element']['config']
): TabsElementProps['element'] {
  return {
    id: 'tabs-element',
    type: 'TABS',
    order: 1,
    config
  } as TabsElementProps['element']
}

function createPriceSelectorChild(id: string, name: string) {
  return {
    id,
    type: 'PRICE_SELECTOR' as const,
    order: 1,
    config: {
      name,
      min: 100,
      max: 300,
      step: 50
    }
  }
}

function WatchedField({ name }: { name: string }) {
  const value = useWatch({ name })

  return <output data-testid="watched-tab">{String(value)}</output>
}

describe('TabsElement', () => {
  it('switches content using local state when name is not provided', async () => {
    const element = createElement({
      items: [
        {
          label: 'Primeira',
          value: 'first',
          children: [createPriceSelectorChild('child-a', 'priceA')]
        },
        {
          label: 'Segunda',
          value: 'second',
          children: [createPriceSelectorChild('child-b', 'priceB')]
        }
      ]
    })

    function RenderWithForm() {
      const methods = useForm()

      return (
        <FormProvider {...methods}>
          <TabsElement element={element} />
        </FormProvider>
      )
    }

    render(<RenderWithForm />)

    expect(screen.getByTestId('child-child-a')).toBeInTheDocument()
    expect(screen.queryByTestId('child-child-b')).not.toBeInTheDocument()

    const user = userEvent.setup()

    await user.click(screen.getByRole('tab', { name: 'Segunda' }))

    expect(screen.getByTestId('child-child-b')).toBeInTheDocument()
    expect(screen.queryByTestId('child-child-a')).not.toBeInTheDocument()
  })

  it('reads and updates the form field when name is provided', async () => {
    const element = createElement({
      name: 'selectedTab',
      items: [
        {
          label: 'Primeira',
          value: 'first',
          children: [createPriceSelectorChild('child-a', 'priceA')]
        },
        {
          label: 'Segunda',
          value: 'second',
          children: [createPriceSelectorChild('child-b', 'priceB')]
        }
      ]
    })

    function RenderWithForm() {
      const methods = useForm({
        defaultValues: {
          selectedTab: 'second'
        }
      })

      return (
        <FormProvider {...methods}>
          <TabsElement element={element} />
          <WatchedField name="selectedTab" />
        </FormProvider>
      )
    }

    render(<RenderWithForm />)

    expect(screen.getByTestId('child-child-b')).toBeInTheDocument()
    expect(screen.getByTestId('watched-tab')).toHaveTextContent('second')

    const user = userEvent.setup()

    await user.click(screen.getByRole('tab', { name: 'Primeira' }))

    expect(screen.getByTestId('child-child-a')).toBeInTheDocument()
    expect(screen.getByTestId('watched-tab')).toHaveTextContent('first')
  })

  it('falls back to the first tab when form value does not match any tab item', () => {
    const element = createElement({
      name: 'selectedTab',
      items: [
        {
          label: 'Primeira',
          value: 'first',
          children: [createPriceSelectorChild('child-a', 'priceA')]
        },
        {
          label: 'Segunda',
          value: 'second',
          children: [createPriceSelectorChild('child-b', 'priceB')]
        }
      ]
    })

    function RenderWithForm() {
      const methods = useForm({
        defaultValues: {
          selectedTab: 'unknown'
        }
      })

      return (
        <FormProvider {...methods}>
          <TabsElement element={element} />
        </FormProvider>
      )
    }

    render(<RenderWithForm />)

    expect(screen.getByTestId('child-child-a')).toBeInTheDocument()
    expect(screen.queryByTestId('child-child-b')).not.toBeInTheDocument()
  })

  it('does not render content wrapper when active tab has no children', () => {
    const element = createElement({
      items: [
        {
          label: 'Primeira',
          value: 'first',
          children: []
        },
        {
          label: 'Segunda',
          value: 'second',
          children: [createPriceSelectorChild('child-b', 'priceB')]
        }
      ]
    })

    function RenderWithForm() {
      const methods = useForm()

      return (
        <FormProvider {...methods}>
          <TabsElement element={element} />
        </FormProvider>
      )
    }

    render(<RenderWithForm />)

    expect(screen.queryByTestId('child-child-b')).not.toBeInTheDocument()
    expect(screen.queryByTestId('child-child-a')).not.toBeInTheDocument()
  })
})
