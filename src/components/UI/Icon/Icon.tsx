import type {BaseSvgProps} from '@porto-stack/icons'

import {icons} from './icons'

export type IconName = keyof typeof icons

export type IconProps = BaseSvgProps & {
	icon: IconName
}

export function Icon({icon, ...props}: IconProps) {
	const Comp = icons[icon] ?? icons.placeholder
	return <Comp {...props} />
}