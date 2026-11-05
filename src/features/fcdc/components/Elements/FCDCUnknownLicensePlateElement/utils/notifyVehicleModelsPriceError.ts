import { notify } from '@porto-stack/ui/utils'

export function notifyVehicleModelsPriceError() {
  notify({
    type: 'error',
    title: 'Poxa, parece que nosso sistema não está funcionando',
    description: 'Estamos trabalhando para que volte ao normal o quanto antes.'
  })
}
