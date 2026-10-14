import { z } from "zod";
export const conditionSchema = z.object({
	source: z
		.enum(["fields", "formErrors", "business", "services"])
		.default("fields"),
	path: z.string().min(1),
	operator: z
		.enum(["equals", "notEquals", "exists", "notExists"])
		.default("equals"),
	value: z.unknown().optional(),
});
export const conditionsSchema = z.array(conditionSchema).optional().default([]);
export type Condition = z.infer<typeof conditionSchema>;
export const conditionActionSchema = z.object({
	type: z.literal("SET_ERROR"),
	field: z.string().min(1),
	message: z.string(),
});

export const conditionOperatorSchema = z.enum([
	"EQUAL",
	"NOT_EQUAL",
	"GREATER_THAN",
	"GREATER_THAN_OR_EQUAL",
	"LESS_THAN",
	"LESS_THAN_OR_EQUAL",
	"INCLUDES",
	"EXISTS",
	"NOT_EXISTS",
]);

const operandSourceSchema = z.enum([
	"fields",
	"parameters",
	"services",
	"business",
	"formErrors",
]);

const operandRefSchema = z.object({
	from: operandSourceSchema,
	path: z.string(),
});

const operandLiteralSchema = z.object({
	value: z.union([z.string(), z.number(), z.boolean(), z.null()]),
});

export const conditionOperandSchema = z.union([
	operandRefSchema,
	operandLiteralSchema,
]);

export const conditionCheckSchema = z.object({
	left: conditionOperandSchema,
	op: conditionOperatorSchema,
	right: conditionOperandSchema.optional(),
});

const redirectActionSchema = z.object({
	kind: z.literal("redirect"),
	url: z.string(),
});

// Single-member union intentionally - new click action kinds (e.g. submitForm) expected
const buttonOnClickActionSchema = z.discriminatedUnion("kind", [
	redirectActionSchema,
]);

const notifyActionSchema = z.object({
	kind: z.literal("notify"),
	title: z.string(),
	description: z.string(),
	actionButton: z
		.object({
			children: z.string(),
			onClickAction: buttonOnClickActionSchema.optional(),
		})
		.optional(),
});

const fieldErrorActionSchema = z.object({
	kind: z.literal("fieldError"),
	field: z.string(),
	message: z.string(),
	focus: z.boolean().optional(),
});

const fullscreenAttemptSchema = z.object({
	title: z.string(),
	description: z.string().optional(),
	actionButton: z.object({
		children: z.string(),
		onClickAction: buttonOnClickActionSchema.optional(),
	}),
});

const fullscreenActionSchema = z.object({
	kind: z.literal("fullscreen"),
	icon: z.string(),
	attempts: z.array(fullscreenAttemptSchema).min(1),
});

export type FullscreenAttempt = z.infer<typeof fullscreenAttemptSchema>;

export const ruleActionSchema = z.discriminatedUnion("kind", [
	notifyActionSchema,
	fieldErrorActionSchema,
	redirectActionSchema,
	fullscreenActionSchema,
]);

export const conditionRuleSchema = z.object({
	id: z.string().optional(),
	checks: z.array(conditionCheckSchema).min(1),
	action: ruleActionSchema,
});

export const conditionRulesSchema = z
	.array(conditionRuleSchema)
	.optional()
	.default([]);

export type ConditionOperator = z.infer<typeof conditionOperatorSchema>;
export type ConditionOperand = z.infer<typeof conditionOperandSchema>;
export type ConditionCheck = z.infer<typeof conditionCheckSchema>;
export type ConditionAction = z.infer<typeof ruleActionSchema>;
export type ConditionRule = z.infer<typeof conditionRuleSchema>;
export type ButtonOnClickAction = z.infer<typeof buttonOnClickActionSchema>;
