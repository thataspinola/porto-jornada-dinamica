import type { Metadata, ResolvingMetadata } from 'next'
import { redirect } from 'next/navigation'
import { env } from 'next-runtime-env'

import { injectProgressToSteps, readJourneyContent } from '@/utils'

import { JourneyBuilder, JourneyParseError } from '@/components/Core'

import { journeySchema } from '@/validation/schemas'

const NOT_FOUND_URL = 'https://www.portoseguro.com.br/pagina-nao-encontrada'

type PageProps = {
  params: Promise<{ slug: string[] }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata(
  { params }: PageProps,
  _parent: ResolvingMetadata
): Promise<Metadata> {
  try {
    const { slug: slugs } = await params
    const slug = slugs?.[0] || ''

    const rawJourney = await readJourneyContent(slug)

    const metaTitle = rawJourney.name

    return {
      title: metaTitle,
      robots: {
        index: true,
        follow: true,
      },
      openGraph: {
        title: metaTitle,
        url: `https://www.portoseguro.com.br/contrate/${slug}`,
        siteName: 'Porto Seguro',
        countryName: 'Brasil',
        locale: 'pt_BR',
        type: 'website',
      },
      alternates: {
        canonical: `https://www.portoseguro.com.br/contrate/${slug}`,
      },
    }
  } catch {
    redirect(NOT_FOUND_URL)
  }
}

export default async function Page({ params }: PageProps) {
  try {
    const { slug: slugs } = await params
    const slug = slugs?.[0] || ''

    const rawJourney = await readJourneyContent(slug)
    const parsed = journeySchema.safeParse(rawJourney)

    if (!parsed.success) {
      console.error(`[journey] Falha ao validar "${slug}":`)

      for (const issue of parsed.error.issues) {
        console.error(
          `  - ${issue.path.join('.') || '<root>'}: ${issue.message}`
        )
      }

      const isProduction = env('NEXT_PUBLIC_NODE_ENV') === 'production'

      if (isProduction) {
        redirect(NOT_FOUND_URL)
      }

      return <JourneyParseError slug={slug} issues={parsed.error.issues} />
    }

    const journeyWithProgress = injectProgressToSteps(parsed.data)

    return <JourneyBuilder journey={journeyWithProgress} />
  } catch {
    redirect(NOT_FOUND_URL)
  }
}
