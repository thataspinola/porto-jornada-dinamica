export type PriceSelectorProps = {
	value: number
	min: number
	max: number
	step: number
	editable?: boolean
	onChange: (value: number) => void
}
