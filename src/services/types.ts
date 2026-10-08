export type ServiceResult = {
	success: boolean;
	error?: string;
	data?: unknown;
};

export type ServiceHandler = (input: unknown) => Promise<ServiceResult>;
