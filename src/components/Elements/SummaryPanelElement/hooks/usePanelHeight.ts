"use client";
import { useEffect, useRef, useState } from "react";
export function usePanelHeight() {
	const ref = useRef<HTMLDivElement>(null);
	const [height, setHeight] = useState(0);
	useEffect(() => {
		if (!ref.current) return;
		const observer = new ResizeObserver((entries) =>
			setHeight(entries[0].contentRect.height),
		);
		observer.observe(ref.current);
		return () => observer.disconnect();
	}, []);
	return { ref, height };
}
