"use client";
import { useCallback, useEffect, useState } from "react";

import s from "./styles.module.scss";

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
	initialValue = 0,
	value,
	color = "#0046c0",
	className,
	style,
	...props
}: ProgressBarProps) => {
	const [barWidth, setBarWidth] = useState(initialValue);

	const normalizeValue = useCallback(
		(val: number) => Math.min(100, Math.max(0, val)),
		[],
	);

	useEffect(() => {
		const updateWidth = () => {
			setBarWidth(normalizeValue(value));
		};

		// Em ambiente de teste, atualiza imediatamente sem animação
		if (process.env.NODE_ENV === "test") {
			updateWidth();
			return;
		}

		// No navegador, usa requestAnimationFrame para animação suave
		const animationFrame = requestAnimationFrame(updateWidth);
		return () => cancelAnimationFrame(animationFrame);
	}, [value, normalizeValue]);

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
