'use client'

import { IconCircleInfo } from '@porto-stack/icons'
import { Tooltip, Typography } from '@porto-stack/ui'
import { clsx } from '@porto-stack/ui/utils'
import Image from 'next/image'
import { type ComponentProps, createContext, useContext } from 'react'

import styles from './ChipsImage.module.scss'

export type ChipsImageVariant = 'vertical' | 'horizontal'

type ChipsImageContextValue = {
  name: string
  value: string
  variant: ChipsImageVariant
  onValueChange: (value: string) => void
}

const ChipsImageContext = createContext<ChipsImageContextValue | null>(null)

function useChipsImageContext() {
  const context = useContext(ChipsImageContext)

  if (context === null) {
    throw new Error('ChipsImage.Item must be used within a ChipsImage.Root')
  }

  return context
}

type ChipsImageRootProps = Omit<ComponentProps<'div'>, 'onChange'> & {
  name: string
  value: string
  onValueChange: (value: string) => void
  variant?: ChipsImageVariant
}

function ChipsImageRoot({
  name,
  value,
  onValueChange,
  variant = 'vertical',
  className,
  children,
  ...props
}: ChipsImageRootProps) {
  return (
    <ChipsImageContext.Provider value={{ name, value, variant, onValueChange }}>
      <div
        role='radiogroup'
        className={clsx(styles.group, styles[variant], className)}
        {...props}
      >
        {children}
      </div>
    </ChipsImageContext.Provider>
  )
}

type ChipsImageItemProps = Omit<ComponentProps<'label'>, 'children'> & {
  value: string
  label: string
  image: string
  description?: string
  tooltip?: string
}

function ChipsImageItem({
  value,
  label,
  image,
  description,
  tooltip,
  className,
  ...props
}: ChipsImageItemProps) {
  const context = useChipsImageContext()
  const checked = context.value === value

  return (
    <label
      className={clsx(styles.item, className)}
      data-state={checked ? 'checked' : 'unchecked'}
      {...props}
    >
      <input
        type='radio'
        className={styles.input}
        name={context.name}
        value={value}
        checked={checked}
        onChange={() => context.onValueChange(value)}
      />

      <span className={styles.image}>
        <Image
          src={image}
          alt=''
          fill
          sizes='120px'
          unoptimized
          className={styles.img}
        />
      </span>

      <span className={styles.content}>
        <span className={styles.labelRow}>
          <Typography as='span' variant='body1' color='neutral-black'>
            {label}
          </Typography>

          {tooltip && (
            <Tooltip.Root>
              <Tooltip.Trigger
                type='button'
                aria-label={`Mais informações sobre ${label}`}
                className={styles.tooltipTrigger}
              >
                <IconCircleInfo size={16} />
              </Tooltip.Trigger>
              <Tooltip.Content side='bottom' className={styles.tooltipContent}>
                <Tooltip.Description>{tooltip}</Tooltip.Description>
              </Tooltip.Content>
            </Tooltip.Root>
          )}
        </span>

        {description && (
          <Typography as='span' variant='caption' color='neutral-700'>
            {description}
          </Typography>
        )}
      </span>
    </label>
  )
}

ChipsImageRoot.displayName = 'ChipsImage.Root'
ChipsImageItem.displayName = 'ChipsImage.Item'

export const ChipsImage = {
  Root: ChipsImageRoot,
  Item: ChipsImageItem,
}
