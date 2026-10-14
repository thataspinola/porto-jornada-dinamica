export async function recaptchaGenerator(siteKey: string, action: string) {
	const client = window.grecaptcha?.enterprise ?? window.grecaptcha;
	if (!client?.execute) throw new Error("reCAPTCHA indisponível");
	const execute = client.execute.bind(client);
	if (client.ready)
		await new Promise<void>((resolve) => client.ready?.(resolve));
	return execute(siteKey, { action });
}
