"use client";
import { useEffect, useRef } from "react";
import { pushEvent, type Item } from "@/utils";
import { composableCardElementSchema } from "@/validation/schemas";
import styles from "./ConditionalWrapperElement.module.scss";
import type { ConditionalWrapperElementProps } from "./types";
import { useConditionalVisibility } from "./useConditionalVisibility";
export function ConditionalWrapperElement({
	element,
	context,
	journeySlug,
	renderElement,
}: ConditionalWrapperElementProps) {
	const isVisible = useConditionalVisibility(element, context);
	const sent = useRef(false);
	useEffect(() => {
		if (
			!isVisible ||
			sent.current ||
			element.id !== "cpf-recommended-products-wrapper" ||
			![
				"emprestimo-com-garantia-de-veiculo",
				"financiamento-de-veiculos",
			].includes(journeySlug)
		)
			return;
		const items: Item[] = [];
		for (const child of element.config.children) {
			if (child.type !== "COMPOSABLE_CARD") continue;
			const result = composableCardElementSchema.safeParse(child);
			if (!result.success) return;
			const texts = result.data.config.children
				.map((child) => child.element)
				.filter((part) => part.type === "TEXT");
			const navigation = result.data.config.children
				.map((child) => child.element)
				.find((part) => part.type === "NAVIGATION");
			const title = texts[0]?.config.text;
			const description = texts[1]?.config.text;
			const url = navigation?.config.url;
			if (!title || !description || !url) return;
			items.push({
				item_id: url,
				item_name: title,
				item_brand: "porto",
				creative_name: "produtos-recomendados",
				creative_slot: "cpf-negativa-elegibilidade",
				promotion_name: description,
				affiliation: "porto",
			});
		}
		if (items.length !== 2) return;
		sent.current = pushEvent({
			event: "view_promotion",
			ev_action: "ecommerce:visualizar:promocao:sucesso",
			items,
		});
	}, [isVisible, element.id, element.config.children, journeySlug]);
	if (!isVisible) return null;
	return (
		<div
			id={element.id}
			className={styles.wrapper}
			style={element.config.cssProperties}
		>
			{element.config.children.map((child) => (
				<div key={child.id}>{renderElement(child)}</div>
			))}
		</div>
	);
}
