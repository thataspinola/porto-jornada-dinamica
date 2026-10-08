import type { HTMLAttributes, ReactNode } from "react";

export type NotificationProps = HTMLAttributes<HTMLDivElement> & {
  variant?:
  | "default"
  | "outlined"
  | "information"
  | "attention"
  | "success"
  | "error";

  title?: string;
  icon: ReactNode;
  description: string;
  className?: string;
  link?: {
    label: string;
    href: string;
  };
};
