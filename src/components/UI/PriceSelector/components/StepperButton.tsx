import { Icon, type IconName } from '@/components/UI/Icon'

import styles from '../PriceSelector.module.scss'

type StepperButtonProps = {
  icon: IconName
  label: string
  disabled?: boolean
  onClick: () => void
}

export function StepperButton({
  icon,
  label,
  disabled,
  onClick,
}: StepperButtonProps) {
  return (
    <button
      type='button'
      onClick={onClick}
      aria-label={label}
      disabled={disabled}
      className={styles.stepButton}
    >
      <Icon
        size={20}
        icon={icon}
        color={disabled ? 'neutral-500' : 'seguro-900'}
      />
    </button>
  )
}
