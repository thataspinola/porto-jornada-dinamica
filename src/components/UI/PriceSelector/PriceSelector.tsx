"use client";
export function PriceSelector({
	value,
	min = 0,
	max,
	onChange,
	label,
}: {
	value: number;
	min?: number;
	max: number;
	onChange: (value: number) => void;
	label: string;
}) {
	return (
		<label>
			{label}
			<input
				type="range"
				aria-label={label}
				min={min}
				max={max}
				value={value}
				onChange={(e) => onChange(Number(e.target.value))}
			/>
			<output>{value}</output>
		</label>
	);
}
