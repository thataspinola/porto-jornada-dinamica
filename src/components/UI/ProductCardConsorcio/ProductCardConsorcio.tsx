export function ProductCardConsorcio({
	title,
	description,
	url,
}: {
	title: string;
	description?: string;
	url?: string;
}) {
	return (
		<article>
			<h3>{title}</h3>
			{description && <p>{description}</p>}
			{url && <a href={url}>Saiba mais</a>}
		</article>
	);
}
