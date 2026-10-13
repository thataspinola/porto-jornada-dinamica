"use client";
import { useState } from "react";
export function useLocalTabs(initial = 0) {
	const [activeTab, setActiveTab] = useState(initial);
	return { activeTab, setActiveTab };
}
