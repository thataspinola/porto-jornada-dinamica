import type { UseFormSetValue } from "react-hook-form";
export function useFormTabs(
	name: string,
	setValue: UseFormSetValue<Record<string, unknown>>,
) {
	return (value: string) => setValue(name, value, { shouldValidate: true });
}
