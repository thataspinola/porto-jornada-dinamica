export function useAddressStatus({
	isLoading,
	error,
	data,
}: {
	isLoading: boolean;
	error?: Error;
	data?: unknown[];
}) {
	return isLoading
		? "loading"
		: error
			? "error"
			: data?.length
				? "ready"
				: "empty";
}
