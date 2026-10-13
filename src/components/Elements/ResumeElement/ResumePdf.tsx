"use client";
export function ResumePdf({
	values,
}: {
	values: Record<string, string | number>;
}) {
	return (
		<section>
			<dl>
				{Object.entries(values).map(([key, value]) => (
					<div key={key}>
						<dt>{key}</dt>
						<dd>{value}</dd>
					</div>
				))}
			</dl>
			<button type="button" onClick={() => window.print()}>
				Imprimir resumo
			</button>
		</section>
	);
}
