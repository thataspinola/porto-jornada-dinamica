"use client";
import { clsx } from "@/utils";
import NextLink from "next/link";

import "./styles.scss";

import type { LinkProps } from "./types";

/**
 * Componente Link que encapsula o componente Next/Link com estilos adicionais.
 *
 * @component
 * @param {Object} props - As propriedades do componente Link
 * @param {"insurance" | "banking" | "health" | "negative"} [props.variant="insurance"] - Variante visual do link
 * @param {"primary" | "secondary" | "ghost"} [props.styles="primary"] - Estilo visual do link
 * @param {"small" | "large"} [props.size="large"] - Tamanho do link
 * @param {"contain" | "fluid"} [props.width="contain"] - Largura do link (contain: ajustado ao conteúdo, fluid: ocupa todo o espaço disponível)
 * @param {string} [props.href="#"] - URL de destino do link
 * @param {boolean} [props.disabled=false] - Indica se o link está desabilitado
 * @param {string} [props.className=""] - Classes CSS adicionais para o link
 * @param {React.ReactNode} props.children - Conteúdo do link
 *
 * @example
 * // Link básico
 * <Link href="/pagina">Ir para página</Link>
 *
 * @example
 * // Link com estilo secundário e tamanho pequeno
 * <Link href="/contato" styles="secondary" size="small">Entre em contato</Link>
 *
 * @example
 * // Link desabilitado
 * <Link href="/indisponivel" disabled>Página indisponível</Link>
 *
 * @returns {JSX.Element} Componente Link renderizado
 */

export const Link = ({
  variant = "insurance",
  styles = "primary",
  size = "large",
  width = "fluid",
  url = "#",
  disabled = false,
  className = "",
  label,
  children,
  ...restProps
}: LinkProps) => {
  const classes = clsx(
    "link",
    {
      [`--disabled-${styles}`]: disabled,
      [`--${variant}-${styles}`]: !disabled,
    },
    `--${size}`,
    `--${width}`,
    className,
  );

  return (
    <NextLink
      href={url}
      target="_self"
      className={classes}
      disabled={disabled}
      {...restProps}
      style={{ marginBottom: "8px" }}
    >
      {label || children}
    </NextLink>
  );
};
