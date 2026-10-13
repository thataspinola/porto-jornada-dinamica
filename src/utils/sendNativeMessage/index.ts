export function sendNativeMessage(payload: Record<string, unknown>) {
	const bridge = (
		window as Window & {
			ReactNativeWebView?: { postMessage: (message: string) => void };
		}
	).ReactNativeWebView;
	if (!bridge) return false;
	bridge.postMessage(JSON.stringify(payload));
	return true;
}
