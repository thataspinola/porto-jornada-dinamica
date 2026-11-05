import { readFile, readdir } from 'node:fs/promises'
import { dirname, join, resolve, relative } from 'node:path'
import { fileURLToPath } from 'node:url'
import ts from 'typescript'

const root = process.argv[2]
  ? resolve(process.argv[2])
  : resolve(dirname(fileURLToPath(import.meta.url)), '..')
const errors = []
async function parse(file) {
  return ts.createSourceFile(
    file,
    await readFile(file, 'utf8'),
    ts.ScriptTarget.Latest,
    true,
    file.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS
  )
}
function declaration(source, name) {
  let found
  function visit(node) {
    if (ts.isVariableDeclaration(node) && node.name.getText(source) === name)
      found = node.initializer
    ts.forEachChild(node, visit)
  }
  visit(source)
  if (!found) throw new Error(`Declaração ${name} não encontrada`)
  return found
}
const schemaFile = join(root, 'src/validation/schemas/journeyElement.schema.ts')
const schema = await parse(schemaFile)
const imports = new Map()
for (const statement of schema.statements) {
  if (
    !ts.isImportDeclaration(statement) ||
    !ts.isStringLiteral(statement.moduleSpecifier)
  )
    continue
  const bindings = statement.importClause?.namedBindings
  if (bindings && ts.isNamedImports(bindings)) {
    for (const name of bindings.elements)
      imports.set(name.name.text, statement.moduleSpecifier.text)
  }
}
const config = ts.readConfigFile(join(root, 'tsconfig.json'), ts.sys.readFile)
if (config.error) throw new Error('tsconfig.json inválido')
const options = ts.parseJsonConfigFileContent(
  config.config,
  ts.sys,
  root
).options
const union = declaration(schema, 'journeyElementSchema')
if (
  !ts.isCallExpression(union) ||
  !union.arguments[1] ||
  !ts.isArrayLiteralExpression(union.arguments[1])
)
  throw new Error('União de elementos não reconhecida')
const schemaTypes = new Set()
for (const element of union.arguments[1].elements) {
  const moduleName = imports.get(element.getText(schema))
  if (!moduleName)
    throw new Error(
      `Schema importado não encontrado: ${element.getText(schema)}`
    )
  const file = ts.resolveModuleName(moduleName, schemaFile, options, ts.sys)
    .resolvedModule?.resolvedFileName
  if (!file) throw new Error(`Módulo de schema não encontrado: ${moduleName}`)
  const source = await parse(file)
  function visit(node) {
    if (
      ts.isPropertyAssignment(node) &&
      node.name.getText(source).replaceAll(/['"]/g, '') === 'type' &&
      ts.isCallExpression(node.initializer)
    ) {
      const literal = node.initializer.arguments[0]
      if (
        node.initializer.expression.getText(source) === 'z.literal' &&
        literal &&
        ts.isStringLiteral(literal)
      )
        schemaTypes.add(literal.text)
    }
    ts.forEachChild(node, visit)
  }
  visit(source)
}
const registryFile = join(
  root,
  'src/components/Core/JourneyRenderElements/index.tsx'
)
const registrySource = await parse(registryFile)
const registry = declaration(registrySource, 'renderers')
if (!ts.isObjectLiteralExpression(registry))
  throw new Error('Registro de renderizadores não reconhecido')
const rendererTypes = new Set(
  registry.properties
    .filter(ts.isPropertyAssignment)
    .map((node) => node.name.getText(registrySource).replaceAll(/['"]/g, ''))
)
for (const type of schemaTypes) {
  if (type !== 'GRID_ITEM' && !rendererTypes.has(type))
    errors.push(`Schema ${type} sem renderizador`)
}
for (const type of rendererTypes) {
  if (!schemaTypes.has(type))
    errors.push(`Renderizador ${type} sem schema registrado`)
}
function inspect(value, file, parentType) {
  if (!value || typeof value !== 'object') return
  if (Array.isArray(value)) {
    value.forEach((child) => inspect(child, file, parentType))
    return
  }
  const elementType =
    value.id && value.config && typeof value.type === 'string'
      ? value.type
      : undefined
  if (elementType) {
    const internalGridItem =
      elementType === 'GRID_ITEM' && parentType === 'GRID'
    if (
      !schemaTypes.has(elementType) ||
      (!rendererTypes.has(elementType) && !internalGridItem)
    )
      errors.push(
        `${relative(root, file)}: ${value.id} usa tipo não suportado ${elementType}`
      )
  }
  for (const child of Object.values(value))
    inspect(child, file, elementType ?? parentType)
}
const contentDirectory = join(root, 'public/jsonContent')
let count = 0
for (const entry of await readdir(contentDirectory, { withFileTypes: true })) {
  if (!entry.isFile() || !entry.name.endsWith('.json')) continue
  const file = join(contentDirectory, entry.name)
  let content
  try {
    content = JSON.parse(await readFile(file, 'utf8'))
  } catch {
    errors.push(`${entry.name}: JSON inválido`)
    continue
  }
  inspect(content, file)
  count++
}
if (!count) errors.push('Nenhuma definição de jornada encontrada')
if (errors.length) {
  console.error(errors.join('\n'))
  process.exitCode = 1
} else
  console.log(
    `${count} jornadas verificadas: tipos declarados e renderizadores compatíveis.`
  )
