'use client'

import { Button, Dialog } from '@/components/UI'

import type { DialogSocialNameProps } from './types'

export const DialogSocialName = ({
  isOpen,
  handleCloseSocialNameDialog,
  handleSetSocialNameToTrue
}: DialogSocialNameProps) => {
  return (
    <Dialog.Root open={isOpen}>
      <Dialog.Content>
        <Dialog.Body>
          <Dialog.Title>Você é uma pessoa travesti ou transexual?</Dialog.Title>
          <Dialog.Description>
            Caso seja, pode usar seu nome social na Porto.
            <br />
            <br />
            Atenção! Não informe: apelido; nome fantasia, comercial ou
            religioso; titulação profissional, acadêmica; pronome de tratamento.
          </Dialog.Description>
        </Dialog.Body>

        <Dialog.Footer>
          <Button size="sm" onClick={handleSetSocialNameToTrue}>
            Sim, eu sou
          </Button>
          <Dialog.Close asChild>
            <Button
              size="sm"
              onClick={handleCloseSocialNameDialog}
              styles="stroke">
              Não sou
            </Button>
          </Dialog.Close>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  )
}
