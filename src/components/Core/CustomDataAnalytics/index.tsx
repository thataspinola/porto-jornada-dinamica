'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

import { normalizeVertical } from '@/utils/normalizeVertical'

type CustomDataAnalyticsProps = {
  category: string
  vertical: string
  product: string
  funnel: string
  funnelStep: number
  subProduct: string
  userId?: string
  userProductLogin?: 'produto' | 'sem-produto'
}

export function CustomDataAnalytics({
  category,
  vertical,
  product,
  funnel,
  funnelStep,
  subProduct,
  userId = '',
  userProductLogin = 'sem-produto'
}: CustomDataAnalyticsProps) {
  const pathname = usePathname()

  useEffect(() => {
    if (typeof window === 'undefined') return

    const name = `contrate${pathname.replaceAll('/', ':')}`

    window.customData = {
      page: {
        id: `/contrate${pathname}`,
        name,
        category: category || 'produto',
        vertical: normalizeVertical(vertical),
        porto_product: product,
        funnel,
        funnel_step: funnelStep,
        porto_subproduct: subProduct
      },
      site: {
        brand: 'porto',
        portal: 'hub-vendas',
        versao: '0.1.0'
      },
      user: {
        id: userId,
        client_bcp: '',
        logged: !!userId,
        product_login: userProductLogin
      }
    }

    window.dataLayer = window.dataLayer || []
  }, [
    pathname,
    category,
    vertical,
    product,
    funnel,
    funnelStep,
    subProduct,
    userId,
    userProductLogin
  ])

  return null
}
