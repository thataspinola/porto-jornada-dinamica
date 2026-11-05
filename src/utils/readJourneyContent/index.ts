'use server'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { cache } from 'react'

import type { JourneyDefinition } from '@/validation/schemas'

export const readJourneyContent = cache(
  async (slug: string): Promise<JourneyDefinition> => {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
      throw new Error('Slug de jornada inválido')
    }
    const root = process.cwd()
    const contentDirPath = path.join(root, 'public', 'jsonContent')

    const filePath = path.join(contentDirPath, `${slug}.json`)
    const raw = await readFile(filePath, 'utf8')
    return JSON.parse(raw)
  }
)
