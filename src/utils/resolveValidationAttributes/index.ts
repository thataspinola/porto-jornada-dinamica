export function resolveValidationAttributes(config: {
	required?: boolean;
	minLength?: number;
	maxLength?: number;
	pattern?: string;
}) {
	return {
		required: config.required,
		minLength: config.minLength,
		maxLength: config.maxLength,
		pattern: config.pattern,
	};
}
