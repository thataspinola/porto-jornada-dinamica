import { renderToStaticMarkup } from 'react-dom/server'
import { GTM } from '@/scripts/gtm'

it('inclui o fallback do GTM no documento HTML', () => {
  const markup = renderToStaticMarkup(<GTM />)
  expect(markup).toContain('<noscript>')
  expect(markup).toContain('https://googletagmanager.com/ns.html?id=')
})
