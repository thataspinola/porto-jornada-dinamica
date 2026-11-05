import { Shimmer } from '@porto-stack/ui'

import styles from './styles.module.scss'

type AddressCardShimmerProps = {
  count?: number
}

export function AddressCardShimmer({ count = 2 }: AddressCardShimmerProps) {
  return (
    <div className={styles.container}>
      <Shimmer h={20} className={styles.title} />

      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className={styles.item}>
          <Shimmer rounded="50%" h={24} w={24} />
          <div className={styles.content}>
            <Shimmer w="100%" h={24} />
            <Shimmer w="100%" h={24} />
          </div>
        </div>
      ))}
    </div>
  )
}
