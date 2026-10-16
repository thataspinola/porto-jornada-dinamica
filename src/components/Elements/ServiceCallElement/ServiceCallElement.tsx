"use client";

import type { JourneyDefinition } from "@/validation/schemas";
import { Button } from "@/components/UI/Button";

type ServiceCallElementType = Extract<
	JourneyDefinition["steps"][number]["elements"][number],
	{ type: "SERVICE_CALL" }
>;

type ServiceCallElementProps = {
	element: ServiceCallElementType;
	canProceed: boolean;
	onCall: (service: string, targetStepOnSuccess: string) => void;
};

export function ServiceCallElement({
	element,
	canProceed,
	onCall,
}: ServiceCallElementProps) {
	const ui = element.config;
	const hardDisabled = ui.disabled === true || typeof ui.service !== "string";
	const blocked = !canProceed;
	const variant = blocked ? "disabled" : "insurance";
	const disabled = hardDisabled || blocked;
	return (
		<Button
			type="button"
			variant={variant}
			styles={
				ui?.styles === "ghost"
					? "ghost"
					: ui?.styles === "stroke"
						? "secondary"
						: "primary"
			}
			size={ui?.size === "sm" ? "small" : "large"}
			disabled={disabled}
			className={ui?.className ?? ""}
			aria-disabled={disabled}
			onClick={() => {
				if (disabled) return;
				if (typeof element.config.service !== "string") return;
				onCall(element.config.service, element.config.targetStepOnSuccess);
			}}
		>
			{element.config.label}
		</Button>
	);
}
