export function calculateAge(value: string, now = new Date()): number | null {
	const parts = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value);
	const iso = parts ? parts[3] + "-" + parts[2] + "-" + parts[1] : value;
	if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return null;
	const [year, month, day] = iso.split("-").map(Number);
	const date = new Date(year, month - 1, day);
	if (
		date.getFullYear() !== year ||
		date.getMonth() !== month - 1 ||
		date.getDate() !== day ||
		date > now
	)
		return null;
	return (
		now.getFullYear() -
		year -
		(now.getMonth() < month - 1 ||
		(now.getMonth() === month - 1 && now.getDate() < day)
			? 1
			: 0)
	);
}
