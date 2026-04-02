import type { HTMLAttributes } from "react";

export interface ProgressBarProps
	extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
	/** Valor inicial da barra de progresso (0-100) */
	initialValue?: number;

	/** Valor atual da barra de progresso (0-100) */
	value: number;

	/** Cor personalizada para a barra de progresso */
	color?: string;

	/** Rótulo para acessibilidade */
	"aria-label"?: string;

	/** ID para testes */
	"data-testid"?: string;
}
