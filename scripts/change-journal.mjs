import { execFileSync } from 'node:child_process'
import { mkdir, writeFile } from 'node:fs/promises'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const range = process.argv[2] ?? 'HEAD'
if (!/^[A-Za-z0-9_./~^@{}+-]+$/.test(range) || range.startsWith('-'))
  throw new Error('Intervalo Git inválido')
const entries = execFileSync(
  'git',
  ['log', '--no-merges', '--format=%cs%x09%h%x09%s', range, '--'],
  { cwd: root, encoding: 'utf8' }
)
const escape = (line) => line.replace(/[\\`*_[\]<>|]/g, '\\$&')
const content =
  '# Diário de alterações\n\nGerado do histórico Git disponível. CHANGELOG.md contém as notas revisadas.\n\n' +
  entries
    .trim()
    .split('\n')
    .filter(Boolean)
    .map((line) => '- ' + escape(line))
    .join('\n') +
  '\n'
await mkdir(resolve(root, 'reports'), { recursive: true })
await writeFile(resolve(root, 'reports/change-journal.md'), content)
