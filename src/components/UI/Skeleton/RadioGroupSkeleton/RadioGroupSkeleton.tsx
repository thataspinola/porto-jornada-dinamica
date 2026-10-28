import { Shimmer } from '@porto-stack/ui'

import styles from './RadioGroupSkeleton.module.scss'

export function RadioGroupSkeleton({ count = 1 }: { count?: number }) {
  return (
    <div className={styles.container}>
      {[...Array(count)].map((_, idx) => (
        <div key={idx} className={styles.item}>
          <Shimmer rounded="50%" h={24} w={24} />
          <div>
            <Shimmer w={150} h={24} />
            <Shimmer w={170} h={16} />
          </div>
        </div>
      ))}
    </div>
  )
}
