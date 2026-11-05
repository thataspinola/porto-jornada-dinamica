import { fireEvent, render, screen } from '@testing-library/react'

import { formatPrice } from '@/utils'

import { PriceSelector } from './index'

describe('PriceSelector', () => {
  it('always renders values formatted as BRL', () => {
    render(
      <PriceSelector
        value={200}
        min={100}
        max={400}
        step={100}
        onChange={() => {}}
      />
    )

    expect(screen.getByDisplayValue(formatPrice(200))).toBeInTheDocument()
    expect(screen.getByText(`R$ ${formatPrice(100)}`)).toBeInTheDocument()
    expect(screen.getByText(`R$ ${formatPrice(400)}`)).toBeInTheDocument()
  })

  it('calls onChange with increased value when clicking increase button', () => {
    const onChange = vi.fn()

    render(
      <PriceSelector
        value={100}
        min={0}
        max={300}
        step={50}
        onChange={onChange}
      />
    )

    fireEvent.click(screen.getByRole('button', { name: 'Aumentar valor' }))

    expect(onChange).toHaveBeenCalledWith(150)
  })

  it('calls onChange with decreased value when clicking decrease button', () => {
    const onChange = vi.fn()

    render(
      <PriceSelector
        value={200}
        min={0}
        max={300}
        step={50}
        onChange={onChange}
      />
    )

    fireEvent.click(screen.getByRole('button', { name: 'Diminuir valor' }))

    expect(onChange).toHaveBeenCalledWith(150)
  })

  it('disables decrease button when value is at min', () => {
    render(
      <PriceSelector
        value={100}
        min={100}
        max={300}
        step={50}
        onChange={() => {}}
      />
    )

    expect(
      screen.getByRole('button', { name: 'Diminuir valor' })
    ).toBeDisabled()
  })

  it('clamps values below min before rendering and interactions', () => {
    const onChange = vi.fn()

    render(
      <PriceSelector
        value={50}
        min={100}
        max={300}
        step={50}
        onChange={onChange}
      />
    )

    expect(screen.getByDisplayValue(formatPrice(100))).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Diminuir valor' })
    ).toBeDisabled()

    fireEvent.click(screen.getByRole('button', { name: 'Aumentar valor' }))

    expect(onChange).toHaveBeenCalledWith(150)
  })

  it('disables increase button when value is at max', () => {
    render(
      <PriceSelector
        value={300}
        min={100}
        max={300}
        step={50}
        onChange={() => {}}
      />
    )

    expect(
      screen.getByRole('button', { name: 'Aumentar valor' })
    ).toBeDisabled()
  })

  it('resets values above max to min before rendering and interactions', () => {
    const onChange = vi.fn()

    render(
      <PriceSelector
        value={500}
        min={100}
        max={300}
        step={50}
        onChange={onChange}
      />
    )

    expect(screen.getByDisplayValue(formatPrice(100))).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Aumentar valor' }))

    expect(onChange).toHaveBeenCalledWith(150)
  })

  it('exposes compound parts', () => {
    expect(PriceSelector.Root).toBeDefined()
    expect(PriceSelector.Stepper).toBeDefined()
    expect(PriceSelector.StepperButton).toBeDefined()
    expect(PriceSelector.Input).toBeDefined()
    expect(PriceSelector.Bottom).toBeDefined()
    expect(PriceSelector.Slider).toBeDefined()
    expect(PriceSelector.Bounds).toBeDefined()
  })
})
