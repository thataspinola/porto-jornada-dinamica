import { execFileSync } from 'node:child_process'
import { readFile } from 'node:fs/promises'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const range = process.argv[2] ?? 'HEAD'
if (
  range !== '--file' &&
  (!/^[A-Za-z0-9_./~^@{}+-]+$/.test(range) || range.startsWith('-'))
)
  throw new Error('Intervalo Git inválido')
const messages =
  range === '--file'
    ? [(await readFile(process.argv[3], 'utf8')).trim()]
    : execFileSync(
        'git',
        ['log', '--no-merges', '--format=%B%x00', range, '--'],
        { cwd: root, encoding: 'utf8' }
      )
        .split('\0')
        .map((text) => text.trim())
        .filter(Boolean)
const pattern =
  /^(feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert)(\([^()\r\n]+\))?!?: \S[^\r\n]*(?:\n\n[\s\S]*)?$/
if (messages.some((message) => !pattern.test(message)))
  throw new Error(
    'Commits fora do padrão Conventional Commits no intervalo informado'
  )
console.log(`${messages.length} commits validados.`)
