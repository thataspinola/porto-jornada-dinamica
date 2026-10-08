/** biome-ignore-all lint/a11y/useKeyWithClickEvents: <> */
/** biome-ignore-all lint/a11y/noStaticElementInteractions: <> */

import { clsx } from "@/utils";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import "./styles.scss";
import type { DialogProps } from "./types";

export const Dialog = ({
  isOpen,
  onClose,
  variant = "small",
  title,
  subtitle,
  description,
  icon,
  children,
  footer,
  footerVariant = "row",
  className = "",
  ...restProps
}: DialogProps) => {
  const [mounted, setMounted] = useState(false);

  // Garante que o portal só seja criado no cliente
  useEffect(() => {
    setMounted(true);
  }, []);

  // Impede o scroll do body quando o modal está aberto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  if (!mounted || (!isOpen && !mounted)) return null;

  const handleOverlayClick = () => onClose?.();

  const overlayClasses = clsx("dialog__overlay", {
    "is-open": isOpen,
  });

  const boxClasses = clsx("dialog__box", `--${variant}`, className, {
    "is-open": isOpen,
  });

  return createPortal(
    <div className={overlayClasses} onClick={handleOverlayClick} {...restProps}>
      <div
        className={boxClasses}
        onClick={(e) => e.stopPropagation()}
      >
        {(title || subtitle || icon) && (
          <div className="dialog__header">
            {icon && <div className="dialog__icon">{icon}</div>}
            {(title || subtitle) && (
              <div className="dialog__title-container">
                {title && <h2 className="dialog__title">{title}</h2>}
                {subtitle && <h3 className="dialog__subtitle">{subtitle}</h3>}
              </div>
            )}
          </div>
        )}

        {description && (
          <div className="dialog__description">{description}</div>
        )}

        {children && <div className="dialog__body">{children}</div>}

        {footer && (
          <div className={clsx("dialog__footer", `--${footerVariant}`)}>
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
};
