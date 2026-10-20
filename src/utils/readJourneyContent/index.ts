'use server'

import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { cache } from 'react'

import { JourneyDefinition } from '@/validation/schemas/journey.schema'

export const readJourneyContent = cache(
  async (slug: string): Promise<JourneyDefinition> => {
    const root = process.cwd()
    const contentDirPath = path.join(root, 'public', 'jsonContent')
    const filePath = path.join(contentDirPath, `${slug}.json`)
    const raw = await readFile(filePath, 'utf8')
    return JSON.parse(raw)
  }
)
