"use client";
export default function ErrorPage({
	reset,
}: {
	error: Error;
	reset: () => void;
}) {
	return (
		<section role="alert">
			<h1>Não foi possível carregar a jornada</h1>
			<p>Tente novamente em alguns instantes.</p>
			<button type="button" onClick={reset}>
				Tentar novamente
			</button>
		</section>
	);
}
