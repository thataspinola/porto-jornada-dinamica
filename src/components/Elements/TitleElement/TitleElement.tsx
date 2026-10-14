import { Typography } from "@/components/UI/Typography";

import type { JourneyDefinition } from "@/validation/schemas";

type TitleElementType = Extract<
	JourneyDefinition["steps"][number]["elements"][number],
	{ type: "TITLE" }
>;

type TitleElementProps = {
	element: TitleElementType;
};

export const TitleElement = ({ element }: TitleElementProps) => (
	<Typography as="h3" variant="title4" style={{ marginBottom: "32px" }}>
		{element.config.text}
	</Typography>
);
