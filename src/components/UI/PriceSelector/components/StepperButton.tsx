"use client";
export function StepperButton({
	label,
	onClick,
	disabled = false,
}: {
	label: string;
	onClick: () => void;
	disabled?: boolean;
}) {
	return (
		<button type="button" disabled={disabled} onClick={onClick}>
			{label}
		</button>
	);
}
