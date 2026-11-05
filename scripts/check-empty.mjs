import { readdir, readFile } from 'node:fs/promises'
import { dirname, join, resolve, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const ignored = new Set(['.git', '.next', 'dist', 'coverage', 'node_modules'])
const empty = []
async function inspect(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (ignored.has(entry.name)) continue
    const path = join(directory, entry.name)
    if (entry.isDirectory()) await inspect(path)
    else if (entry.isFile() && !(await readFile(path, 'utf8')).trim())
      empty.push(relative(root, path))
  }
}
await inspect(root)
if (empty.length) {
  console.error(`Arquivos vazios:\n${empty.join('\n')}`)
  process.exitCode = 1
} else console.log('Nenhum arquivo vazio no projeto.')
