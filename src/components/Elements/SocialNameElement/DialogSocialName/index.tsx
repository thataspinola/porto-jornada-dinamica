'use client';
import { Button } from '../../../UI/Button';
import { Dialog } from '../../../UI/Dialog';
import { Flex } from '../../../UI/Flex';
import { Spacing } from '../../../UI/Spacing';
import { Typography } from '../../../UI/Typography';

import type { DialogSocialNameProps } from './types';

export const DialogSocialName = ({
  isOpen,
  handleCloseSocialNameDialog,
  handleSetSocialNameToTrue,
}: DialogSocialNameProps) => {
  return (
    <Dialog isOpen={isOpen} title="Você é uma pessoa travesti ou transexual?" variant="medium">
      <Typography variant="body1" as="p" color="neutral-800">
        Caso seja, pode usar seu nome social na Porto.
      </Typography>
      <Spacing bottom={1.6} />
      <Typography variant="body1" as="p" color="neutral-800">
        <Typography variant="body1" as="span" color="neutral-800" weight="bold">
          Atenção! Não informe:
        </Typography>{' '}
        apelido; nome fantasia, comercial ou religioso; titulação profissional,
        acadêmica; pronome de tratamento.
      </Typography>
      <Spacing bottom={2.4} />
      <Flex gap={1.6} justify='end'>
        <Button
          size="large"
          onClick={() => handleCloseSocialNameDialog()}
          variant="negative"
          styles="secondary"
          width='contain'
        >
          Não sou
        </Button>
        <Button size="large" width='contain' onClick={() => handleSetSocialNameToTrue()}>
          Sim, eu sou
        </Button>
      </Flex>
    </Dialog>
  );
};
