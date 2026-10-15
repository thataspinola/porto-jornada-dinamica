import styles from "./ComposableCardElement.module.scss";
import type { ComposableCardElementProps } from "./types";
export function ComposableCardElement({
	element,
	renderElement,
}: ComposableCardElementProps) {
	return (
		<div
			id={element.id}
			className={styles.card}
			style={element.config.cssProperties}
		>
			{element.config.children.map(({ element: child }) => (
				<div key={child.id}>{renderElement(child)}</div>
			))}
		</div>
	);
}
