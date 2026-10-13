"use client";
import { useState } from "react";
import type { CSSProperties } from "react";
import { Controller } from "react-hook-form";
import { resolveStyle } from "@/utils/resolveStyle";
import type { ConfiguredElementProps } from "./types";
import styles from "./ConfiguredElement.module.scss";
export function ConfiguredElement({
	element,
	control,
	register,
	errors,
	renderElement,
	values = {},
	onNavigate,
}: ConfiguredElementProps) {
	const c = element.config;
	const text = (key: string) =>
		typeof c[key] === "string" ? (c[key] as string) : "";
	const [open, setOpen] = useState(false);
	const [tab, setTab] = useState(0);
	const options = Array.isArray(c.options)
		? (c.options as { label: string; value: string }[])
		: [];
	const children = Array.isArray(c.elements)
		? (c.elements as ConfiguredElementProps["element"][])
		: [];
	const items = Array.isArray(c.items)
		? (c.items as {
				id?: string;
				title?: string;
				description?: string;
				url?: string;
			}[])
		: [];
	const label = text("label") || text("title");
	const name = text("name");
	const style = resolveStyle(
		c.cssProperties as Record<string, string | number>,
	);
	const body = children.map((child) => (
		<div key={child.id}>
			{renderElement ? (
				renderElement(child)
			) : (
				<ConfiguredElement element={child} />
			)}
		</div>
	));
	const inputTypes: Record<string, string> = {
		EMAIL_INPUT: "email",
		PHONE_INPUT: "tel",
		NUMERIC_INPUT: "number",
		BIRTH_DATE_INPUT: "text",
		INPUT_HIDDEN: "hidden",
		PRICE_SELECTOR: "range",
		FCDC_PLATE_INPUT: "text",
		REFF_PLATE_INPUT: "text",
	};
	const isField = !!name;
	if (isField) {
		const optionType = [
			"ADDRESS_RADIO",
			"BIOLOGICAL_SEX",
			"MARITAL_STATUS",
			"NATIONALITY",
			"OCCUPATION",
			"CHIPS",
			"CHIPS_IMAGE",
			"OPTION_CARD_LIST",
		].includes(element.type);
		const inputType = inputTypes[element.type] ?? "text";
		const error = errors?.[name]?.message;
		const attrs = {
			id: element.id,
			name,
			required: !!c.required,
			placeholder: text("placeholder"),
			min: typeof c.min === "number" ? c.min : undefined,
			max: typeof c.max === "number" ? c.max : undefined,
			"aria-invalid": !!error,
			"aria-describedby": error ? element.id + "-error" : undefined,
		};
		const renderInput = (
			value: unknown,
			onChange: (value: unknown) => void,
			onBlur?: () => void,
		) =>
			optionType ? (
				<select
					{...attrs}
					value={String(value ?? "")}
					onBlur={onBlur}
					onChange={(e) => onChange(e.target.value)}
				>
					<option value="">Selecione</option>
					{options.map((o) => (
						<option key={o.value} value={o.value}>
							{o.label}
						</option>
					))}
				</select>
			) : element.type === "MARKETING_OPTIN" ? (
				<input
					{...attrs}
					type="checkbox"
					checked={!!value}
					onBlur={onBlur}
					onChange={(e) => onChange(e.target.checked)}
				/>
			) : (
				<input
					{...attrs}
					type={inputType}
					value={String(value ?? "")}
					onBlur={onBlur}
					onChange={(e) =>
						onChange(
							inputType === "number" || inputType === "range"
								? e.target.value === ""
									? ""
									: Number(e.target.value)
								: e.target.value,
						)
					}
				/>
			);
		return (
			<div style={style} className={styles.field}>
				{inputType !== "hidden" && (
					<label htmlFor={element.id}>{label || name}</label>
				)}
				{control ? (
					<Controller
						control={control}
						name={name}
						defaultValue={c.defaultValue ?? ""}
						render={({ field }) =>
							renderInput(field.value, field.onChange, field.onBlur)
						}
					/>
				) : optionType ? (
					<select {...attrs} {...register?.(name)}>
						<option value="">Selecione</option>
						{options.map((o) => (
							<option key={o.value} value={o.value}>
								{o.label}
							</option>
						))}
					</select>
				) : (
					<input {...attrs} {...register?.(name)} type={inputType} />
				)}{" "}
				{error && (
					<p role="alert" id={element.id + "-error"}>
						{String(error)}
					</p>
				)}
			</div>
		);
	}
	if (element.type === "DRAWER")
		return (
			<section style={style}>
				<button type="button" onClick={() => setOpen(true)}>
					{label || "Ver detalhes"}
				</button>
				{open && (
					<div role="dialog" aria-modal="true" aria-label={label}>
						<button type="button" onClick={() => setOpen(false)}>
							Fechar
						</button>
						{body}
					</div>
				)}
			</section>
		);
	if (element.type === "TABS")
		return (
			<section>
				<div role="tablist" aria-label={label}>
					{items.map((item, i) => (
						<button
							key={item.id ?? i}
							role="tab"
							type="button"
							aria-selected={tab === i}
							onClick={() => setTab(i)}
						>
							{item.title}
						</button>
					))}
				</div>
				<div role="tabpanel">{body[tab] ?? items[tab]?.description}</div>
			</section>
		);
	if (element.type === "INPUT_HIDDEN") return null;
	if (element.type === "ICON")
		return (
			<span aria-label={label || text("text")} role="img">
				{text("text") || "•"}
			</span>
		);
	if (element.type === "LABEL_VALUE")
		return (
			<dl style={style}>
				<dt>{label}</dt>
				<dd>{String(values[text("sourcePath")] ?? c.value ?? "")}</dd>
			</dl>
		);
	if (element.type === "CONFIRM_NAVIGATION_BUTTON")
		return (
			<button
				type="button"
				onClick={() => {
					if (window.confirm(text("description") || "Deseja continuar?"))
						onNavigate?.(text("url"));
				}}
			>
				{label || "Continuar"}
			</button>
		);
	return (
		<section
			id={element.id}
			style={style as CSSProperties}
			className={styles.content}
			role={element.type === "NOTIFICATION" ? "status" : undefined}
		>
			{label && <h2>{label}</h2>}
			{text("text") && <p>{text("text")}</p>}
			{text("description") && <p>{text("description")}</p>}
			{body}
			{items.length > 0 && (
				<ul>
					{items.map((item, i) => (
						<li key={item.id ?? i}>
							{item.title && <h3>{item.title}</h3>}
							{item.description && <p>{item.description}</p>}
							{item.url && <a href={item.url}>Saiba mais</a>}
						</li>
					))}
				</ul>
			)}
			{text("url") && <a href={text("url")}>{label || "Saiba mais"}</a>}
		</section>
	);
}
