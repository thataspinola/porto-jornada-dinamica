import type { ReactNode } from "react";
import type { Control, FieldErrors, UseFormRegister } from "react-hook-form";
export type ConfiguredJourneyElement = {
	id: string;
	type: string;
	config: Record<string, unknown>;
};
export type ConfiguredElementProps = {
	element: ConfiguredJourneyElement;
	control?: Control<Record<string, unknown>>;
	register?: UseFormRegister<Record<string, unknown>>;
	errors?: FieldErrors;
	renderElement?: (element: ConfiguredJourneyElement) => ReactNode;
	values?: Record<string, unknown>;
	onNavigate?: (url: string) => void;
};
