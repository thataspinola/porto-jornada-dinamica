import { Typography } from '@porto-stack/ui'

import styles from './styles.module.scss'

export function EmptyList() {
  return (
    <div className={styles.emptyListContainer}>
      <Typography as="h3" variant="title6" weight="medium">
        CEP não encontrado
      </Typography>
      <Typography as="p" variant="body1" color="neutral-700">
        Confira o nome da cidade e/ou logradouro (rua, avenida, alameda) e tente
        novamente.
      </Typography>
    </div>
  )
}
