'use client'

import { useCallback } from 'react'
import { useShallow } from 'zustand/shallow'

import { centsToReais, formatPrice, reaisToCents } from '@/utils'

import { useJourneyStore } from '@/store/journeyStore'

export type ProductAnalytics = {
  itemCategory?: string
  itemVariant?: string
  itemListName?: string
  itemListId?: string
  discount?: number
  creativeName?: string
  creativeSlot?: string
  promotionName?: string
}

export type Product = {
  id: string
  sku: string
  name: string
  amount: number
  installments: number
  installmentsPrice: number
  analytics?: ProductAnalytics
}

const EMPTY_PRODUCTS: Product[] = []

function addCurrencyValues(
  products: Product[],
  key: 'amount' | 'installmentsPrice'
) {
  const cents = products.reduce(
    (total, product) => total + reaisToCents(product[key]),
    0
  )
  return centsToReais(cents)
}

function calculateProductFields(products: Product[]) {
  const totalAmount = addCurrencyValues(products, 'amount')

  return {
    products,
    totalAmount: formatPrice(totalAmount),
    installments: products.reduce(
      (maximum, product) => Math.max(maximum, product.installments),
      0
    ),
    totalInstallmentsPrice: addCurrencyValues(products, 'installmentsPrice')
  }
}

export function useProducts() {
  const { products, mergeFields } = useJourneyStore(
    useShallow((state) => ({
      products: (state.fields.products ?? EMPTY_PRODUCTS) as Product[],
      mergeFields: state.mergeFields
    }))
  )
  const totalInstallmentsPrice =
    products.length > 0
      ? addCurrencyValues(products, 'installmentsPrice')
      : undefined

  const updateProducts = useCallback(
    (nextProducts: Product[]) => {
      mergeFields(calculateProductFields(nextProducts))
    },
    [mergeFields]
  )

  const addProduct = useCallback(
    (product: Product) => {
      const currentProducts = (useJourneyStore.getState().fields.products ??
        []) as Product[]
      const nextProducts = [
        ...currentProducts.filter((current) => current.id !== product.id),
        product
      ]
      updateProducts(nextProducts)
    },
    [updateProducts]
  )

  const removeProduct = useCallback(
    (productId: string) => {
      const currentProducts = (useJourneyStore.getState().fields.products ??
        []) as Product[]
      updateProducts(
        currentProducts.filter((product) => product.id !== productId)
      )
    },
    [updateProducts]
  )

  const replaceProducts = useCallback(
    (productIds: string[], replacements: Product[]) => {
      const currentProducts = (useJourneyStore.getState().fields.products ??
        []) as Product[]
      const idsToReplace = new Set([
        ...productIds,
        ...replacements.map((product) => product.id)
      ])
      updateProducts([
        ...currentProducts.filter((product) => !idsToReplace.has(product.id)),
        ...replacements
      ])
    },
    [updateProducts]
  )

  return {
    products,
    totalInstallmentsPrice,
    addProduct,
    removeProduct,
    replaceProducts
  }
}
