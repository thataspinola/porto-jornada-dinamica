import { fireEvent, render, screen } from '@testing-library/react'
import { FormProvider, useForm, useWatch } from 'react-hook-form'
import { vi } from 'vitest'

import { formatPrice } from '@/utils'

vi.mock('@/components/Core/JourneyStepForm/context', () => ({
  useJourneyStepForm: () => ({ stepTitle: 'Test Step' })
}))

import { PriceSelectorElement } from '@/components/Elements/PriceSelectorElement/index'
import type { PriceSelectorElementProps } from '@/components/Elements/PriceSelectorElement/types'

function createElement(
  config: PriceSelectorElementProps['element']['config']
): PriceSelectorElementProps['element'] {
  return {
    id: 'price-selector-element',
    type: 'PRICE_SELECTOR',
    order: 1,
    config
  } as PriceSelectorElementProps['element']
}

function WatchedField({ name }: { name: string }) {
  const value = useWatch({ name })

  return <output data-testid="watched-value">{String(value)}</output>
}

describe('PriceSelectorElement', () => {
  it('uses min as fallback when field value is not a number', () => {
    const element = createElement({
      name: 'price',
      min: 100,
      max: 300,
      step: 50
    })

    function RenderWithForm() {
      const methods = useForm({
        defaultValues: {
          price: ''
        }
      })

      return (
        <FormProvider {...methods}>
          <PriceSelectorElement element={element} />
        </FormProvider>
      )
    }

    render(<RenderWithForm />)

    expect(screen.getByDisplayValue(formatPrice(100))).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Diminuir valor' })
    ).toBeDisabled()
  })

  it('updates form value when user increases and decreases the amount', () => {
    const element = createElement({
      name: 'price',
      min: 100,
      max: 200,
      step: 50
    })

    function RenderWithForm() {
      const methods = useForm({
        defaultValues: {
          price: 100
        }
      })

      return (
        <FormProvider {...methods}>
          <PriceSelectorElement element={element} />
          <WatchedField name="price" />
        </FormProvider>
      )
    }

    render(<RenderWithForm />)

    const increaseButton = screen.getByRole('button', {
      name: 'Aumentar valor'
    })
    const decreaseButton = screen.getByRole('button', {
      name: 'Diminuir valor'
    })

    expect(screen.getByTestId('watched-value')).toHaveTextContent('100')

    fireEvent.click(increaseButton)
    expect(screen.getByTestId('watched-value')).toHaveTextContent('150')

    fireEvent.click(increaseButton)
    expect(screen.getByTestId('watched-value')).toHaveTextContent('200')
    expect(increaseButton).toBeDisabled()

    fireEvent.click(decreaseButton)
    expect(screen.getByTestId('watched-value')).toHaveTextContent('150')
  })

  it('updates form value when user interacts with the slider thumb via keyboard', () => {
    const element = createElement({
      name: 'price',
      min: 100,
      max: 300,
      step: 50
    })

    function RenderWithForm() {
      const methods = useForm({
        defaultValues: {
          price: 100
        }
      })

      return (
        <FormProvider {...methods}>
          <PriceSelectorElement element={element} />
          <WatchedField name="price" />
        </FormProvider>
      )
    }

    render(<RenderWithForm />)

    const sliderThumb = screen.getByRole('slider', { name: 'Selecionar valor' })

    fireEvent.keyDown(sliderThumb, { key: 'ArrowRight', code: 'ArrowRight' })
    expect(screen.getByTestId('watched-value')).toHaveTextContent('150')

    fireEvent.keyDown(sliderThumb, { key: 'ArrowLeft', code: 'ArrowLeft' })
    expect(screen.getByTestId('watched-value')).toHaveTextContent('100')
  })

  it('renders min when initial form value is above max and keeps interactions from min baseline', () => {
    const element = createElement({
      name: 'price',
      min: 100,
      max: 200,
      step: 50
    })

    function RenderWithForm() {
      const methods = useForm({
        defaultValues: {
          price: 500
        }
      })

      return (
        <FormProvider {...methods}>
          <PriceSelectorElement element={element} />
          <WatchedField name="price" />
        </FormProvider>
      )
    }

    render(<RenderWithForm />)

    expect(screen.getByDisplayValue(formatPrice(100))).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Aumentar valor' }))

    expect(screen.getByTestId('watched-value')).toHaveTextContent('150')
  })
})
