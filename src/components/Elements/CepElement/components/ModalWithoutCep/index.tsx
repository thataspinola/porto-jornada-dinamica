'use client'

import { IconMagnifierGlass } from '@porto-stack/icons'
import { Link, Modal, Radio, Select, Typography } from '@porto-stack/ui'
import type { ComponentProps } from 'react'
import { useCallback } from 'react'
import { Controller } from 'react-hook-form'

import { buildGtmAttrs, pushEvent } from '@/utils'

import { useAddresses } from '@/hooks/queries/useAddresses'
import { useLocalities } from '@/hooks/queries/useLocalities'
import { useStates } from '@/hooks/queries/useStates'

import { useJourneyStepForm } from '@/components/Core/JourneyStepForm/context'
import { Button, Input } from '@/components/UI'

import { AddressCardShimmer } from './components/AddressCardShimmer'
import { EmptyList } from './components/EmptyList'
import { useAddressErrorHandler } from './hooks/useAddressErrorHandler'
import { useAddressForm } from './hooks/useAddressForm'
import { useAddressSearch } from './hooks/useAddressSearch'
import { useAddressSearchController } from './hooks/useAddressSearchController'
import { useAddressStatus } from './hooks/useAddressStatus'
import { useModalState } from './hooks/useModalState'
import s from './styles.module.scss'

const MODAL_SLUG = 'pesquisa-cep'

function buildBasePageLocation(): string {
  if (typeof window === 'undefined') return ''
  return `${window.location.origin}${window.location.pathname}`
}

export function ModalWithoutCep() {
  const { isModalOpen, setIsModalOpen } = useModalState()
  const { stepTitle } = useJourneyStepForm()
  const handleModalOpenChange = useCallback(
    (open: boolean) => {
      setIsModalOpen(open)
      pushEvent({
        event: 'page_view',
        pageLocation: open
          ? `${buildBasePageLocation()}/modal/${MODAL_SLUG}`
          : buildBasePageLocation()
      })
    },
    [setIsModalOpen]
  )
  const handleCloseModal = useCallback(
    () => handleModalOpenChange(false),
    [handleModalOpenChange]
  )

  const {
    values,
    control,
    register,
    formState,
    resetField,
    handleSubmit,
    setValue: setAddressFormValue
  } = useAddressForm()

  const { isStatesError, isStatesLoading, isStatesSuccess, statesData } =
    useStates({ enabled: isModalOpen })

  const {
    localitiesData,
    isLocalitiesError,
    isLocalitiesLoading,
    isLocalitiesSuccess
  } = useLocalities({
    stateAcronym: values.state
  })

  const { addressSearch, setAddressSearch, clearAddressSearch } =
    useAddressSearch()

  const {
    addressesData,
    isAddressesError,
    isAddressesSuccess,
    isAddressesLoading
  } = useAddresses({
    stateAcronym: addressSearch?.state,
    locationName: addressSearch?.city,
    addressName: addressSearch?.address
  })

  const {
    handleFormSubmit,
    handleCityChange,
    handleStateChange,
    handleLocalitiesError,
    handleConfirmZipcode,
    handleAddressOptionChange
  } = useAddressSearchController({
    resetField,
    addressesData,
    isAddressesLoading,
    setAddressFormValue,
    setAddressSearch,
    clearAddressSearch,
    zipcode: values.zipcode,
    onCloseModal: handleCloseModal
  })

  const {
    showRadioList,
    showEmptyList,
    isCityDisabled,
    showAddressLoading,
    hasStatesFailure,
    hasLocalitiesFailure
  } = useAddressStatus({
    statesData,
    isStatesError,
    addressesData,
    localitiesData,
    isStatesSuccess,
    isAddressesError,
    isAddressesLoading,
    isLocalitiesError,
    isAddressesSuccess,
    isLocalitiesSuccess,
    isLocalitiesLoading,
    hasAddressSearch: !!addressSearch,
    selectedState: values.state
  })

  useAddressErrorHandler({
    hasStatesFailure,
    hasLocalitiesFailure,
    onError: handleCloseModal,
    onLocalitiesError: handleLocalitiesError
  })

  const confirmGtmAttrs = buildGtmAttrs({
    kind: 'button',
    stepTitle,
    label: 'Confirmar CEP'
  })
  const noCepGtmAttrs = buildGtmAttrs({
    kind: 'button',
    stepTitle,
    label: 'Não sei o CEP'
  })

  const handleAddressSearchSubmit: ComponentProps<'form'>['onSubmit'] = (
    event
  ) => {
    event.preventDefault()
    event.stopPropagation()
    handleSubmit(handleFormSubmit)(event)
  }

  return (
    <Modal.Root open={isModalOpen} onOpenChange={handleModalOpenChange}>
      <Modal.Trigger asChild>
        <Link asChild>
          <button type="button" {...noCepGtmAttrs}>
            Não sei o CEP
          </button>
        </Link>
      </Modal.Trigger>
      <Modal.Content>
        <Modal.Body>
          <div className={s.textContent}>
            <Modal.Title>Pesquisa de CEP</Modal.Title>
            <Typography color="neutral-black">
              Preencha os dados e a gente encontra seu CEP para você.
            </Typography>
          </div>
          <form
            noValidate
            onSubmit={handleAddressSearchSubmit}
            className={s.form}>
            <Controller
              control={control}
              name="state"
              render={({ field, fieldState }) => (
                <Select.Root
                  onValueChange={(value) => {
                    field.onChange(value)
                    handleStateChange()
                  }}
                  label="Estado (UF)"
                  errorMessage={fieldState.error?.message ?? ''}
                  isValid={!!field.value && !fieldState.error?.message}
                  isLoading={isStatesLoading}
                  disabled={isStatesLoading}
                  value={field.value ?? ''}>
                  {statesData?.states.map((state) => (
                    <Select.Item
                      value={state.siglaEstado}
                      key={state.siglaEstado}>
                      {state.nomeEstado} ({state.siglaEstado})
                    </Select.Item>
                  ))}
                </Select.Root>
              )}
            />

            <Controller
              control={control}
              name="city"
              render={({ field, fieldState }) => (
                <Select.Root
                  onValueChange={(value) => {
                    field.onChange(value)
                    handleCityChange()
                  }}
                  label="Cidade"
                  errorMessage={fieldState.error?.message ?? ''}
                  isValid={!!field.value && !fieldState.error?.message}
                  isLoading={isLocalitiesLoading}
                  disabled={isCityDisabled}
                  value={field.value ?? ''}>
                  {localitiesData?.localities.map((locality) => (
                    <Select.Item value={locality} key={locality}>
                      {locality}
                    </Select.Item>
                  ))}
                </Select.Root>
              )}
            />

            <div className={s.addressSearchField}>
              <Input
                label="Rua, avenida, alameda"
                width="fluid"
                variant="default"
                helperText="Digite o nome da rua, avenida ou alameda."
                {...register('address')}
              />

              <Button
                size="md"
                type="submit"
                styles="filled"
                variant="primary"
                aria-label="Buscar endereço"
                className={s.searchButton}
                isLoading={showAddressLoading}
                disabled={isAddressesLoading || !formState.isValid}>
                <IconMagnifierGlass size={24} aria-hidden />
              </Button>
            </div>

            {showEmptyList && <EmptyList />}
            {showAddressLoading && <AddressCardShimmer />}
          </form>

          {showRadioList && (
            <div className={s.cepSelection}>
              <Typography as="h3" variant="title6" weight="medium">
                Selecione o CEP do seu endereço
              </Typography>

              <Radio.Group
                value={values.addressOptionValue}
                onValueChange={handleAddressOptionChange}
                className={s.radioGroup}>
                {addressesData?.addresses.map(({ address, zipcode }, index) => {
                  return (
                    <Radio.Item
                      label={address}
                      value={String(index)}
                      className={s.radioItem}
                      title={`CEP ${zipcode}`}
                      key={`${zipcode}-${index}`}
                    />
                  )
                })}
              </Radio.Group>
            </div>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button
            type="button"
            {...confirmGtmAttrs}
            disabled={!values.zipcode}
            className={s.confirmButton}
            onClick={handleConfirmZipcode}>
            Confirmar CEP
          </Button>
        </Modal.Footer>
      </Modal.Content>
    </Modal.Root>
  )
}
