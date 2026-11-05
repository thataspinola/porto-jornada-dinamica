import { useQuery } from '@tanstack/react-query'

import { useJourneyService } from '@/hooks/useJourneyService'

import { VEHICLE_SCOPE } from '@/constants'

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
  insurance: number
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
  insuranceAmount: number
  requestedAmount: number
  installments: Installment[]
}

type UseInstallmentsParams = {
  vehicleValue: number
  entryValue: number | undefined
  paymentMethod: string
  nonce: number
}

export function useInstallments({
  entryValue,
  paymentMethod,
  vehicleValue,
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
          scope: VEHICLE_SCOPE.knownPlate
        },
        product: 'financing-loans-vehicle-guarantee',
        action: 'installments',
        module: 'quotation',
        recaptchaAction: 'installments'
      })

      return result.data
    },
    queryKey: [
      'reff-installments',
      vehicleValue,
      entryValue,
      paymentMethod,
      nonce
    ],
    enabled: !!vehicleValue && entryValue !== undefined && !!paymentMethod,
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
