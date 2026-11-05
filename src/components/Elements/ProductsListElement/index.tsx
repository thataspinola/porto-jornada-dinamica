'use client'

import { formatPrice } from '@/utils'

import { useProducts } from '@/hooks/useProducts'

import { LabelValueElement } from '../LabelValueElement'
import type { LabelValueElementType } from '../LabelValueElement/types'
import styles from './ProductsListElement.module.scss'
import type { ProductsListElementProps } from './types'

export function ProductsListElement({ element }: ProductsListElementProps) {
  const { products } = useProducts()
  const { label, value, cssProperties } = element.config

  return (
    <div className={styles.list} style={cssProperties}>
      {products.map((product) => {
        const labelValueElement = {
          id: `${element.id}-${product.id}`,
          type: 'LABEL_VALUE',
          config: {
            label: { text: product.name, ...label },
            value: { text: `R$ ${formatPrice(product.amount)}`, ...value }
          }
        } satisfies LabelValueElementType

        return (
          <LabelValueElement key={product.id} element={labelValueElement} />
        )
      })}
    </div>
  )
}
