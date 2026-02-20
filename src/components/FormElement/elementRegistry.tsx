import { Button } from "../Elements/Button";
import { Checkbox } from "../Elements/Checkbox";
import { CPF } from "../Elements/CPF";
import { Dropdown } from "../Elements/Dropdown";
import { FinancialSimulator } from "../Elements/FinancilaSimulator";
import { Input } from "../Elements/Input";
import { InputCurrency } from "../Elements/InputCurrency";
import { LicensePlate } from "../Elements/LicensePlate";
import { Link } from "../Elements/Link";
import { RadioGroup } from "../Elements/RadioGroup";
import { Spacing } from "../Elements/Spacing";
import { Typography } from "../Elements/Typography";

export const ElementRegistry: Record<string, React.FC<any>> = {
  typography: Typography,
  button: Button,
  link: Link,
  cpf: CPF,
  text: Input,
  checkbox: Checkbox,
  radio: RadioGroup,
  licensePlate: LicensePlate,
  spacing: Spacing,
  dropdown: Dropdown,
  currency: InputCurrency,
  financialSimulator: FinancialSimulator
};
