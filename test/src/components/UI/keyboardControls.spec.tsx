import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { Checkbox, CheckboxWithoutState, Dropdown } from '@/components/UI'
import { PriceInput } from '@/components/UI/PriceSelector/components/PriceInput'
import { StepperButton } from '@/components/UI/PriceSelector/components/StepperButton'
import { SliderThumbIcon } from '@/components/UI/PriceSelector/components/SliderThumbIcon'
import { PriceSelectorLayout } from '@/components/UI/PriceSelector/components/PriceSelectorLayout'
import { Icon } from '@/components/UI/Icon'
import { Action } from '@/components/UI/IconContent/components/Action'
import { FixedButtonWrapper } from '@/components/UI/FixedButtonWrapper'
import { FixedWrapper } from '@/components/UI/FixedWrapper'

describe('controles por teclado', () => {
  it.each([
    Checkbox,
    CheckboxWithoutState,
  ])('checkbox aceita Enter/Space, ignora outras teclas e bloqueia quando desabilitado', (Component) => {
    const handleClick = vi.fn()
    const { rerender } = render(
      <Component label="Aceitar" handleClick={handleClick} />
    )
    let checkbox = screen.getByRole('checkbox')
    fireEvent.keyDown(checkbox, { key: 'ArrowDown' })
    expect(handleClick).not.toHaveBeenCalled()
    fireEvent.keyDown(checkbox, { key: 'Enter' })
    expect(handleClick).toHaveBeenCalledWith(true)
    fireEvent.keyDown(checkbox, { key: ' ' })
    expect(handleClick).toHaveBeenCalledTimes(2)
    rerender(<Component label="Aceitar" disabled handleClick={handleClick} />)
    checkbox = screen.getByRole('checkbox')
    expect(checkbox).toHaveAttribute('tabindex', '-1')
    fireEvent.keyDown(checkbox, { key: 'Enter' })
    expect(handleClick).toHaveBeenCalledTimes(2)
  })
  it('dropdown mantém foco e seleciona via Enter/Space', () => {
    const onChange = vi.fn()
    const { container } = render(
      <Dropdown
        label="Opções"
        name="options"
        options={[
          { label: 'A', value: 'a' },
          { label: 'B', value: 'b' },
        ]}
        onChange={onChange}
      />
    )
    const field = screen.getByLabelText('Opções')
    fireEvent.focus(field)
    expect(container.firstChild).toHaveClass('--focused')
    fireEvent.keyDown(field, { key: 'Enter' })
    fireEvent.keyDown(screen.getByText('B'), { key: 'ArrowDown' })
    expect(onChange).not.toHaveBeenCalled()
    fireEvent.keyDown(screen.getByText('B'), { key: ' ' })
    expect(onChange).toHaveBeenCalledWith('b')
    fireEvent.keyDown(field, { key: 'Enter' })
    fireEvent.keyDown(screen.getByText('A'), { key: 'Enter' })
    expect(onChange).toHaveBeenCalledWith('a')
    fireEvent.blur(field)
    expect(container.firstChild).not.toHaveClass('--focused')
  })
  it('input de preço transmite número e botão desabilitado impede ação', () => {
    const onChange = vi.fn(),
      onClick = vi.fn()
    const { rerender } = render(
      <PriceSelectorLayout.Root>
        <PriceInput
          min={0}
          max={1000}
          editable
          value={10}
          onChange={onChange}
        />
        <StepperButton icon="circle-add" label="Mais" onClick={onClick} />
        <SliderThumbIcon />
      </PriceSelectorLayout.Root>
    )
    fireEvent.change(screen.getByLabelText('Valor'), {
      target: { value: '2500' },
    })
    expect(onChange).toHaveBeenCalledWith(25)
    fireEvent.click(screen.getByRole('button', { name: 'Mais' }))
    expect(onClick).toHaveBeenCalledOnce()
    rerender(
      <StepperButton
        icon="circle-add"
        label="Mais"
        onClick={onClick}
        disabled
      />
    )
    fireEvent.click(screen.getByRole('button', { name: 'Mais' }))
    expect(onClick).toHaveBeenCalledOnce()
  })
  it('ícone decorativo fica oculto e ícone informativo tem nome acessível', () => {
    const { rerender, container } = render(
      <Icon icon="placeholder" aria-hidden="true" />
    )
    expect(container.firstChild).toHaveAttribute('aria-hidden', 'true')
    rerender(<Icon icon="placeholder" role="img" aria-label="Porto" />)
    expect(screen.getByRole('img', { name: 'Porto' })).toBeInTheDocument()
  })
  it('ações dentro de containers fixos continuam interativas', () => {
    const onClick = vi.fn()
    render(
      <FixedWrapper>
        <FixedButtonWrapper>
          <Action text="Continuar" onClick={onClick} />
        </FixedButtonWrapper>
      </FixedWrapper>
    )
    fireEvent.click(screen.getByRole('button', { name: 'Continuar' }))
    expect(onClick).toHaveBeenCalledOnce()
  })
})
