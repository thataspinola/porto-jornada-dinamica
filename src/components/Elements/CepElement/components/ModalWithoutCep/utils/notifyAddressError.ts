import { notify } from '@porto-stack/ui/utils'

type NotifyAddressErrorProps = {
  onRetry?: () => void
}

export function notifyAddressError({ onRetry }: NotifyAddressErrorProps = {}) {
  notify({
    type: 'error',
    title: 'Poxa, parece que o nosso serviço de CEP não está funcionando',
    description: 'Estamos trabalhando para que volte ao normal o quanto antes.',
    actionButton: {
      children: 'Tentar novamente',
      onClick: onRetry
    }
  })
}
