import { Typography } from "../../UI/Typography";

export const Paragraph = ({ text }) => (
	<Typography as="p" variant="body1" style={{ marginBottom: "32px" }}>
		{text}
	</Typography>
);
