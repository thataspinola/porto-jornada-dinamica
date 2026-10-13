export function highlightTitle(title: string, highlight: string) {
	const index = title.indexOf(highlight);
	return index < 0 || !highlight
		? { before: title, highlight: "", after: "" }
		: {
				before: title.slice(0, index),
				highlight,
				after: title.slice(index + highlight.length),
			};
}
