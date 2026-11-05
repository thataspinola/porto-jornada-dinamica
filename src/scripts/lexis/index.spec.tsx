import { render } from '@testing-library/react'
import { vi } from 'vitest'

import { TolkitLexis } from './index'

describe('<TolkitLexis />', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
    // happy-dom tenta efetivamente carregar a URL do iframe, gerando logs de
    // erro de rede. Substituímos a criação do iframe por um <div> com os
    // mesmos atributos para inspeção, sem disparar navegação.
    const originalCreateElement = document.createElement.bind(document)
    vi.spyOn(document, 'createElement').mockImplementation(
      (tagName: string, options?: ElementCreationOptions) => {
        if (tagName.toLowerCase() === 'iframe') {
          const stub = originalCreateElement('div', options)
          Object.defineProperty(stub, 'src', {
            get() {
              return stub.getAttribute('src') ?? ''
            },
            set(value: string) {
              stub.setAttribute('src', value)
            }
          })
          return stub
        }
        return originalCreateElement(tagName, options)
      }
    )
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should be exported as a function', () => {
    expect(TolkitLexis).toBeDefined()
    expect(typeof TolkitLexis).toBe('function')
  })

  it('should append a noscript with an iframe stub pointing to the lexis endpoint when sessionId is provided', () => {
    render(<TolkitLexis sessionId="session-123" organizationId="org-456" />)

    const noscript = document.body.querySelector('noscript')
    expect(noscript).not.toBeNull()

    const iframeStub = noscript?.firstElementChild as HTMLElement | null
    expect(iframeStub).not.toBeNull()
    expect(iframeStub?.getAttribute('src')).toBe(
      'https://apicorporativops.portoseguro.com.br/fp/tags?org_id=org-456&session_id=session-123'
    )
  })

  it('should not append a noscript when sessionId is empty', () => {
    render(<TolkitLexis sessionId="" organizationId="org-456" />)

    expect(document.body.querySelector('noscript')).toBeNull()
  })
})
