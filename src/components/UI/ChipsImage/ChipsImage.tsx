"use client";
export function ChipsImage({
	options,
	value,
	onChange,
}: {
	options: { label: string; value: string; image?: string }[];
	value?: string;
	onChange: (value: string) => void;
}) {
	return (
		<fieldset>
			{options.map((o) => (
				<button
					type="button"
					key={o.value}
					aria-pressed={o.value === value}
					onClick={() => onChange(o.value)}
				>
					{o.image && <img src={o.image} alt="" />}
					{o.label}
				</button>
			))}
		</fieldset>
	);
}
