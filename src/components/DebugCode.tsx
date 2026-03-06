export type DebugCodeProps = {
	fieds: Record<string, unknown>;
	error: Record<string, unknown>;
	bussines: Record<string, unknown>;
	services: Record<string, unknown>;
};

export const DebugCode = ({
	fieds,
	error,
	bussines,
	services,
}: DebugCodeProps) => {
	return (
		<details
			style={{
				fontSize: "16px",
				background: "#282727",
				padding: "10px",
				borderRadius: "5px",
				cursor: "pointer",
			}}
		>
			<summary
				style={{
					fontSize: "16px",
					color: "#fcfcfc",
					background: "#282727",
					padding: "10px",
					borderRadius: "5px",
				}}
			>
				Debug (valores atuais)
			</summary>
			<pre
				style={{
					fontSize: "16px",
					color: "#29d113",
					background: "#282727",
					padding: "10px",
					borderRadius: "5px",
				}}
			>
				{JSON.stringify({ fieds, error, bussines, services }, null, 2)}
			</pre>
		</details>
	);
};
