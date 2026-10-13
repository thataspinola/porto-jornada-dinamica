"use client";
import {
	ConfiguredElement,
	type ConfiguredElementProps,
} from "@/components/Elements/ConfiguredElement";
import styles from "./REFFProposalSentElement.module.scss";
export function REFFProposalSentElement(props: ConfiguredElementProps) {
	return (
		<div className={styles.root}>
			<ConfiguredElement {...props} />
		</div>
	);
}
