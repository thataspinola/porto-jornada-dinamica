import type { CSSProperties } from "react";
import { parseStyleValue } from "./parsers";
export function resolveStyle(
	style?: Record<string, string | number>,
): CSSProperties {
	return Object.fromEntries(
		Object.entries(style ?? {}).map(([key, value]) => [
			key,
			parseStyleValue(value),
		]),
	) as CSSProperties;
}
