import { readdir } from 'node:fs/promises'
import { resolve, join, relative, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const failures = []
async function inspect(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = join(directory, entry.name)
    const name = relative(root, file).replaceAll('\\', '/')
    if (/[\s,]/.test(entry.name)) failures.push(`${name}: nome inválido`)
    if (['__test__', '__tests__'].includes(entry.name))
      failures.push(`${name}: use test/ na raiz`)
    if (entry.isDirectory()) await inspect(file)
    else {
      if (/\.test\.[tj]sx?$/.test(name)) failures.push(`${name}: use .spec`)
      if (name.startsWith('src/') && /\.(?:spec|test)\.[tj]sx?$/.test(name))
        failures.push(`${name}: mova para test/ na raiz`)
      if (/types\.tsx$/.test(name)) failures.push(`${name}: tipos usam .ts`)
      if (
        /validation\/schemas\/.+\.ts$/.test(name) &&
        !/\.(?:schemas?|spec)\.ts$/.test(name) &&
        entry.name !== 'index.ts'
      )
        failures.push(`${name}: schemas usam .schema.ts ou .schemas.ts`)
    }
  }
}
await inspect(join(root, 'src'))
await inspect(join(root, 'test'))
if (failures.length) {
  console.error(failures.join('\n'))
  process.exitCode = 1
} else console.log('Nomes e testes externos verificados.')
