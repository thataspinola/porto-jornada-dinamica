export interface FieldOption {
	label: string;
	value: string;
}

export interface FetchOptions {
	url: string;
	method?: "GET" | "POST";
	labelKey?: string;
	valueKey?: string;
}

export interface ApiValidation {
	url: string;
	method: "GET" | "POST";
	invalidKey?: string;
	invalidValue: unknown;
}

export interface Element {
	id: string;
	label?: string;
	type?: string;
	config: any;
}

export interface Seo {
	title?: string;
	description?: string;
	canonical?: string;
	keywords?: string;
	robots?: {
		index?: boolean;
		follow?: boolean;
	};
}

export interface Action {
	type?: string;
	service?: string;
	target?: string;
	trigger?: string;
	onSuccess?: {
		type: string;
		target: string;
	};
}
export interface Step {
	id: string;
	slug: string;
	backStepSlug: string;
	elements?: Element[];
}

export interface JourneyConfig {
	steps: Step;
}

export interface FormStepProps {
	step: Step;
	slug: string;
}

export interface JourneyProps {
	data: {
		step: Step;
		position: number;
		isFirst: boolean;
		isLast: boolean;
		progress: number;
	};
	slug: string;
}
