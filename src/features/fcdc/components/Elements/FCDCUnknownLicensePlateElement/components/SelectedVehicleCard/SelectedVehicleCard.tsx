import { Typography } from '@porto-stack/ui'

import formatCurrency from '@/utils/formatCurrency'

import s from './SelectedVehicleCard.module.scss'

type SelectedVehicleCardProps = {
  brandDescription?: string
  modelDescription?: string
  manufacturingYear?: string
  modelYear?: string
  fipeValue?: string
}

export function SelectedVehicleCard({
  brandDescription,
  modelDescription,
  manufacturingYear,
  modelYear,
  fipeValue
}: SelectedVehicleCardProps) {
  return (
    <div className={s.container}>
      <Typography as="h3" variant="title6" weight="bold">
        {brandDescription}
      </Typography>

      <Typography as="p" variant="body2" weight="regular" color="neutral-700">
        {`${modelDescription} - ${manufacturingYear}/${modelYear}`}
      </Typography>

      <Typography as="p" variant="body2" weight="regular" color="neutral-700">
        {`FIPE: ${formatCurrency(String(fipeValue))}`}
      </Typography>
    </div>
  )
}
