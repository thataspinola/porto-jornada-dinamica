import { Shimmer } from '@porto-stack/ui'

import styles from './StepSkeleton.module.scss'

type StepSkeletonProps = {
  fieldsCount?: number
}

export function StepSkeleton({ fieldsCount = 3 }: StepSkeletonProps) {
  return (
    <div className={styles.container} aria-busy="true" aria-live="polite">
      <Shimmer w="60%" h={32} />
      <Shimmer w="90%" h={20} />

      <div className={styles.fields}>
        {[...Array(fieldsCount)].map((_, idx) => (
          <div key={idx} className={styles.field}>
            <Shimmer w={120} h={16} />
            <Shimmer w="100%" h={48} />
          </div>
        ))}
      </div>

      <div className={styles.actions}>
        <Shimmer w="100%" h={48} />
      </div>
    </div>
  )
}
