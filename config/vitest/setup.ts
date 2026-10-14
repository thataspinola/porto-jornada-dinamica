import * as matchers from "@testing-library/jest-dom/matchers";
import { webcrypto } from "node:crypto";
import { cleanup } from "@testing-library/react";
import { afterEach, expect } from "vitest";

expect.extend(matchers);

afterEach(() => cleanup());
if (typeof window !== "undefined")
	Object.defineProperty(window, "crypto", {
		value: webcrypto,
		configurable: true,
	});
