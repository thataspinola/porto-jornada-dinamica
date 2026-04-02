import { Typography } from "../../UI/Typography";

export const Title = ({ text }) => (
	<Typography as="h3" variant="title4" style={{ marginBottom: "32px" }}>
		{text}
	</Typography>
);
