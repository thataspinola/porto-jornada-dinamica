import { IconArrowRight, IconCircleInfo } from '@porto-stack/icons'
import { Button, Checkbox } from '@porto-stack/ui'
import { clsx } from '@porto-stack/ui/utils'

import type { PlanViewModel } from '@/components/Elements/PlanCardElement/hooks'
import { Text } from '@/components/UI/Text/Text'

import s from './PlanCard.module.scss'

type PlanCardProps = {
  plan: PlanViewModel
  turbineValues: string[]
  priceValue: string
  onSelect: () => void
  onTurbineChange: (optionId: string, checked: boolean) => void
  onDetails: () => void
  className?: string
  gtmAttrs?: Record<string, string>
  detailsGtmAttrs?: Record<string, string>
}

export function PlanCard({
  plan,
  turbineValues,
  priceValue,
  onSelect,
  onTurbineChange,
  onDetails,
  className,
  gtmAttrs,
  detailsGtmAttrs
}: PlanCardProps) {
  const hasCta = !!plan.cta
  const hasCoverages = (plan.coverages?.items.length ?? 0) > 0
  const hasTurbine = (plan.turbine?.options.length ?? 0) > 0
  const hasDetails = !!plan.details

  return (
    <div
      className={clsx(s.root, plan.highlighted && s.highlighted, className)}
      data-plan-id={plan.id}>
      {plan.badge && (
        <div className={s.badge}>
          <Text
            text={plan.badge}
            as="span"
            variant="body2"
            color="neutral-white"
          />
        </div>
      )}

      <Text
        text={plan.title}
        as="h3"
        variant="title5"
        lineClamp={3}
        className={s.title}
        data-section="title"
      />

      <div className={s.priceBlock} data-section="price-block">
        {plan.installments && <Text text={plan.installments} variant="body2" />}

        <div className={s.price}>
          {plan.price.prefix && (
            <Text
              text={plan.price.prefix}
              as="span"
              variant="body2"
              weight="bold"
            />
          )}
          <Text text={priceValue} as="span" variant="title3" weight="bold" />
          {plan.price.suffix && (
            <Text text={plan.price.suffix} as="span" variant="body2" />
          )}
        </div>
      </div>

      {hasCta && (
        <div className={s.cta}>
          <Button
            variant="primary"
            styles="filled"
            fluid
            onClick={onSelect}
            {...gtmAttrs}>
            {plan.cta!.label ?? 'Escolher este plano'}
          </Button>
          {plan.cta!.indemnity && (
            <div className={s.indemnity}>
              <Text text={plan.cta!.indemnity} as="span" variant="body2" />
            </div>
          )}
        </div>
      )}

      {hasCoverages && (
        <div className={s.coverages} data-section="coverages">
          <div className={s.coveragesHeader}>
            <Text
              text={plan.coverages.label ?? 'Principais coberturas'}
              variant="body2"
              weight="bold"
            />
            <IconCircleInfo size={20} color="neutral-700" />
          </div>

          <div className={s.coveragesList}>
            {plan.coverages.items.map((coverage, index) => (
              <div
                key={coverage.title}
                className={s.coverageItem}
                data-coverage-index={index}>
                <div className={s.coverageContent}>
                  <Text text={coverage.title} variant="body2" />
                  {coverage.description && (
                    <Text
                      text={coverage.description}
                      variant="body2"
                      color="seguro-900"
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {hasTurbine && (
        <div className={s.turbine}>
          <Text
            text={plan.turbine.label ?? 'Turbine'}
            variant="body1"
            weight="bold"
          />

          <div className={s.turbineOptions}>
            {plan.turbine.options.map((option) => (
              // biome-ignore lint/a11y/noLabelWithoutControl: <Checkbox> renders its own input internally
              <label key={option.id} className={s.turbineOption}>
                <div className={s.turbineOptionRow}>
                  <Checkbox
                    checked={turbineValues.includes(option.id)}
                    onCheckedChange={(checked) =>
                      onTurbineChange(option.id, checked === true)
                    }
                    disabled={option.disabled}
                  />
                  <div className={s.turbineOptionText}>
                    {!option.description
                      ?.trimStart()
                      .startsWith(option.label) && (
                      <Text text={option.label} variant="body2" />
                    )}
                    {option.description && (
                      <Text text={option.description} variant="body2" />
                    )}
                    {option.additionalPrice && (
                      <div className={s.turbinePrice}>
                        <Text
                          text={option.additionalPrice}
                          as="span"
                          variant="body2"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>
      )}

      {hasDetails && (
        <button
          type="button"
          className={s.details}
          onClick={onDetails}
          {...detailsGtmAttrs}>
          <Text
            text={plan.details!.label ?? 'Ver detalhes'}
            as="span"
            variant="body1"
            color="seguro-900"
          />
          <IconArrowRight size={16} color="seguro-900" />
        </button>
      )}
    </div>
  )
}
