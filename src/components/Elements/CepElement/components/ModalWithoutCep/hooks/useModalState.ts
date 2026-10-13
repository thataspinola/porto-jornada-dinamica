"use client";
import { useState, useCallback } from "react";
export function useModalState() {
	const [isOpen, setOpen] = useState(false);
	return {
		isOpen,
		open: useCallback(() => setOpen(true), []),
		close: useCallback(() => setOpen(false), []),
	};
}
