'use client'

import { clsx } from '@porto-stack/ui/utils'
import {
  SliderRange as RadixRange,
  Slider as RadixRoot,
  type SliderProps as RadixSliderProps,
  SliderThumb as RadixThumb,
  SliderTrack as RadixTrack,
  type SliderRangeProps,
  type SliderThumbProps,
  type SliderTrackProps
} from '@radix-ui/react-slider'
import { forwardRef, type ReactNode } from 'react'

import styles from './Slider.module.scss'

type SliderRootProps = RadixSliderProps & {
  children: ReactNode
  className?: string
}

export const SliderRoot = forwardRef<HTMLSpanElement, SliderRootProps>(
  ({ children, className, ...props }, ref) => (
    <RadixRoot ref={ref} className={clsx(styles.root, className)} {...props}>
      {children}
    </RadixRoot>
  )
)
SliderRoot.displayName = 'Slider.Root'

export const SliderTrack = forwardRef<HTMLSpanElement, SliderTrackProps>(
  ({ children, className, ...props }, ref) => (
    <RadixTrack ref={ref} className={clsx(styles.track, className)} {...props}>
      {children}
    </RadixTrack>
  )
)
SliderTrack.displayName = 'Slider.Track'

export const SliderRange = forwardRef<HTMLSpanElement, SliderRangeProps>(
  ({ className, ...props }, ref) => (
    <RadixRange
      ref={ref}
      className={clsx(styles.range, className)}
      {...props}
    />
  )
)
SliderRange.displayName = 'Slider.Range'

type ThumbProps = SliderThumbProps & {
  children?: ReactNode
}

export const SliderThumb = forwardRef<HTMLSpanElement, ThumbProps>(
  ({ children, className, ...props }, ref) => (
    <RadixThumb ref={ref} className={clsx(styles.thumb, className)} {...props}>
      {children}
    </RadixThumb>
  )
)
SliderThumb.displayName = 'Slider.Thumb'

export const Slider = {
  Root: SliderRoot,
  Track: SliderTrack,
  Range: SliderRange,
  Thumb: SliderThumb
}
