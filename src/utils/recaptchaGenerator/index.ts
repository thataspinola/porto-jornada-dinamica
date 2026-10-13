export async function recaptchaGenerator(siteKey: string, action: string) {
	if (!window.grecaptcha) throw new Error("reCAPTCHA indisponível");
	await new Promise<void>((resolve) => window.grecaptcha.ready(resolve));
	return window.grecaptcha.execute(siteKey, { action });
}
