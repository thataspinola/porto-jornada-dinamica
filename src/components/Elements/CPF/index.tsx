import { cpfMask } from "@/utils";
import { Input } from "../Input";

export const CPF = ({ value, onChange, label, errorMessage }: any) => {
  return (
    <Input
      value={value}
      onChange={value => onChange(cpfMask(value))}
      label={label}
      errorMessage={errorMessage}
    />
  );
}
