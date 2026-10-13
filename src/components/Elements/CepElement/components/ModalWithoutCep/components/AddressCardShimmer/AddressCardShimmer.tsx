"use client";
import {
	ConfiguredElement,
	type ConfiguredElementProps,
} from "@/components/Elements/ConfiguredElement";
import styles from "./AddressCardShimmer.module.scss";
export function AddressCardShimmer(props: ConfiguredElementProps) {
	return (
		<div className={styles.root}>
			<ConfiguredElement {...props} />
		</div>
	);
}
