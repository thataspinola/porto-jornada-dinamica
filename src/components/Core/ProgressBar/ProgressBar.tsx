/** biome-ignore-all lint/a11y/noNoninteractiveTabindex: <> */
"use client";

import { useEffect, useState } from "react";
import s from "./ProgressBar.module.scss";

import type { ProgressBarProps } from "./types";

/**
 * `ProgressBar` — Componente visual de barra de progresso animada.
 *
 * Indica o progresso de uma operação por meio do preenchimento horizontal animado de uma barra.
 * Ideal para feedback de carregamento, avanço de etapas ou transições temporais.
 *
 * @component
 *
 * @param {Object} props - Propriedades do componente
 * @param {number} [props.initialValue=0] - Valor inicial de preenchimento da barra (0 a 100)
 * @param {number} props.value - Valor final que a barra deve atingir (0 a 100)
 * @param {string} [props.color] - Cor do preenchimento da barra (ex: "#0046c0", "red", "var(--primary)")
 *
 * @example
 * <ProgressBar value={75} />
 *
 * @example
 * <ProgressBar
 *   value={50}
 *   initialValue={10}
 *   color="#00c896"
 *   aria-label="Progresso do carregamento"
 *   data-testid="loading-progress"
 * />
 *
 * @returns {JSX.Element} Elemento `div` representando a barra de progresso preenchida de forma animada
 */

export const ProgressBar = ({
	value,
	length,
	color = "#0046c0",
	className,
	style,
	...props
}: ProgressBarProps) => {
	const currentStepIndex = (100 * value) / length;
	const nextStep = (100 * (value - 10)) / length;
	const initialValue = nextStep <= 10 ? 0 : nextStep;
	const [barWidth, setBarWidth] = useState(initialValue);

	useEffect(() => {
		setBarWidth(currentStepIndex);
	}, [currentStepIndex]);

	return (
		<div
			className={`${s.progressBar} ${className || ""}`}
			role="progressbar"
			aria-valuenow={barWidth}
			aria-valuemin={0}
			aria-valuemax={100}
			aria-valuetext={`${barWidth}%`}
			aria-label="barra de progresso"
			style={style}
			tabIndex={0}
			{...props}
		>
			<div
				className={s.progressBarFill}
				style={{
					width: `${barWidth}%`,
					backgroundColor: color,
				}}
			/>
		</div>
	);
};
