"use client";
export function PriceInput({
	label,
	value,
	onChange,
}: {
	label: string;
	value: number;
	onChange: (value: number) => void;
}) {
	return (
		<label>
			{label}
			<input
				type="number"
				min={0}
				value={value}
				onChange={(e) => onChange(Number(e.target.value))}
			/>
		</label>
	);
}
