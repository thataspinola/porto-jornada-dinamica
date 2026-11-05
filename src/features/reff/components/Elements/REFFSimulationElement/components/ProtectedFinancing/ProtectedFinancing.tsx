import {
  IconCheck,
  IconCircleCheck,
  IconCircleQuestion,
  IconClose,
  IconShield
} from '@porto-stack/icons'
import { Modal, Notification, Switch, Typography } from '@porto-stack/ui'
import { useCallback, useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'

import { Button } from '@/components/UI'

import styles from './ProtectedFinancing.module.scss'

type ProtectedFinancingProps = {
  withInsurance: boolean
}

export function ProtectedFinancing({ withInsurance }: ProtectedFinancingProps) {
  const [protectedFinancingModal, setProtectedFinancingModal] = useState<{
    type: 'INFO' | 'WARNING'
    visible: boolean
  }>({
    type: 'INFO',
    visible: false
  })

  const { setValue } = useFormContext()

  const handleOpenProtectedFinancingModal = useCallback(
    (type: 'INFO' | 'WARNING') => {
      setProtectedFinancingModal({ type, visible: true })
    },
    []
  )

  const handleCloseProtectedFinancingModal = useCallback(() => {
    setProtectedFinancingModal((prevState) => ({
      ...prevState,
      visible: false
    }))
  }, [])

  const handleInactiveProtectedFinancing = useCallback(() => {
    setValue('withInsurance', false)
    handleCloseProtectedFinancingModal()
  }, [handleCloseProtectedFinancingModal, setValue])

  const handleKeepProtectedFinancing = useCallback(() => {
    handleCloseProtectedFinancingModal()
  }, [handleCloseProtectedFinancingModal])

  return (
    <>
      <div className={styles.protectedFinancingContainer}>
        <div className={styles.protectedFinancingHeader}>
          <div className={styles.protectedFinancingInfo}>
            <IconShield
              size={32}
              color={withInsurance ? 'success-500' : 'danger-500'}
            />
            <Typography
              variant="body1"
              weight="bold"
              color={withInsurance ? 'success-900' : 'danger-900'}>
              {withInsurance
                ? 'Empréstimo protegido'
                : 'Empréstimo desprotegido'}
            </Typography>
            <button
              type="button"
              onClick={() => handleOpenProtectedFinancingModal('INFO')}>
              <IconCircleQuestion size={16} color="seguro-900" />
            </button>
          </div>

          <Controller
            name="withInsurance"
            render={({ field }) => (
              <Switch
                defaultChecked
                checked={field.value}
                onCheckedChange={(checked) => {
                  if (checked) {
                    field.onChange(true)
                    return
                  }
                  handleOpenProtectedFinancingModal('WARNING')
                }}
              />
            )}
          />
        </div>

        <ul className={styles.protectedFinancingBenefits}>
          <li>
            {withInsurance ? (
              <IconCheck size={20} color="success-500" />
            ) : (
              <IconClose size={20} color="danger-500" />
            )}
            <Typography
              color={withInsurance ? 'neutral-800' : 'danger-900'}
              variant="body2">
              {withInsurance ? (
                <>
                  Seguro contra <strong>desemprego involuntário</strong>
                  <span>;</span>
                </>
              ) : (
                <>
                  Sem proteção em caso de{' '}
                  <strong>desemprego involuntário</strong>;
                </>
              )}
            </Typography>
          </li>
          <li>
            {withInsurance ? (
              <IconCheck size={20} color="success-500" />
            ) : (
              <IconClose size={20} color="danger-500" />
            )}
            <Typography
              color={withInsurance ? 'neutral-800' : 'danger-900'}
              variant="body2">
              {withInsurance ? (
                <>
                  Proteção em caso de <strong>invalidez ou morte</strong>;
                </>
              ) : (
                <>
                  Sem proteção em caso de <strong>invalidez ou morte</strong>;
                </>
              )}
            </Typography>
          </li>
          <li>
            {withInsurance ? (
              <IconCheck size={20} color="success-500" />
            ) : (
              <IconClose size={20} color="danger-500" />
            )}
            <Typography
              color={withInsurance ? 'neutral-800' : 'danger-900'}
              variant="body2">
              {withInsurance ? (
                <strong>Taxa de juros reduzida;</strong>
              ) : (
                <strong>Sem taxa de juros reduzida;</strong>
              )}
            </Typography>
          </li>
          <li>
            {withInsurance ? (
              <IconCheck size={20} color="success-500" />
            ) : (
              <IconClose size={20} color="danger-500" />
            )}
            <Typography
              color={withInsurance ? 'neutral-800' : 'danger-900'}
              variant="body2">
              {withInsurance ? (
                <>
                  Sorteios mensais de <strong> até R$ 30.000,00</strong>.
                </>
              ) : (
                <>
                  Sem sorteios mensais de <strong>até R$ 30.000,00</strong>.
                </>
              )}
            </Typography>
          </li>
        </ul>
      </div>

      <Modal.Root
        open={protectedFinancingModal.visible}
        onOpenChange={handleCloseProtectedFinancingModal}>
        <Modal.Content>
          <Modal.Body className={styles.protectedFinancingModalBody}>
            <div className={styles.protectedFinancingModalHeader}>
              <Modal.Title
                weight="semibold"
                className={styles.protectedFinancingModalTitle}>
                Empréstimo protegido
              </Modal.Title>

              <Typography variant="body1">
                Imprevistos acontecem, por isso evite correr riscos. A nossa
                proteção garante a você:
              </Typography>
            </div>

            <ul className={styles.protectedFinancingModalBenefits}>
              <li className={styles.protectedFinancingModalBenefitItem}>
                <IconCircleCheck size={24} />
                <div>
                  <Typography variant="body2">
                    Proteção em caso de desemprego involuntário sem justa causa
                    ou incapacidade temporária.
                  </Typography>
                  <Typography variant="caption" color="neutral-800">
                    Cobertura de 3 parcelas de até R$ 1.500,00 cada.
                  </Typography>
                </div>
              </li>
              <li className={styles.protectedFinancingModalBenefitItem}>
                <IconCircleCheck size={24} />
                <div>
                  <Typography variant="body2">
                    Proteção em caso de invalidez, morte natural ou acidental.
                  </Typography>
                  <Typography variant="caption" color="neutral-800">
                    Cobertura de até R$ 300 mil.
                  </Typography>
                </div>
              </li>
              <li className={styles.protectedFinancingModalBenefitItem}>
                <IconCircleCheck size={24} />
                <div>
                  <Typography variant="body2"></Typography>
                  Taxa de juros reduzida;
                </div>
              </li>
              <li className={styles.protectedFinancingModalBenefitItem}>
                <IconCircleCheck size={24} />
                <div>
                  <Typography variant="body2">
                    Sorteios mensais de até R$ 30.000,00.
                  </Typography>
                  <Typography variant="caption" color="neutral-800">
                    Regras e condições em{' '}
                    <a
                      href="https://porto.vc/e_prot"
                      target="_blank"
                      rel="noopener noreferrer">
                      <Typography variant="caption" color="seguro-900">
                        porto.vc/e_prot
                      </Typography>
                    </a>
                  </Typography>
                </div>
              </li>
            </ul>

            {protectedFinancingModal.type === 'WARNING' && (
              <Notification.Root
                variant="warning"
                className={styles.protectedFinancingModalNotification}>
                <Notification.Description>
                  <strong>Ao desativar, você perde tudo isso</strong>. Que tal
                  manter a proteção para garantir sua segurança?
                </Notification.Description>
              </Notification.Root>
            )}

            <Typography variant="caption" color="neutral-800">
              *Benefício sujeito a critérios de elegibilidade.
            </Typography>

            <div className={styles.protectedFinancingModalActions}>
              {protectedFinancingModal.type === 'WARNING' ? (
                <>
                  <Button
                    type="button"
                    styles="ghost"
                    onClick={handleInactiveProtectedFinancing}>
                    Desativar proteção
                  </Button>

                  <Button type="button" onClick={handleKeepProtectedFinancing}>
                    Manter proteção
                  </Button>
                </>
              ) : (
                <Button onClick={handleCloseProtectedFinancingModal}>
                  Ok, entendi
                </Button>
              )}
            </div>
          </Modal.Body>
        </Modal.Content>
      </Modal.Root>
    </>
  )
}
