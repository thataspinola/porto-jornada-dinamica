"use client";
import { FormProvider, type UseFormReturn } from "react-hook-form";
import type { ReactNode } from "react";
export function JourneyStepForm({
	form,
	onSubmit,
	children,
}: {
	form: UseFormReturn<Record<string, unknown>>;
	onSubmit: (values: Record<string, unknown>) => void;
	children: ReactNode;
}) {
	return (
		<FormProvider {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} noValidate>
				{children}
			</form>
		</FormProvider>
	);
}
