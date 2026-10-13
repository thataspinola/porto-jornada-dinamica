export function FullScreenErrorView({
	message = "Não foi possível carregar os dados.",
	onRetry,
}: {
	message?: string;
	onRetry?: () => void;
}) {
	return (
		<section role="alert">
			<p>{message}</p>
			{onRetry && (
				<button type="button" onClick={onRetry}>
					Tentar novamente
				</button>
			)}
		</section>
	);
}
