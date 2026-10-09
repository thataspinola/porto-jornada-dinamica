/** biome-ignore-all lint/suspicious/noArrayIndexKey: <> */
"use client";
import { useMemo, useState } from "react";
import "./DebugFloatingButton.scss";
interface DebugProps {
	data: Record<string, any>;
}
export function DebugFloatingButton({ data }: DebugProps) {
	const [isOpen, setIsOpen] = useState(false);
	const coloredJson = useMemo(() => {
		if (!data || Object.keys(data).length === 0) {
			return (
				<span className="debug-empty">Nenhum dado capturado ainda...</span>
			);
		}
		const jsonString = JSON.stringify(data, null, 2);
		const cleanRegex =
			/("(?:\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(?:\s*:)?|\b(?:true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g;
		const parts = jsonString
			.split(cleanRegex)
			.filter((part) => part !== undefined && part !== "");
		return parts.map((part, index) => {
			if (/^\s+$/.test(part)) return part;
			let className = "debug-text";
			if (/^"/.test(part)) {
				if (/:$/.test(part)) {
					className = "debug-key";
				} else {
					className = "debug-string";
				}
			} else if (/true|false/.test(part)) {
				className = "debug-boolean";
			} else if (/null/.test(part)) {
				className = "debug-null";
			} else if (/-?\d/.test(part)) {
				className = "debug-number";
			}
			if (className === "debug-key") {
				return (
					<span key={index} className="debug-key">
						{part.replace(/:$/, "")}
						<span className="debug-separator">:</span>
					</span>
				);
			}
			return (
				<span key={index} className={className}>
					{part}
				</span>
			);
		});
	}, [data]);
	return (
		<div className={`debug-container ${isOpen ? "--open" : ""}`}>
			<button
				type="button"
				className="debug-button"
				onClick={() => setIsOpen(!isOpen)}
				title="Debug Journey Data"
			>
				{isOpen ? "✕" : "+"}
			</button>

			{isOpen && (
				<div className="debug-panel">
					<div className="debug-header">
						<h3>Journey Debugger</h3>
						<span className="debug-count">
							{Object.keys(data).length} campos
						</span>
					</div>
					<pre className="debug-code">{coloredJson}</pre>
				</div>
			)}
		</div>
	);
}
