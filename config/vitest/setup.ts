import "@testing-library/jest-dom/vitest";
import { webcrypto } from "node:crypto";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

afterEach(() => cleanup());
if (typeof window !== "undefined")
	Object.defineProperty(window, "crypto", {
		value: webcrypto,
		configurable: true,
	});
