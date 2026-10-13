"use client";
import { useEffect } from "react";
import type { UseFormSetValue } from "react-hook-form";
import { calculateAge } from "@/utils/calculateAge";
export function useBirthDateAgeSync(
	value: string,
	name: string,
	setValue: UseFormSetValue<Record<string, unknown>>,
) {
	useEffect(() => {
		setValue(name, calculateAge(value), { shouldValidate: true });
	}, [value, name, setValue]);
}
