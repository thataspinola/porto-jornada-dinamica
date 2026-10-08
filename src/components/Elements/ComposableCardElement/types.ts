import type { ReactNode } from "react";
import type { z } from "zod";
import type { composableCardElementSchema } from "@/validation/schemas";
export type ComposableCardElementType = z.infer<typeof composableCardElementSchema>;
export type ComposableCardElementProps = {
	element: ComposableCardElementType;
	renderElement: (element: ComposableCardElementType["config"]["elements"][number]) => ReactNode;
};
