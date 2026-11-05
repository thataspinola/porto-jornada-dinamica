// @vitest-environment node
import { readdirSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { journeySchema } from '@/validation/schemas'

const content = resolve('public/jsonContent')
const files = readdirSync(content).filter((file) => file.endsWith('.json'))

it.each(files)('aceita a definição completa de produção: %s', (file) => {
  const parsed = journeySchema.safeParse(
    JSON.parse(readFileSync(resolve(content, file), 'utf8'))
  )
  expect(
    parsed.success,
    parsed.success
      ? ''
      : JSON.stringify(
          parsed.error.issues.map((issue) => ({
            path: issue.path,
            message: issue.message
          }))
        )
  ).toBe(true)
})
