export function Indicator({ value }: { value: number }) {
	return <span>{Math.round(value)}%</span>;
}
