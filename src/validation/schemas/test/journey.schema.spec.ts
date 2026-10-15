/** @vitest-environment node */
import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

import { journeySchema } from '@/validation/schemas/journey.schema'

test.each(readdirSync(join(process.cwd(), 'public/jsonContent')))(
  'valida jornada %s',
  (file) => {
    const value = JSON.parse(
      readFileSync(join(process.cwd(), 'public/jsonContent', file), 'utf8')
    )

    expect(journeySchema.safeParse(value).success).toBe(true)
  }
)
