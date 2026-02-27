/** biome-ignore-all lint/a11y/noLabelWithoutControl: <> */
/** biome-ignore-all lint/correctness/useExhaustiveDependencies: <> */
"use client";

import { createJourneyStore } from "@/store";
import { useEffect, useState } from "react";
import styles from "./style.module.scss";

interface FinancialSimulatorProps {
	journeySlug: string;
	initialCredit?: number;
}

export const FinancialSimulator = ({
	journeySlug,
	initialCredit = 95500,
}: FinancialSimulatorProps) => {
	const useStore = createJourneyStore(journeySlug);
	const setValue = useStore((state) => state.setValue);
	const fields = useStore((state) => state.fields);

	// Estados locais para cálculos em tempo real (Recalcular)
	const [carValue, setCarValue] = useState(fields.car_value || 89900);
	const [downPayment, setDownPayment] = useState(fields.down_payment || 20000);
	const [paymentMethod, setPaymentMethod] = useState(
		fields.payment_method || "porto_visa",
	);
	const [installments, setInstallments] = useState(fields.installments || "60");

	useEffect(() => {
		setValue("simulator_data", {
			carValue,
			downPayment,
			paymentMethod,
			installments,
			totalFinanced: carValue - downPayment,
		});
	}, [carValue, downPayment, paymentMethod, installments]);

	return (
		<div className={styles.container}>
			{/* Header: Crédito Pré-aprovado */}
			<div
				className="--bg-neutral-100"
				style={{
					padding: "var(--space-4)",
					borderRadius: "8px",
					marginBottom: "var(--space-6)",
				}}
			>
				<p className="--font-size-2 --color-neutral-700">
					Seu crédito pré-aprovado
				</p>
				<h2 className="--font-size-7 --font-weight-bold --color-neutral-900">
					R${" "}
					{initialCredit.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
				</h2>
				<span className="--font-size-1 --color-neutral-500">
					Sujeito à análise. Sem valor mínimo de entrada.
				</span>
			</div>

			<h3 className="--font-size-4 --font-weight-bold --margin-bottom-4">
				Qual o valor do veículo e da entrada?
			</h3>

			<div className={styles.inputGroup}>
				<div className={styles.field}>
					<label className="--font-size-2">Valor do veículo</label>
					<input
						type="text"
						value={`R$ ${carValue.toLocaleString("pt-BR")}`}
						onChange={(e) =>
							setCarValue(Number(e.target.value.replace(/\D/g, "")))
						}
						className="--font-size-6 --font-weight-bold"
					/>
				</div>
				<div className={styles.field}>
					<label className="--font-size-2">Valor da entrada</label>
					<input
						type="text"
						value={`R$ ${downPayment.toLocaleString("pt-BR")}`}
						onChange={(e) =>
							setDownPayment(Number(e.target.value.replace(/\D/g, "")))
						}
						className="--font-size-6 --font-weight-bold"
					/>
				</div>
			</div>

			{/* Formas de Pagamento */}
			<section className={styles.section}>
				<h4 className="--font-size-4 --font-weight-bold">
					Formas de pagamento
				</h4>
				<div
					className="--bg-insurance-100 --color-insurance-800"
					style={{
						padding: "var(--space-2)",
						borderRadius: "4px",
						margin: "var(--space-2) 0",
					}}
				>
					<span className="--font-size-1">
						Usando cartão da porto você paga menos juros nas parcelas
					</span>
				</div>

				<div className={styles.optionsList}>
					{["mastercard", "visa"].map((card) => (
						<label
							key={card}
							className={`${styles.optionCard} ${paymentMethod === `porto_${card}` ? styles.active : ""}`}
						>
							<input
								type="radio"
								name="payment"
								checked={paymentMethod === `porto_${card}`}
								onChange={() => setPaymentMethod(`porto_${card}`)}
							/>
							<div className={styles.cardContent}>
								<span className="--font-weight-bold">Cartão Porto Bank</span>
								<span className="--font-size-1 --color-neutral-500">
									{card.charAt(0).toUpperCase() + card.slice(1)}
								</span>
							</div>
							<div
								className="--bg-green-300 --color-green-900"
								style={{
									padding: "4px",
									borderRadius: "4px",
									fontSize: "10px",
								}}
							>
								Economize nos juros
							</div>
						</label>
					))}
				</div>
			</section>

			{/* Parcelamento */}
			<section className={styles.section}>
				<h4 className="--font-size-4 --font-weight-bold">Parcelamento</h4>
				<div className={styles.installmentsList}>
					{[60, 48, 36, 24].map((n) => (
						<label
							key={n}
							className={`${styles.installmentCard} ${installments === String(n) ? styles.active : ""}`}
						>
							<input
								type="radio"
								name="installments"
								onChange={() => setInstallments(String(n))}
							/>
							<div>
								<span className="--font-weight-bold">{n}x de R$ 1.050,00</span>
								<p className="--font-size-1 --color-neutral-500">
									Juros de 2,58% ao mês{" "}
									<span className="--color-green-600">1,58% ao mês</span>
								</p>
							</div>
						</label>
					))}
				</div>
			</section>

			{/* Footer do Simulador */}
			<div
				className="--bg-neutral-100"
				style={{ padding: "var(--space-4)", marginTop: "var(--space-4)" }}
			>
				<p className="--font-size-1 --color-neutral-600">
					CET é o Custo Efetivo Total (a.m.) de 2,49%
				</p>
				<p className="--font-size-1 --color-neutral-600">
					CET é o Custo Efetivo Total (a.a.) de 34,33%
				</p>
			</div>

			<button type="button" className={styles.recalculateBtn}>
				Recalcular
			</button>
		</div>
	);
};
