import { fireEvent, render, screen } from '@testing-library/react'
import { vi } from 'vitest'

import { Header } from './Header'

describe('<Header />', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render back arrow and logo by default', () => {
    render(<Header />)

    expect(
      screen.getByRole('button', { name: 'Voltar para página anterior' })
    ).toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: 'Ir para o carrinho de compras' })
    ).not.toBeInTheDocument()
  })

  it('should render shopping cart when hasShoppingCart is true', () => {
    render(<Header hasShoppingCart />)

    expect(
      screen.getByRole('button', { name: 'Ir para o carrinho de compras' })
    ).toBeInTheDocument()
  })

  it('should not render shopping cart when hasShoppingCart is false', () => {
    render(<Header hasShoppingCart={false} />)

    expect(
      screen.queryByRole('button', { name: 'Ir para o carrinho de compras' })
    ).not.toBeInTheDocument()
  })

  it('should call handleGoBack when clicking the back arrow', () => {
    const handleGoBack = vi.fn()
    render(<Header handleGoBack={handleGoBack} />)

    fireEvent.click(
      screen.getByRole('button', { name: 'Voltar para página anterior' })
    )

    expect(handleGoBack).toHaveBeenCalledTimes(1)
  })

  it('should not throw when clicking the back arrow without handleGoBack', () => {
    render(<Header />)

    expect(() =>
      fireEvent.click(
        screen.getByRole('button', { name: 'Voltar para página anterior' })
      )
    ).not.toThrow()
  })

  it('should render the root as a <header> element', () => {
    const { container } = render(<Header />)

    expect(container.querySelector('header')).toBeInTheDocument()
  })
})
