import type { z } from "zod";
import type { JourneyDefinition } from "@/validation/schemas";
export type JourneyElement =
	JourneyDefinition["steps"][number]["elements"][number];
export type ElementHandler<
	T extends JourneyElement["type"] = JourneyElement["type"],
> = (element: Extract<JourneyElement, { type: T }>) => z.ZodType;
export type StepFields = Record<string, string[]>;
