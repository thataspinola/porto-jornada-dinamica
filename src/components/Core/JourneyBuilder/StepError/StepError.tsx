import { Button } from '@/components/UI'
import { Icon } from '@/components/UI/Icon'
import { Text } from '@/components/UI/Text/Text'

import styles from './StepError.module.scss'

type StepErrorProps = {
  onRetry: () => void
  isRetrying?: boolean
}

export function StepError({ onRetry, isRetrying = false }: StepErrorProps) {
  return (
    <div className={styles.container} role="alert">
      <Icon icon="alert" size={40} />

      <Text text="Ops! Algo deu errado" variant="title4" weight="bold" />

      <Text
        text="Parece que nosso sistema está passando por uma instabilidade no momento. Por favor, tente novamente em alguns instantes."
        variant="body1"
        color="neutral-700"
      />

      <div className={styles.actions}>
        <Button type="button" onClick={onRetry} isLoading={isRetrying}>
          Tentar novamente
        </Button>
      </div>
    </div>
  )
}
