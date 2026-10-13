export function splitFullName(name: string) {
	const [firstName = "", ...rest] = name.trim().split(/\s+/);
	return { firstName, lastName: rest.join(" ") };
}
