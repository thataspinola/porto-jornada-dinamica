import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const pkg = JSON.parse(await readFile(resolve(root, 'package.json'), 'utf8'))
const escape = (value) =>
  String(value).replaceAll('|', '\\|').replaceAll('\n', ' ')
const content =
  '<!-- Gerado por npm run docs:generate. -->\n# Comandos do projeto\n\n' +
  `Node: ${pkg.engines.node}.\n\n| Comando | Execução |\n| --- | --- |\n` +
  Object.entries(pkg.scripts)
    .sort(([a], [b]) => a.localeCompare(b, 'en'))
    .map(
      ([name, command]) => `| npm run ${escape(name)} | ${escape(command)} |`
    )
    .join('\n') +
  '\n'
const output = resolve(root, 'docs/commands.md')
if (process.argv.includes('--check')) {
  if ((await readFile(output, 'utf8')) !== content)
    throw new Error('Execute npm run docs:generate e versione docs/commands.md')
} else {
  await mkdir(dirname(output), { recursive: true })
  await writeFile(output, content)
}
