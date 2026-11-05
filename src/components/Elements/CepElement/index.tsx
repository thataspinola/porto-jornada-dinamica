'use client'

import { Checkbox, Typography } from '@porto-stack/ui'
import { Controller, useFormContext } from 'react-hook-form'

import { buildGtmAttrs, cepMask } from '@/utils'

import { useJourneyStepForm } from '@/components/Core/JourneyStepForm/context'
import { Input } from '@/components/UI'

import { AddressInfo } from './components/AddressInfo'
import { ModalWithoutCep } from './components/ModalWithoutCep'
import { ZIPCODE_DISPLAY_MAX_LENGTH } from './hooks/constants'
import { CEP_FIELD_NAMES, useCepAddress } from './hooks/useCepAddress'
import s from './styles.module.scss'
import type { CepElementProps } from './types'

export function CepElement({ element }: CepElementProps) {
  const { control, watch, setValue, getValues, clearErrors } = useFormContext()
  const { stepTitle } = useJourneyStepForm()
  const { required } = element.config
  const gtmAttrs = buildGtmAttrs({
    kind: 'form-input',
    stepTitle,
    label: 'CEP'
  })

  const {
    addressData,
    hasNoNumber,
    isAddressLoading,
    isAddressSuccess,
    handleZipcodeChange,
    handleHasNoNumberChange
  } = useCepAddress({ control, watch, setValue, getValues, clearErrors })

  return (
    <div className={s.addressContent}>
      <div className={s.addressInputWrapper}>
        <Controller
          control={control}
          name={CEP_FIELD_NAMES.addressZipCode}
          render={({ field, fieldState }) => (
            <Input
              {...field}
              {...gtmAttrs}
              type="tel"
              name={field.name}
              required={required}
              placeholder="00000-000"
              value={cepMask(field.value ?? '')}
              onChange={(e) =>
                handleZipcodeChange(e.target.value, field.onChange)
              }
              variant="big"
              maxLength={ZIPCODE_DISPLAY_MAX_LENGTH}
              isValid={isAddressSuccess && !fieldState.error?.message}
              disabled={isAddressLoading}
              isLoading={isAddressLoading}
              errorMessage={fieldState.error?.message ?? ''}
            />
          )}
        />
        <ModalWithoutCep />
      </div>

      {addressData && (
        <div className={s.addressCard}>
          <div className={s.editAddress}>
            <AddressInfo addressData={addressData} />

            {!addressData.logradouro && (
              <Controller
                control={control}
                name={CEP_FIELD_NAMES.addressStreetName}
                render={({ field, fieldState }) => (
                  <Input
                    {...field}
                    name={field.name}
                    label="Rua"
                    width="fluid"
                    variant="outlined"
                    value={field.value}
                    errorMessage={fieldState.error?.message ?? ''}
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                )}
              />
            )}

            {!addressData.bairro && (
              <Controller
                control={control}
                name={CEP_FIELD_NAMES.addressNeighborhood}
                render={({ field, fieldState }) => (
                  <Input
                    {...field}
                    name={field.name}
                    label="Bairro"
                    width="fluid"
                    variant="outlined"
                    value={field.value}
                    errorMessage={fieldState.error?.message ?? ''}
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                )}
              />
            )}

            <Controller
              control={control}
              name={CEP_FIELD_NAMES.addressNumber}
              render={({ field, fieldState }) => (
                <Input
                  {...field}
                  name={field.name}
                  disabled={!!hasNoNumber}
                  readOnly={!!hasNoNumber}
                  label="Número"
                  width="fluid"
                  variant="outlined"
                  value={field.value}
                  errorMessage={fieldState.error?.message ?? ''}
                  onChange={(e) => field.onChange(e.target.value)}
                />
              )}
            />

            <Controller
              name={CEP_FIELD_NAMES.hasNoNumber}
              control={control}
              render={({ field }) => (
                // biome-ignore lint/a11y/noLabelWithoutControl: <>
                <label className={s.checkbox}>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={handleHasNoNumberChange}
                  />
                  <Typography as="p" variant="body2" weight="regular">
                    Meu endereço não tem número
                  </Typography>
                </label>
              )}
            />

            <Controller
              control={control}
              name={CEP_FIELD_NAMES.addressAdditionalInfo}
              render={({ field, fieldState }) => (
                <Input
                  {...field}
                  label={hasNoNumber ? 'Complemento' : 'Complemento (Opcional)'}
                  width="fluid"
                  variant="outlined"
                  name={field.name}
                  value={field.value}
                  errorMessage={fieldState.error?.message ?? ''}
                  onChange={(e) => field.onChange(e.target.value)}
                />
              )}
            />
          </div>
        </div>
      )}
    </div>
  )
}
