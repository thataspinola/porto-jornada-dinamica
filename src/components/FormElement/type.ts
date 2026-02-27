/** biome-ignore-all lint/suspicious/noExplicitAny: <explanation> */

import type { Element } from "@/types";
export type ElementType =
	| "number"
	| "text"
	| "button"
	| "select"
	| "typography"
	| "cpf"
	| "phone"
	| "textarea"
	| "email"
	| "cnpj"
	| "date"
	| "radio"
	| "checkbox"
	| "appointment"
	| "spacing";
export interface Action {
	type?: string;
	service?: string;
	onSuccess?: {
		type: string;
		target: string;
	};
	trigger: "onChange" | "onClick" | "onInit";
}

export interface FormElementProps {
	element: Element;
	slug: string;
}
