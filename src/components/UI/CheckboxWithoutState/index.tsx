/** biome-ignore-all lint/a11y/useKeyWithClickEvents: <> */
/** biome-ignore-all lint/security/noDangerouslySetInnerHtml: <> */
/** biome-ignore-all lint/a11y/noStaticElementInteractions: <> */
"use client";
import "./styles.scss";

import type { CheckboxProps } from "./types";

/**
 * `Checkbox` — Componente de caixa de seleção com suporte a diferentes estados visuais.
 *
 * Pode ser utilizado para representar opções selecionáveis em formulários e interfaces interativas.
 * Suporta três variantes de estado: padrão, marcado e desabilitado, além de permitir rótulos com HTML.
 *
 * @component
 *
 * @param {Object} props - Propriedades do componente
 * @param {string} [props.className=''] - Classe CSS adicional para personalização do estilo externo
 * @param {"default" | "checked" | "disabled"} [props.variant='default'] - Estado visual do CheckboxWithoutState:
 *  - `"default"`: caixa padrão (não marcada)
 *  - `"checked"`: caixa marcada
 *  - `"disabled"`: caixa desabilitada, sem interação
 * @param {string} [props.label=''] - Texto do rótulo associado ao checkbox (aceita HTML via `dangerouslySetInnerHTML`)
 * @param {string} [props.title=''] - Texto alternativo (tooltip) para o elemento de entrada
 *
 * @example
 * <CheckboxWithoutState label="Aceito os termos" />
 *
 * @example
 * <CheckboxWithoutState variant="checked" label="Opção selecionada" />
 *
 * @example
 * <CheckboxWithoutState variant="disabled" label="Opção indisponível" />
 *
 * @example
 * <CheckboxWithoutState label="Aceito os <strong>termos</strong> e <a href='/termos'>condições</a>" />
 *
 * @returns {JSX.Element} Elemento JSX representando o CheckboxWithoutState renderizado
 */

export const CheckboxWithoutState = ({
  className = "",
  value = false,
  label = "",
  title = "",
  disabled = false,
  handleClick,
}: CheckboxProps) => {
  const disabledClass = disabled ? "--disabled" : "";

  const handleClickChange = () => {
    handleClick(!value);
  };

  return (
    <div
      onClick={handleClickChange}
      className={`checkbox__root --${value ? "checked" : "default"} ${disabledClass} ${className}`}
      style={{ marginBottom: "32px" }}
    >
      <div className="checkbox__input" title={title}>
        <svg
          width="21"
          height="20"
          viewBox="0 0 21 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="checkbox__svg"
        >
          <title>checkbox</title>
          <path
            d="M5.5 9.16604L9.61714 13.3334L15.5 6.66676"
            stroke="white"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <span
        className="checkbox__label"
        dangerouslySetInnerHTML={{ __html: label }}
      />
    </div>
  );
};
