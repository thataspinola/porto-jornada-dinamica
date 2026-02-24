import { Button } from "../Elements/Button";
import { Checkbox } from "../Elements/Checkbox";
import { CPF } from "../Elements/CPF";
import { Dropdown } from "../Elements/Dropdown";
import { Input } from "../Elements/Input";
import { Link } from "../Elements/Link";
import { Paragraph } from "../Elements/Paragraph";
import { RadioGroup } from "../Elements/RadioGroup";
import { Title } from "../Elements/Title";

export const ElementRegistry: Record<string, React.FC<any>> = {
  TITLE: Title,
  PARAGRAPH: Paragraph,
  button: Button,
  CPF_INPUT: CPF,
  TEXT_INPUT: Input,
  NAVIGATION: Link,
  CHECKBOX: Checkbox,
  RADIO: RadioGroup,
  SELECT: Dropdown,
};
