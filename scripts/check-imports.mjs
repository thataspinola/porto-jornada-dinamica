import { readdir, readFile } from 'node:fs/promises'
import { dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import ts from 'typescript'
import { builtinModules } from 'node:module'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const sourceRoot = join(root, 'src')
const pkg = JSON.parse(await readFile(join(root, 'package.json'), 'utf8'))
const dependencies = new Set(
  Object.keys({ ...pkg.dependencies, ...pkg.devDependencies })
)
const builtins = new Set(
  builtinModules.map((name) => name.replace(/^node:/, ''))
)
const config = ts.readConfigFile(join(root, 'tsconfig.json'), ts.sys.readFile)
if (config.error)
  throw new Error(
    ts.flattenDiagnosticMessageText(config.error.messageText, '\n')
  )
const options = ts.parseJsonConfigFileContent(
  config.config,
  ts.sys,
  root
).options
const failures = new Set()
let count = 0

async function inspect(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name)
    if (entry.isDirectory()) {
      await inspect(path)
      continue
    }
    if (!/\.tsx?$/.test(entry.name)) continue
    count++
    const source = ts.createSourceFile(
      path,
      await readFile(path, 'utf8'),
      ts.ScriptTarget.Latest,
      true
    )
    const report = (specifier, reason) =>
      failures.add(`${relative(root, path)}: ${specifier} — ${reason}`)
    function check(specifier) {
      if (!specifier.startsWith('.') && !specifier.startsWith('@/')) {
        if (specifier.startsWith('node:') || builtins.has(specifier)) return
        const packageName = specifier.startsWith('@')
          ? specifier.split('/').slice(0, 2).join('/')
          : specifier.split('/')[0]
        if (!dependencies.has(packageName))
          report(specifier, 'dependência não declarada no package.json')
        return
      }
      if (
        specifier.startsWith('@/') &&
        specifier.slice(2).split('/').includes('..')
      ) {
        report(specifier, 'o alias @/ não deve sair de src')
        return
      }
      const resolved = ts.resolveModuleName(
        specifier,
        path,
        options,
        ts.sys
      ).resolvedModule
      const asset = specifier.startsWith('@/')
        ? resolve(sourceRoot, specifier.slice(2))
        : resolve(dirname(path), specifier)
      if (!resolved && !ts.sys.fileExists(asset))
        report(specifier, 'arquivo ou barrel não encontrado')
    }
    function visit(node) {
      if (
        (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) &&
        node.moduleSpecifier &&
        ts.isStringLiteral(node.moduleSpecifier)
      )
        check(node.moduleSpecifier.text)
      if (
        ts.isCallExpression(node) &&
        node.arguments.length &&
        ts.isStringLiteral(node.arguments[0])
      ) {
        const target = node.expression.getText(source)
        if (['import', 'require', 'vi.mock', 'vi.doMock'].includes(target))
          check(node.arguments[0].text)
      }
      ts.forEachChild(node, visit)
    }
    visit(source)
    if (
      !path.endsWith('.d.ts') &&
      path.endsWith('.ts') &&
      ts.sys.fileExists(`${path}x`)
    )
      report(entry.name, 'implementações .ts e .tsx com o mesmo nome')
  }
}

await inspect(sourceRoot)
await inspect(join(root, 'test'))
if (failures.size) {
  console.error([...failures].join('\n'))
  process.exitCode = 1
} else
  console.log(
    `Imports locais, aliases e barrels verificados em ${count} arquivos.`
  )
