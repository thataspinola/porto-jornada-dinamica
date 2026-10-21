import { createRequire } from 'node:module'
import { spawnSync } from 'node:child_process'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const require = createRequire(import.meta.url)
const args = process.argv.slice(2)
const mode = args.shift() ?? 'lint'
const cli = require.resolve('@biomejs/biome/bin/biome')
const result = spawnSync(
  process.execPath,
  [cli, mode, ...args, 'src', 'test'],
  { cwd: root, stdio: 'inherit' }
)
process.exit(result.status ?? 1)
