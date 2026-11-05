import { vi } from 'vitest'
import path from 'node:path'
import { readFile } from 'node:fs/promises'
import { readJourneyContent } from '@/utils/readJourneyContent'

vi.mock('node:fs/promises', () => ({ readFile: vi.fn() }))
beforeEach(() => {
  vi.mocked(readFile).mockReset()
})

it('lê a definição do diretório público da aplicação', async () => {
  vi.mocked(readFile).mockResolvedValue('{"slug":"financiamento-de-veiculos"}')
  await expect(
    readJourneyContent('financiamento-de-veiculos')
  ).resolves.toEqual({ slug: 'financiamento-de-veiculos' })
  expect(readFile).toHaveBeenCalledWith(
    path.join(
      process.cwd(),
      'public',
      'jsonContent',
      'financiamento-de-veiculos.json'
    ),
    'utf8'
  )
})
it.each([
  '',
  '../secret',
  '/absolute',
  'produto/arquivo',
  'produto.json'
])('recusa slug inválido antes de acessar arquivos: %s', async (slug) => {
  await expect(readJourneyContent(slug)).rejects.toThrow(
    'Slug de jornada inválido'
  )
  expect(readFile).not.toHaveBeenCalled()
})
