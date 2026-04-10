import type { HTMLAttributes } from "react";

export type CheckboxProps = Omit<HTMLAttributes<HTMLDivElement>, "onClick"> & {
  disabled?: boolean;
  label?: string;
  value?: boolean;
  handleClick?: (value: boolean) => void;
};
