"use client";
import { useState } from "react";
export function usePlanSelection(initialId = "") {
	const [selectedId, selectPlan] = useState(initialId);
	return { selectedId, selectPlan };
}
