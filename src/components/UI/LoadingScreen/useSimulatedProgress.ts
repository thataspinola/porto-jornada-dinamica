"use client";
import { useEffect, useState } from "react";
export function useSimulatedProgress(complete = false) {
	const [progress, setProgress] = useState(0);
	useEffect(() => {
		if (complete) {
			setProgress(100);
			return;
		}
		const timer = setInterval(
			() => setProgress((p) => Math.min(90, p + 5)),
			500,
		);
		return () => clearInterval(timer);
	}, [complete]);
	return progress;
}
