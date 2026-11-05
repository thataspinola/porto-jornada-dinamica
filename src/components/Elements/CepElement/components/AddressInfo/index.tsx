import { IconResidence } from '@porto-stack/icons'
import { Typography } from '@porto-stack/ui'

import s from './styles.module.scss'

type AddressInfoData = {
  bairro?: string
  estado?: string
  localidade?: string
  logradouro?: string
  uf?: string
}

type AddressInfoProps = {
  addressData: AddressInfoData
}

export function AddressInfo({ addressData }: AddressInfoProps) {
  const cityState = [
    addressData.localidade,
    addressData.uf || addressData.estado
  ]
    .filter(Boolean)
    .join('/')

  const title = addressData.logradouro || cityState
  const description = [addressData.bairro, addressData.logradouro && cityState]
    .filter(Boolean)
    .join(' - ')

  if (!title && !description) return null

  return (
    <div className={s.addressInfo}>
      <IconResidence size={24} color="seguro-900" />

      <div className={s.addressInfoText}>
        <Typography as="p" variant="body1" weight="bold" color="neutral-black">
          {title}
        </Typography>

        {description && (
          <Typography as="p" variant="body2" color="neutral-black">
            {description}
          </Typography>
        )}
      </div>
    </div>
  )
}
