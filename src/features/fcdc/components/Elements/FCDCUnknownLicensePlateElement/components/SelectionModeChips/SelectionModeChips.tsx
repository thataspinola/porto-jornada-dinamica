"use client";
import {
	ConfiguredElement,
	type ConfiguredElementProps,
} from "@/components/Elements/ConfiguredElement";
import styles from "./SelectionModeChips.module.scss";
export function SelectionModeChips(props: ConfiguredElementProps) {
	return (
		<div className={styles.root}>
			<ConfiguredElement {...props} />
		</div>
	);
}
