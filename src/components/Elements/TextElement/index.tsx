import { Typography } from "@/components/UI";
import type { TextElementProps } from "./types";
export function TextElement({ element }: TextElementProps) {
	return <Typography as="p" variant="body1" style={element.config.cssProperties}>{element.config.text}</Typography>;
}
