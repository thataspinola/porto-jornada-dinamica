export type PriceSelectorProps = {
  value: number
  min: number
  max: number
  step: number
  onChange: (value: number) => void
}
