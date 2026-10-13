"use client";
import { useSearchParams } from "next/navigation";
export function useSearchParam(name: string, fallback = "") {
	return useSearchParams().get(name) ?? fallback;
}
