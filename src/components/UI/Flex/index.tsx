import styles from "./styles.module.scss";

import { clsx } from "@/utils";

import type { FlexProps } from "./types";

/**
 * Componente de layout flexível baseado em CSS Flexbox.
 *
 * Permite controle granular sobre a direção, alinhamento, espaçamento e quebra de linha
 * dos elementos filhos, oferecendo uma API semelhante à do Chakra UI e ShadCN.
 *
 * Ideal para construir interfaces responsivas e componíveis com facilidade.
 *
 * @example
 * ```tsx
 * <Flex direction="column" align="center" justify="space-between" gap="1rem">
 *   <div>Item 1</div>
 *   <div>Item 2</div>
 * </Flex>
 * ```
 *
 * @param children Elementos filhos a serem renderizados dentro do contêiner flex.
 * @param className Classe CSS adicional para personalização.
 * @param style Estilo inline opcional.
 * @param as Elemento HTML que será renderizado (padrão: `div`).
 * @param direction Direção do layout flexível. Valores possíveis: `"row"`, `"column"`, `"row-reverse"`, `"column-reverse"`.
 * @param align Alinhamento dos itens no eixo cruzado. Valores possíveis: `"stretch"`, `"center"`, `"flex-start"`, `"flex-end"`, `"baseline"`, etc.
 * @param justify Distribuição dos itens no eixo principal. Valores possíveis: `"flex-start"`, `"center"`, `"flex-end"`, `"space-between"`, `"space-around"`, `"space-evenly"`, etc.
 * @param wrap Controle de quebra de linha. Valores possíveis: `"nowrap"`, `"wrap"`, `"wrap-reverse"`.
 * @param gap Espaçamento entre os itens. Aceita qualquer valor CSS válido para espaçamento (e.g., `"1rem"`, `"8px"`).
 * @param inline Se verdadeiro, usa `display: inline-flex` em vez de `flex`.
 */

export const Flex = ({
	children,
	className,
	style,
	as: Tag = "div",
	direction = "row",
	align = "stretch",
	justify = "flex-start",
	wrap = "nowrap",
	gap,
	inline = false,
}: FlexProps) => {
	return (
		<Tag
			className={clsx(styles.flex, inline && styles.inline, className)}
			style={{
				flexDirection: direction,
				alignItems: align,
				justifyContent: justify,
				flexWrap: wrap,
				gap,
				...style,
			}}
		>
			{children}
		</Tag>
	);
};
