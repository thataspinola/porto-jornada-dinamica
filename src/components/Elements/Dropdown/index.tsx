import { useState } from "react";

import "./styles.scss";

import { clsx } from "@/utils";
import { Loader } from "../Loader";
import { ArrowSvg } from "./Arrow";

import type { DropdownOption, DropdownProps } from "./types";

/**
 * `Dropdown` — Componente de seleção baseado em lista suspensa.
 *
 * Permite ao usuário escolher uma opção dentre várias, com suporte a estados como carregamento, erro,
 * leitura, preenchido e desabilitado. Suporta personalização de tamanho, variante visual e largura.
 *
 * @component
 *
 * @param {Object} props - Propriedades do componente
 * @param {string} [props.className=''] - Classe CSS adicional para estilização externa
 * @param {string} [props.name=''] - Nome do campo, utilizado no `input` interno
 * @param {"default" | "outlined" | "filled"} [props.variant='default'] - Variante visual do campo
 * @param {"contain" | "full"} [props.width='contain'] - Largura do dropdown
 * @param {boolean} [props.disabled=false] - Define se o dropdown está desabilitado
 * @param {string} [props.errorMessage=''] - Mensagem de erro exibida abaixo do campo
 * @param {string} [props.helperText=''] - Texto auxiliar exibido abaixo do campo
 * @param {string} [props.label=''] - Rótulo do campo exibido acima do dropdown
 * @param {boolean} [props.isLoading=false] - Exibe um indicador de carregamento no dropdown
 * @param {Array<{ label: string; value: string }>} [props.options=[]] - Lista de opções disponíveis para seleção
 * @param {string} [props.value=''] - Valor atualmente selecionado
 * @param {boolean} [props.readOnly=false] - Se `true`, impede a interação com o campo (modo leitura)
 * @param {(value: string) => void} [props.onChange] - Função executada ao selecionar uma nova opção
 * @param {React.HTMLAttributes<HTMLDivElement>} props.restProps - Atributos HTML adicionais aplicáveis à `div` raiz
 *
 * @example
 * ```tsx
 * <Dropdown
 *   label="Selecione um plano"
 *   name="plano"
 *   options={[
 *     { label: "Básico", value: "basic" },
 *     { label: "Premium", value: "premium" },
 *   ]}
 *   value="premium"
 *   onChange={(val) => console.log("Selecionado:", val)}
 * />
 * ```
 *
 * @returns {JSX.Element} O componente Dropdown renderizado
 */

export const Dropdown = ({
  className = "",
  name = "",
  variant = "default",
  width = "contain",
  disabled = false,
  errorMessage = "",
  helperText = "",
  label = "",
  isLoading = false,
  options = [],
  value = "",
  readOnly = false,
  onChange,
  ...props
}: DropdownProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const classes = clsx(
    "dropdown__root",
    `--${variant}`,
    `--${width}`,
    { "--filled": !!value },
    { "--focused": isFocused },
    { "--disabled": disabled },
    { "--error": !!errorMessage },
    className,
  );

  const handleSelectOption = (option: DropdownOption) => {
    onChange?.(option.value);
    setIsOpen(false);
  };

  const toggleDropdown = () => {
    if (disabled) return;
    setIsOpen((prev) => !prev);
  };

  return (
    <div
      className={classes}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      {...props}
      style={{ marginBottom: '32px' }}
    >
      <div
        className="dropdown__trigger"
        onClick={toggleDropdown}
        onKeyDown={toggleDropdown}
      >
        {label && (
          <label htmlFor={name} className="dropdown__label">
            {label}
          </label>
        )}

        <input
          id={name}
          name={name}
          type="text"
          className={`dropdown__field ${readOnly ? "--readonly" : ""}`}
          value={value}
          readOnly
          tabIndex={-1}
        />

        {isLoading ? (
          <Loader color="insurance-900" data-testid="loader" />
        ) : (
          <ArrowSvg isOpen={isOpen} />
        )}
      </div>

      {isOpen && (
        <ul className="dropdown__list">
          {options.map((option) => (
            <li
              key={option.value}
              className="dropdown__item"
              aria-selected={value === option.value}
              onClick={() => handleSelectOption(option)}
              onKeyDown={(e) =>
                e.key === "Enter" || e.key === " "
                  ? handleSelectOption(option)
                  : undefined
              }
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}

      {helperText && !errorMessage && (
        <p className="dropdown__helper-text">{helperText}</p>
      )}
      {errorMessage && (
        <p className="dropdown__error-message">{errorMessage}</p>
      )}
    </div>
  );
};
