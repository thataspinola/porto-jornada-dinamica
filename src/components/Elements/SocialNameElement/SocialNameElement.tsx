"use client";
import Image from "next/image";
import { useState } from "react";
import { Controller } from "react-hook-form";

import {
	CheckboxWithoutState,
	Input,
	Notification,
	Spacing,
} from "@/components/UI";
import { sanitize } from "@/utils";
import { DialogSocialName } from "./DialogSocialName";
import SGVIcCircleQuestion from "./icons/ic-circle-alert.svg";

import type { SocialNameElementProps } from "./types";

export const SocialNamElement = ({
	element,
	control,
}: SocialNameElementProps) => {
	const config = element.config;
	const [showDialog, setShowDialog] = useState<boolean>(false);

	return (
		<Controller
			control={control}
			name={config.name}
			defaultValue={false}
			render={({ field }) => {
				const handleCheckboxClick = () => {
					if (field.value) field.onChange(false);
					setShowDialog(true);
				};

				const onConfirmSocialName = () => {
					field.onChange(true);
					setShowDialog(false);
				};

				return (
					<>
						<CheckboxWithoutState
							value={!!field.value}
							label={config.label}
							title={field.name}
							handleClick={handleCheckboxClick}
						/>

						<Spacing bottom={3.2} />

						{field.value && (
							<div className="social-name">
								<Controller
									control={control}
									name="social_name_value"
									defaultValue=""
									render={({ field: inputField, fieldState }) => (
										<Input
											{...inputField}
											label="Nome social completo"
											value={String(inputField.value)}
											onChange={(value) =>
												inputField.onChange(sanitize.text(value))
											}
											variant="default"
											width="fluid"
											errorMessage={fieldState.error?.message ?? ""}
										/>
									)}
								/>
								<Notification
									description="O nome social será utilizado para sua identificação na Porto. Em caso de ajuste em apólice e contratos vigentes, entre em contato com o(a) Corretor(a) responsável ou com nosso canal de atendimento."
									icon={
										<Image
											src={SGVIcCircleQuestion}
											width={20}
											height={20}
											alt="icon"
										/>
									}
									variant="outlined"
								/>
							</div>
						)}

						<DialogSocialName
							isOpen={showDialog}
							handleCloseSocialNameDialog={() => setShowDialog(false)}
							handleSetSocialNameToTrue={onConfirmSocialName}
						/>
					</>
				);
			}}
		/>
	);
};
