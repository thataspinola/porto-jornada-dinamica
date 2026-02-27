/** biome-ignore-all lint/a11y/noStaticElementInteractions: <explanation> */

import { clsx, plateMask } from "@/utils";
import { useState } from "react";

import "./styles.scss";

import { Loader } from "../Loader";
import type { LicensePlateProps } from "./types";

/**
 * Componente LicensePlate que permite a entrada de texto com vários estados e feedbacks visuais.
 *
 * @component
 * @param {Object} props - As propriedades do componente LicensePlate
 * @param {string} [props.className=""] - Classes CSS adicionais para o LicensePlate
 * @param {string} [props.name=""] - Nome do campo de entrada, usado para identificação em formulários
 * @param {"default" | string} [props.variant="default"] - Variante visual do LicensePlate
 * @param {"contain" | "fluid"} [props.width="contain"] - Largura do LicensePlate (contain: ajustado ao conteúdo, fluid: ocupa todo o espaço disponível)
 * @param {boolean} [props.disabled=false] - Indica se o LicensePlate está desabilitado
 * @param {string | number} [props.value=""] - Valor atual do LicensePlate
 * @param {boolean} [props.isLoading=false] - Indica se o LicensePlate está em estado de carregamento
 * @param {string} [props.helperText=""] - Texto de ajuda exibido abaixo do LicensePlate
 * @param {string} [props.errorMessage=""] - Mensagem de erro exibida quando há um erro de validação
 * @param {string} [props.label=""] - Rótulo do LicensePlate
 * @param {React.ReactNode} [props.children] - Conteúdo adicional do LicensePlate
 * @param {Function} [props.onChange] - Função chamada quando o valor do LicensePlate muda
 *
 * @example
 * // LicensePlate básico com label
 * <LicensePlate label="Placa" name="placa" />
 *
 * @example
 * // LicensePlate com texto de ajuda
 * <LicensePlate
 *   label="Email"
 *   name="email"
 *   helperText="Digite seu email principal"
 * />
 *
 * @example
 * // LicensePlate com mensagem de erro
 * <LicensePlate
 *   label="Placa"
 *   name="placa"
 *   errorMessage="Campo obrigatório"
 * />
 *
 * @example
 * // LicensePlate em estado de carregamento
 * <LicensePlate
 *   label="placa"
 *   name="placa"
 *   isLoading={true}
 * />
 *
 * @returns {JSX.Element} Componente LicensePlate renderizado
 */

export const LicensePlate = ({
  className = "",
  name = "",
  variant = "default",
  width = "fluid",
  disabled = false,
  value = "",
  isLoading = false,
  helperText = "",
  errorMessage = "",
  label = "Placa do veículo",
  onChange,
}: LicensePlateProps) => {
  const [focused, setFocused] = useState(false);

  const handleFocus = (isFocus: boolean) => {
    if (disabled) return;
    setFocused(isFocus);
  };
  const isError = errorMessage.length > 0;
  const isFilled = value?.toString().length > 0;
  const classes = clsx(
    "input__root",
    `--${variant}`,
    `--${width}`,
    { "--filled": !!isFilled },
    { "--focused": focused },
    { "--disabled": disabled },
    { "--error": isError },
    className,
  );

  return (
    <div
      className={classes}
      onFocus={() => handleFocus(true)}
      onBlur={() => handleFocus(false)}
      style={{ marginBottom: "32px" }}
    >
      <div className="input__box">
        {label && (
          <label htmlFor={name} className="input__label">
            {label}
          </label>
        )}
        <input
          id={name}
          name={name}
          type="text"
          className="input__field"
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(plateMask(e.target.value))}
        />
      </div>

      {isLoading && <Loader className="input__loader" color="insurance-900" />}

      {helperText && <p className="input__helper-text">{helperText}</p>}
      {isError && <p className="input__error-message">{errorMessage}</p>}
    </div>
  );
};
