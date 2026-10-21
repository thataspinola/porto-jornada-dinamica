import clsx from 'clsx'

import styles from './FixedButtonWrapper.module.scss'

interface FixedButtonWrapperProps {
	children: React.ReactNode
	className?: string
}

export const FixedButtonWrapper = (props: FixedButtonWrapperProps) => {
	const {children, className} = props

	return(
		<div className={clsx(stiles.fixedButtonWrapper, className)}>{children}</div>
	)
}