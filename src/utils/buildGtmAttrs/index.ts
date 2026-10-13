export function buildGtmAttrs(name?: string, subname?: string) {
	return {
		...(name ? { "data-gtm-name": name } : {}),
		...(subname ? { "data-gtm-subname": subname } : {}),
	};
}
