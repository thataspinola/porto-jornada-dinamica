"use client";
import {
	ConfiguredElement,
	type ConfiguredElementProps,
} from "@/components/Elements/ConfiguredElement";
import styles from "./FCDCPriceSimmulationElement.module.scss";
export function FCDCPriceSimmulationElement(props: ConfiguredElementProps) {
	return (
		<div className={styles.root}>
			<ConfiguredElement {...props} />
		</div>
	);
}
