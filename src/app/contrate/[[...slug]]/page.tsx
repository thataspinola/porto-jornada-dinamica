import Link from 'next/link'
import { notFound } from 'next/navigation'
import { readdir } from 'node:fs/promises'
import { join } from 'node:path'
import { JourneyBuilder } from '@/components/Core/JourneyBuilder'
import { readJourneyContent } from '@/utils/readJourneyContent'
import { journeySchema } from '@/validation/schemas'
export default async function Page({
  params,
}: {
  params: Promise<{ slug?: string[] }>
}) {
  const { slug } = await params
  if (!slug?.length) {
    const files = await readdir(join(process.cwd(), 'public', 'jsonContent'))
    return (
      <section>
        <h1>Produtos Porto</h1>
        <ul>
          {files
            .filter((f) => f.endsWith('.json'))
            .map((file) => {
              const name = file.slice(0, -5)
              return (
                <li key={name}>
                  <Link href={`/contrate/${name}`}>
                    {name.replace(/-/g, ' ')}
                  </Link>
                </li>
              )
            })}
        </ul>
      </section>
    )
  }
  let content: unknown
  try {
    content = await readJourneyContent(slug[0])
  } catch {
    notFound()
  }
  const result = journeySchema.safeParse(content)
  if (!result.success)
    return <p role="alert">Não foi possível carregar a jornada.</p>
  return <JourneyBuilder journey={result.data} />
}
