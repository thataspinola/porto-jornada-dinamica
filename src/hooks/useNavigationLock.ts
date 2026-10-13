"use client";
import { useCallback, useRef } from "react";
export function useNavigationLock() {
	const locked = useRef(false);
	return useCallback(async (action: () => Promise<void>) => {
		if (locked.current) return false;
		locked.current = true;
		try {
			await action();
			return true;
		} finally {
			locked.current = false;
		}
	}, []);
}
