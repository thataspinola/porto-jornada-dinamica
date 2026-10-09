"use client";

import { useEffect, useState } from "react";

import { NAVIGATE_EVENT } from "@/constants";

export function useCurrentPathname() {
	const resolvedPathname =
		typeof window !== "undefined" ? window.location.pathname : "/";
	const [pathname, setPathname] = useState(resolvedPathname);

	const handleSyncNavigate = () => {
		setPathname(window.location.pathname);
	};

	useEffect(() => {
		window.addEventListener("popstate", handleSyncNavigate);
		window.addEventListener(NAVIGATE_EVENT, handleSyncNavigate);

		return () => {
			window.removeEventListener("popstate", handleSyncNavigate);
			window.removeEventListener(NAVIGATE_EVENT, handleSyncNavigate);
		};
	});

	return pathname;
}
