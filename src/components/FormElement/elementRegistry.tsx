import { Button } from "../Elements/Button";
import { Checkbox } from "../Elements/Checkbox";
import { CPF } from "../Elements/CPF";
import { Input } from "../Elements/Input";
import { RadioGroup } from "../Elements/RadioGroup";
import { Spacing } from "../Elements/Spacing";
import { Typography } from "../Elements/Typography";

export const ElementRegistry: Record<string, React.FC<any>> = {
  typography: Typography,
  button: Button,
  cpf: CPF,
  input: Input,
  checkbox: Checkbox,
  radio: RadioGroup,
  spacing: Spacing,
};
