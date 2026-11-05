'use client'
import {
  IconArrowLeft,
  IconLogoPorto,
  IconShoppingCart
} from '@porto-stack/icons'

import s from './Header.module.scss'

export type HeaderProps = {
  handleGoBack?: () => void
  hasShoppingCart?: boolean
  variant?: 'app' | 'web'
}

export function Header({
  handleGoBack,
  hasShoppingCart = false,
  variant = 'web'
}: HeaderProps) {
  return (
    <header className={s.container} data-variant={variant}>
      <button
        type="button"
        onClick={handleGoBack}
        aria-label="Voltar para página anterior"
        className={s.goBackButton}>
        <IconArrowLeft size={24} color="seguro-900" />
      </button>

      <IconLogoPorto
        className={s.logo}
        height={28}
        role="img"
        aria-label="Porto"
      />

      {hasShoppingCart && (
        <button
          type="button"
          aria-label="Ir para o carrinho de compras"
          className={s.shoppingCartButton}>
          <IconShoppingCart size={24} color="seguro-900" />
        </button>
      )}
    </header>
  )
}
