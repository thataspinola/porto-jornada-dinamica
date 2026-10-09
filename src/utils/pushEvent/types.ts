export type Item = {
	item_id: string;
	item_name: string;
	item_brand?: string;
	creative_name?: string;
	creative_slot?: string;
	promotion_name?: string;
	affiliation?: string;
};
export type PromotionEvent = {
	event: "view_promotion";
	ev_action?: string;
	items: Item[];
	currency?: string;
	value?: number;
};
