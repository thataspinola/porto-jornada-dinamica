/** biome-ignore-all lint/a11y/useKeyWithClickEvents: <> */
/** biome-ignore-all lint/a11y/noStaticElementInteractions: <> */
import { clsx } from "@/utils";

import "./Radio.scss";

import type { RadioProps } from "./types";

export const Radio = ({
	className = "",
	variant = "default",
	description = "",
	onClick,
	children,
	...props
}: RadioProps) => {
	const isDisabled = variant === "disabled";

	const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
		if (isDisabled) {
			event.preventDefault();
			event.stopPropagation();
			return;
		}

		if (onClick) {
			onClick(event);
		}
	};

	const classes = clsx("radio", `--${variant}`, className);

	return (
		<div className={classes} onClick={handleClick} {...props}>
			<div className="radio__input">
				<svg
					width="21"
					height="20"
					viewBox="0 0 21 20"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
					className="radio__svg"
				>
					<title>radio</title>
					<path
						d="M15.5 6.66676L9.61714 13.3334L5.5 9.16604"
						stroke="white"
						strokeWidth="3"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
				</svg>
			</div>
			<p className="radio__label">{description}</p>
		</div>
	);
};
