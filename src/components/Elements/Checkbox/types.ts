import type { HTMLAttributes } from "react";

export type CheckboxProps = Omit<HTMLAttributes<HTMLDivElement>, 'onClick'> & {
  variant?: "default" | "checked" | "disabled";
  label?: string;
  value?: boolean;
  handleClick?: (value: boolean) => void;
};
