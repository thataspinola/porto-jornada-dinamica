"use client";
import { useEffect, useState } from "react";
export type NotificationMessage = {
	type: "error" | "success";
	title: string;
	description: string;
	fullscreen?: boolean;
	actionButton?: { children: string; onClick?: () => void };
};
const EVENT = "journey:notification";
export function notify(message: NotificationMessage) {
	if (typeof window !== "undefined")
		window.dispatchEvent(new CustomEvent(EVENT, { detail: message }));
}
export function JourneyNotifier() {
	const [message, setMessage] = useState<NotificationMessage>();
	useEffect(() => {
		const handle = (event: Event) =>
			setMessage((event as CustomEvent<NotificationMessage>).detail);
		window.addEventListener(EVENT, handle);
		return () => window.removeEventListener(EVENT, handle);
	}, []);
	if (!message) return null;
	const content = (
		<>
			<h2>{message.title}</h2>
			<p>{message.description}</p>
			{message.actionButton && (
				<button type="button" onClick={message.actionButton.onClick}>
					{message.actionButton.children}
				</button>
			)}
			<button type="button" onClick={() => setMessage(undefined)}>
				Fechar
			</button>
		</>
	);
	return message.fullscreen ? (
		<div role="dialog" aria-modal="true" aria-label={message.title}>
			{content}
		</div>
	) : (
		<section role="alert">{content}</section>
	);
}
