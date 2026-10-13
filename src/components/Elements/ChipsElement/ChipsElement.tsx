"use client";
import {
	ConfiguredElement,
	type ConfiguredElementProps,
} from "@/components/Elements/ConfiguredElement";
import styles from "./ChipsElement.module.scss";
export function ChipsElement(props: ConfiguredElementProps) {
	return (
		<div className={styles.root}>
			<ConfiguredElement {...props} />
		</div>
	);
}
