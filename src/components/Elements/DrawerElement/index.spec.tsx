import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { JourneyDefinition } from '@/validation/schemas'

import { DrawerElement } from '.'

const { renderJourneyElement, replace } = vi.hoisted(() => ({
  renderJourneyElement: vi.fn((child) => child.id),
  replace: vi.fn()
}))

vi.mock('next/navigation', () => ({
  usePathname: () => window.location.pathname,
  useRouter: () => ({ replace }),
  useSearchParams: () => new URLSearchParams(window.location.search)
}))

vi.mock('@/components/Core/JourneyRenderElements/renderJourneyElement', () => ({
  renderJourneyElement
}))

type DrawerDefinition = Extract<
  JourneyDefinition['steps'][number]['elements'][number],
  { type: 'DRAWER' }
>

const element: DrawerDefinition = {
  id: 'details-drawer',
  type: 'DRAWER',
  config: {
    slug: 'details',
    headerChildren: [
      { id: 'header', type: 'TITLE', config: { text: 'Cabeçalho' } }
    ],
    bodyChildren: [{ id: 'body', type: 'TITLE', config: { text: 'Corpo' } }],
    footerChildren: [
      { id: 'footer', type: 'TITLE', config: { text: 'Rodapé' } }
    ]
  }
}

describe('DrawerElement', () => {
  beforeEach(() => {
    renderJourneyElement.mockClear()
    replace.mockClear()
  })

  it('opens from the drawer query and closes while preserving other params', () => {
    window.history.replaceState(
      {},
      '',
      '/jornada/etapa?origin=home&drawer=details'
    )

    render(<DrawerElement element={element} />)
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText('header')).toBeInTheDocument()
    expect(screen.getByText('body')).toBeInTheDocument()
    expect(screen.getByText('footer')).toBeInTheDocument()
    expect(renderJourneyElement).toHaveBeenCalledTimes(3)

    fireEvent.click(screen.getByRole('button', { name: 'Fechar modal' }))

    expect(replace).toHaveBeenCalledWith('/jornada/etapa?origin=home')
  })

  it('stays closed for a different drawer query', () => {
    window.history.replaceState({}, '', '/jornada/etapa?drawer=other')

    render(<DrawerElement element={element} />)

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})
