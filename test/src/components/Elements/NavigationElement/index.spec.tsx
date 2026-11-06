import { fireEvent, render, screen } from '@testing-library/react'
import { vi } from 'vitest'

import type { JourneyDefinition } from '@/validation/schemas'

import { NavigationElement } from '@/components/Elements/NavigationElement'

const navigateTo = vi.fn()
const getValues = vi.fn(() => ({}))
const cookiesSet = vi.fn()

vi.mock('js-cookie', () => ({
  default: {
    set: (...args: unknown[]) => cookiesSet(...args)
  }
}))

vi.mock('next-runtime-env', () => ({
  env: (key: string) =>
    key === 'NEXT_PUBLIC_COOKIE_DOMAIN' ? '.porto.com.br' : undefined
}))

vi.mock('@/store/journeyStore', () => ({
  useJourneyStore: {
    getState: () => ({ services: {} })
  }
}))

vi.mock('@/components/Core/JourneyStepForm/context', () => ({
  useJourneyStepForm: () => ({ navigateTo })
}))

vi.mock('react-hook-form', () => ({
  useFormContext: () => ({ getValues })
}))

type NavigationDefinition = Extract<
  JourneyDefinition['steps'][number]['elements'][number],
  { type: 'NAVIGATION' }
>

const element: NavigationDefinition = {
  id: 'alterar-endereco',
  type: 'NAVIGATION',
  config: {
    label: 'Alterar endereço',
    url: '/seguro-residencial/alterar-endereco',
    size: 'md',
    variant: 'primary',
    styles: 'filled',
    presentation: 'link',
    fixed: false,
    requiresStepCompletion: false,
    className: ''
  }
}

function renderNavigation() {
  return render(<NavigationElement element={element} />)
}

describe('NavigationElement', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders a semantic link with its destination', () => {
    renderNavigation()

    expect(
      screen.getByRole('button', { name: 'Alterar endereço' })
    ).toBeInTheDocument()
  })

  it('navigates when clicked', () => {
    renderNavigation()

    fireEvent.click(screen.getByRole('button', { name: 'Alterar endereço' }))

    expect(navigateTo).toHaveBeenCalledWith(
      '/seguro-residencial/alterar-endereco'
    )
  })

  it('writes cookies from form values before navigating', () => {
    getValues.mockReturnValue({ zipCode: '01310100' })
    const cookieElement: NavigationDefinition = {
      ...element,
      config: {
        ...element.config,
        cookies: { cep: '{{fields.zipCode}}' }
      }
    }

    render(<NavigationElement element={cookieElement} />)
    fireEvent.click(screen.getByRole('button', { name: 'Alterar endereço' }))

    expect(cookiesSet).toHaveBeenCalledWith('cep', '01310100', {
      path: '/',
      domain: '.porto.com.br',
      expires: 7,
      httpOnly: false,
      secure: true,
      sameSite: 'lax'
    })
    expect(navigateTo).toHaveBeenCalled()
  })
})
