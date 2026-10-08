export type ServiceResult = {
	success: boolean;
	error?: string;
	code?: string;
	message?: string;
	data?: unknown;
};

export type ServiceHandler = (input: unknown) => Promise<ServiceResult>;
