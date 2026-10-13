"use client";
import { useEffect } from "react";
import type { UseFormSetValue } from "react-hook-form";
export function useCepAddressFormSync(
	address: Record<string, unknown> | undefined,
	setValue: UseFormSetValue<Record<string, unknown>>,
) {
	useEffect(() => {
		if (address)
			for (const [key, value] of Object.entries(address))
				setValue(key, value, { shouldValidate: true });
	}, [address, setValue]);
}
