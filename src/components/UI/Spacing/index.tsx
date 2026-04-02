import type React from "react";

import styles from "./styles.module.scss";

import { clsx } from "@/utils";
import type { SpacingProps } from "./types";

/**
 * `Spacing` — Componente visual para inserir margens verticais e/ou horizontais entre elementos.
 *
 * Ideal para criar espaçamentos consistentes em layouts sem a necessidade de aplicar margens manualmente via CSS.
 * Pode ser utilizado como elemento vazio para separar componentes ou para aplicar margens específicas em `divs`, `spans`, etc.
 *
 * @component
 *
 * @param {Object} props - Propriedades do componente
 * @param {string} [props.className] - Classe CSS adicional para personalização externa
 * @param {React.CSSProperties} [props.style] - Estilo inline adicional
 * @param {SpacingSize} [props.top] - Margem superior
 * @param {SpacingSize} [props.bottom] - Margem inferior
 * @param {SpacingSize} [props.left] - Margem à esquerda
 * @param {SpacingSize} [props.right] - Margem à direita
 * @param {boolean} [props.inline=false] - Define se o elemento será `display: inline-block` ao invés de `block`
 *
 * @example
 * <div>Elemento acima</div>
 * <Spacing top="2rem" bottom="2rem" />
 * <div>Elemento abaixo</div>
 *
 * @example
 * // Espaçamento lateral
 * <Spacing left="1rem" right="1rem" />
 *
 * @returns {JSX.Element} Elemento `div` (ou `span` se customizado) com margens aplicadas
 */

// Função auxiliar para converter valores numéricos para rem
const toRem = (value?: string | number) => {
	if (typeof value === "number") {
		return `${value}rem`;
	}
	return value;
};

export const Spacing: React.FC<SpacingProps> = ({
	className,
	style = {},
	top,
	bottom,
	left,
	right,
	inline = false,
	children = null,
	...restProps
}) => {
	// Se houver children, não renderiza nada
	if (children) {
		return null;
	}

	return (
		<div
			className={clsx(styles.spacing, inline && styles.inline, className)}
			style={{
				...style,
				marginTop: toRem(top),
				marginBottom: toRem(bottom),
				marginLeft: toRem(left),
				marginRight: toRem(right),
			}}
			aria-hidden="true"
			{...restProps}
		/>
	);
};
