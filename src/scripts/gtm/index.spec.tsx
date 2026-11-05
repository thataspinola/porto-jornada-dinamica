import { render } from '@testing-library/react'
import { vi } from 'vitest'

import { GTM } from './index'

vi.mock('next/script', () => ({
  __esModule: true,
  default: ({
    children,
    strategy,
    id
  }: {
    children: React.ReactNode
    strategy: string
    id: string
  }) => (
    <script data-testid="gtm-script" data-strategy={strategy} id={id}>
      {children}
    </script>
  )
}))

describe('GTM Component', () => {
  it('should render with correct props', () => {
    const { getByTestId } = render(<GTM />)

    const scriptElement = getByTestId('gtm-script')

    // Verify script has correct attributes
    expect(scriptElement).toHaveAttribute('id', 'gtm')
    expect(scriptElement).toHaveAttribute('data-strategy', 'afterInteractive')
  })

  it('should contain GTM initialization code', () => {
    const { getByTestId } = render(<GTM />)

    const scriptElement = getByTestId('gtm-script')
    const scriptContent = scriptElement.textContent || ''

    // Verify script contains essential GTM code parts
    expect(scriptContent).toContain('function gtmLoader')
    expect(scriptContent).toContain('loadGTM')
    expect(scriptContent).toContain('GTM-5XDMSHB')
    expect(scriptContent).toContain('googletagmanager.com/gtm.js')
  })
})
