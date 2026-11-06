import { cp, mkdir } from 'node:fs/promises'
import { resolve, join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const build = 'dist/react-ssr-corp-hubv-dinamic-journey'
const standalone = join(root, build, 'standalone')
await mkdir(join(standalone, build), { recursive: true })
await cp(join(root, build, 'static'), join(standalone, build, 'static'), {
  recursive: true
})
await cp(join(root, 'public'), join(standalone, 'public'), { recursive: true })
