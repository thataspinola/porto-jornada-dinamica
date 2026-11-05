import { useQuery } from '@tanstack/react-query'

import { useJourneyService } from '@/hooks/useJourneyService'

import type { VehicleScope } from '@/constants'

type InstallmentWithoutInsurance = {
  monthlyFee: number
  annualFee: number
  monthlyTotalTffectiveCost: number
  annualTotalEffectiveCost: number
  installmentValue: number
  iof: number
  monthlyFeeNet: number
}

type InstallmentWithInsurance = {
  monthlyFee: number
  annualFee: number
  monthlyTotalTffectiveCost: number
  annualTotalEffectiveCost: number
  installmentValue: number
  iof: number
  monthlyFeeNet: number
}

type Installment = {
  numberOfInstallments: number
  insurancePercentageCost: number
  withoutInsurance: InstallmentWithoutInsurance
  withInsurance: InstallmentWithInsurance
}

type InstallmentsResponse = {
  tableCode: number
  tableCodeWithInsurance: number
  registrationFee: number
  bestNumberOfInsallments: number
  installments: Installment[]
}

type UseInstallmentsParams = {
  vehicleValue: number
  entryValue: number | undefined
  paymentMethod: string
  scope: VehicleScope | undefined
  nonce: number
}

export function useInstallments({
  entryValue,
  paymentMethod,
  vehicleValue,
  scope,
  nonce
}: UseInstallmentsParams) {
  const { executeJourneyService } = useJourneyService()

  const {
    data: installments,
    isLoading: isLoadingInstallments,
    isError: isErrorInstallments,
    refetch: refetchInstallments,
    error: errorInstallments
  } = useQuery({
    queryFn: async () => {
      const result = await executeJourneyService<InstallmentsResponse>({
        fields: {
          vehicleValue,
          entryValue,
          paymentMethod,
          scope
        },
        product: 'financing-loans-vehicle',
        action: 'installments',
        module: 'quotation',
        recaptchaAction: 'installments'
      })

      return result.data
    },
    queryKey: [
      'fcdc-installments',
      vehicleValue,
      entryValue,
      paymentMethod,
      scope,
      nonce
    ],
    enabled: !!vehicleValue && !!entryValue && !!paymentMethod,
    select: (data) => {
      const sortedInstallments = data.installments.sort(
        (a, b) => b.numberOfInstallments - a.numberOfInstallments
      )

      return {
        ...data,
        installments: sortedInstallments
      }
    }
  })

  return {
    installments,
    isLoadingInstallments,
    isErrorInstallments,
    refetchInstallments,
    errorInstallments
  }
}
