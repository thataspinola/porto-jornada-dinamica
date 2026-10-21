import { render } from '@testing-library/react'
import { TolkitLexis } from '@/scripts/lexis'
it('recebe organização e sessão pelo contrato original', () => {
  expect(() =>
    render(<TolkitLexis organizationId="fixture" sessionId="session-fixture" />)
  ).not.toThrow()
})
