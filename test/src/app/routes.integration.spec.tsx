import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import Page from '@/app/contrate/[[...slug]]/page'
import Home from '@/app/page'
import { GET } from '@/app/api/health/route'
import { readJourneyContent } from '@/utils/readJourneyContent'

vi.mock('@/components/Core/JourneyBuilder', () => ({
  JourneyBuilder: ({ journey }: { journey: { name: string } }) => (
    <h1>{journey.name}</h1>
  ),
}))
describe('rotas e conteúdo no filesystem', () => {
  it('home carrega catálogo de produtos', async () => {
    render(await Home({ params: Promise.resolve({}) }))
    expect(
      screen.getByRole('heading', { name: 'Produtos Porto' })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: 'financiamento de veiculos' })
    ).toHaveAttribute('href', '/contrate/financiamento-de-veiculos')
  })
  it.each([
    'financiamento-de-veiculos',
    'emprestimo-com-garantia-de-veiculo',
  ])('carrega e valida a jornada %s', async (slug) => {
    const content = await readJourneyContent(slug)
    const definition = content
    render(await Page({ params: Promise.resolve({ slug: [slug, 'cpf'] }) }))
    expect(
      screen.getByRole('heading', { name: definition.name })
    ).toBeInTheDocument()
  })
  it.each([
    '../package',
    '',
    'Jornada',
    '/etc/passwd',
  ])('rejeita nome de conteúdo inválido %s', async (slug) => {
    await expect(readJourneyContent(slug)).rejects.toThrow('Jornada inválida')
  })
  it('jornada ausente retorna notFound do Next', async () => {
    await expect(
      Page({ params: Promise.resolve({ slug: ['jornada-inexistente'] }) })
    ).rejects.toMatchObject({ digest: 'NEXT_HTTP_ERROR_FALLBACK;404' })
  })
  it('health responde JSON com status saudável', async () => {
    const response = GET()
    expect(response.status).toBe(200)
    expect(await response.json()).toEqual({ status: 'ok' })
  })
})
