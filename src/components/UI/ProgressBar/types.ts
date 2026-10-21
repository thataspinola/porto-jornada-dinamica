import type { HTMLAttributes} from 'react'

export interface ProgressBarRootProps extends HTMLAttributes<HTMLDivElement> {
	max: number,
	value: number
}

export type ProgressBarIndicatorProps = HTMLAttributes<HTMLDivElement>
