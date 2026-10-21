import { readdir } from 'node:fs/promises'
import { dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const errors = []
async function inspect(directory, testing) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name)
    if (entry.isDirectory()) {
      if (!testing && ['test', '__test__', '__tests__'].includes(entry.name))
        errors.push(`${relative(root, path)}: testes ficam em test/ na raiz`)
      await inspect(path, testing)
      continue
    }
    if (/[\s,]/.test(entry.name))
      errors.push(`${relative(root, path)}: nome inválido`)
    if (/\.test\.[jt]sx?$/.test(entry.name))
      errors.push(`${relative(root, path)}: use .spec.ts ou .spec.tsx`)
    if (!testing && /\.spec\.[jt]sx?$/.test(entry.name))
      errors.push(`${relative(root, path)}: spec fora de test/`)
  }
}
await inspect(join(root, 'src'), false)
await inspect(join(root, 'test'), true)
if (errors.length) {
  console.error(errors.join('\n'))
  process.exitCode = 1
} else console.log('Nomes e localização dos testes verificados.')
