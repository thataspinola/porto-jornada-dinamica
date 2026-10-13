import { ensureAnalyticsUserId } from "./index";
test("reutiliza o identificador da sessão", () => {
	sessionStorage.clear();
	expect(ensureAnalyticsUserId()).toBe(ensureAnalyticsUserId());
});
