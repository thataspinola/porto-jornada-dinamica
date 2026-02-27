import { cpfMask } from "@/utils";
import { Input } from "../Input";

export const CPF = ({
	value,
	onChange,
	label,
	isLoading,
	errorMessage,
}: any) => {
	return (
		<Input
			value={value}
			onChange={(value) => onChange(cpfMask(value))}
			label={label}
			isLoading={isLoading}
			errorMessage={errorMessage}
			style={{ marginBottom: "32px" }}
		/>
	);
};
