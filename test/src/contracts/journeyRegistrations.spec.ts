// @vitest-environment node
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { spawnSync } from 'node:child_process'

let root: string
function write(name: string, content: string) {
  const file = join(root, name)
  mkdirSync(join(file, '..'), { recursive: true })
  writeFileSync(file, content)
}
function run() {
  return spawnSync(
    process.execPath,
    [resolve('scripts/check-journeys.mjs'), root],
    { encoding: 'utf8' }
  )
}
beforeEach(() => {
  root = mkdtempSync(join(tmpdir(), 'journey-contracts-'))
  write('tsconfig.json', '{}')
  write(
    'src/validation/schemas/journeyElement.schema.ts',
    "import { textSchema } from './elements/text.schema'; export const journeyElementSchema = z.discriminatedUnion('type', [textSchema])"
  )
  write(
    'src/validation/schemas/elements/text.schema.ts',
    "export const textSchema = z.object({ type: z.literal('TEXT') })"
  )
  write(
    'src/components/Core/JourneyRenderElements/index.tsx',
    'export const renderers = { TEXT: () => null }'
  )
  write(
    'public/jsonContent/journey.json',
    JSON.stringify({
      elements: [{ id: 'title', type: 'TEXT', config: { text: 'Título' } }]
    })
  )
})
afterEach(() => rmSync(root, { recursive: true, force: true }))

it('aprova uma jornada com schema e renderizador correspondentes', () => {
  const result = run()
  expect(result.status).toBe(0)
  expect(result.stdout).toContain('1 jornadas verificadas')
})
it('recusa um schema sem renderizador', () => {
  write(
    'src/components/Core/JourneyRenderElements/index.tsx',
    'export const renderers = {}'
  )
  const result = run()
  expect(result.status).toBe(1)
  expect(result.stderr).toContain('Schema TEXT sem renderizador')
})
it('recusa um renderizador sem schema', () => {
  write(
    'src/components/Core/JourneyRenderElements/index.tsx',
    'export const renderers = { TEXT: () => null, UNKNOWN: () => null }'
  )
  const result = run()
  expect(result.status).toBe(1)
  expect(result.stderr).toContain('Renderizador UNKNOWN sem schema registrado')
})
it('recusa um tipo não suportado dentro do JSON e identifica o elemento', () => {
  write(
    'public/jsonContent/journey.json',
    JSON.stringify({
      elements: [{ id: 'broken', type: 'UNKNOWN', config: {} }]
    })
  )
  const result = run()
  expect(result.status).toBe(1)
  expect(result.stderr).toContain('broken usa tipo não suportado UNKNOWN')
})
it('não aprova um arquivo JSON inválido', () => {
  write('public/jsonContent/journey.json', '{invalid')
  const result = run()
  expect(result.status).toBe(1)
  expect(result.stderr).toContain('JSON inválido')
})
