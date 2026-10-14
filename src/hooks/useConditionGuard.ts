"use client";

import { notify } from "@/components/Core/JourneyNotifier";
import { usePathname, useRouter } from "next/navigation";
import { useCallback } from "react";
import type { FieldValues, UseFormReturn } from "react-hook-form";
import { useShallow } from "zustand/shallow";

import { evaluateConditionRules, interpolateTemplate } from "@/utils";

import { useJourneyStore, type JourneyState } from "@/store/journeyStore";

import type {
	ConditionAction,
	ConditionRule,
} from "@/validation/schemas/elements/conditions.schema";

function interpolate(template: string, ctx: Record<string, unknown>): string {
	const result = interpolateTemplate(template, ctx, {
		keepMissing: true,
	});

	return result ?? template;
}

function navigateToUrl(
	url: string,
	router: ReturnType<typeof useRouter>,
	pathname: string,
) {
	const trimmed = url.trim();
	if (
		(/^[a-z][a-z0-9+.-]*:/i.test(trimmed) && !/^https?:\/\//i.test(trimmed)) ||
		trimmed.startsWith("//")
	)
		throw new Error("Destino inválido");

	if (/^https?:\/\//i.test(trimmed)) {
		window.location.assign(trimmed);
		return;
	}

	if (trimmed === "/") {
		router.push("/");
		return;
	}

	const segments = pathname.split("/").filter(Boolean);
	const base =
		segments.length >= 2
			? `/${segments[0]}/${segments[1]}`
			: `/${segments[0] ?? ""}`;

	router.push(`${base}/${trimmed.replace(/^\/+/, "")}`);
}

function applyConditionAction(
	action: ConditionAction,
	ctx: Record<string, unknown>,
	methods: UseFormReturn<FieldValues> | null,
	router: ReturnType<typeof useRouter>,
	pathname: string,
) {
	switch (action.kind) {
		case "notify": {
			const { actionButton } = action;
			const onClickAction = actionButton?.onClickAction;

			notify({
				type: "error",
				title: interpolate(action.title, ctx),
				description: interpolate(action.description, ctx),
				actionButton: actionButton && {
					children: actionButton.children,
					onClick: onClickAction
						? () =>
								applyConditionAction(
									onClickAction,
									ctx,
									methods,
									router,
									pathname,
								)
						: undefined,
				},
			});
			return;
		}

		case "fieldError": {
			const message = interpolate(action.message, ctx);

			if (methods) {
				methods.setError(action.field as never, {
					type: "condition",
					message,
				});

				if (action.focus) {
					methods.setFocus(action.field as never);
				}
				return;
			}

			notify({
				type: "error",
				title: message,
				description: "",
			});
			return;
		}

		case "fullscreen": {
			const attempt = action.attempts[0];
			if (attempt)
				notify({
					type: "error",
					title: interpolate(attempt.title, ctx),
					description: interpolate(attempt.description ?? "", ctx),
					fullscreen: true,
					actionButton: {
						children: attempt.actionButton.children,
						onClick: attempt.actionButton.onClickAction
							? () =>
									applyConditionAction(
										attempt.actionButton.onClickAction!,
										ctx,
										methods,
										router,
										pathname,
									)
							: undefined,
					},
				});
			return;
		}
		case "redirect":
			navigateToUrl(action.url, router, pathname);
			return;
	}
}

export type ConditionGuardResult =
	| { matched: true; rule: ConditionRule }
	| { matched: false };

export function useConditionGuard<TFieldValues extends FieldValues>(
	methods: UseFormReturn<TFieldValues>,
) {
	const router = useRouter();
	const pathname = usePathname();

	const { fields, parameters, services, business } = useJourneyStore(
		useShallow((state: JourneyState) => ({
			fields: state.fields,
			parameters: state.parameters,
			services: state.services,
			business: state.business,
		})),
	);

	const evaluate = useCallback(
		({
			rules,
			formData,
		}: {
			rules: ConditionRule[] | undefined;
			formData: Record<string, unknown>;
		}): ConditionGuardResult => {
			if (!rules || rules.length === 0) {
				return {
					matched: false,
				};
			}

			const mergedFields = { ...fields, ...formData };

			const ctx = {
				fields: mergedFields,
				parameters,
				services,
				business,
				formErrors: (methods?.formState?.errors ?? {}) as Record<
					string,
					unknown
				>,
			};

			const result = evaluateConditionRules(rules, ctx);

			if (!result.matched) {
				return {
					matched: false,
				};
			}

			applyConditionAction(
				result.rule.action,
				ctx,
				(methods ?? null) as UseFormReturn<FieldValues> | null,
				router,
				pathname,
			);

			return result;
		},
		[methods, router, pathname, business, fields, parameters, services],
	);

	return { evaluate };
}
