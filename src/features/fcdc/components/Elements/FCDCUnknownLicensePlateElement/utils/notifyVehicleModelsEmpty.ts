import { notify } from '@porto-stack/ui/utils'

export function notifyVehicleModelsEmpty() {
  notify({
    type: 'error',
    title: 'Não encontramos modelos para essa combinação',
    description:
      'Altere marca, ano do modelo ou condição do veículo e tente novamente.'
  })
}
