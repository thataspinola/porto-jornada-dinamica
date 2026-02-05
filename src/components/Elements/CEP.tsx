'use client';

import {
  Input,
  type InputProps,
  Typography,
} from "@porto/js-library-corp-hubv-porto-ocean";

export const CepElement = (props: InputProps) => {
  return (
    <div>
      <Input />
      <Typography>Não sei o CEP</Typography>
    </div>
  );
};
