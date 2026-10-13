export function notifyAddressError(notify: (message: string) => void) {
	notify("Não foi possível carregar os dados. Tente novamente.");
}
