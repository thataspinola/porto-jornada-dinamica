"use server";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
export async function readJourneyContent(slug: string) {
	if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug))
		throw new Error("Jornada inválida");
	return readFile(
		join(process.cwd(), "public", "jsonContent", slug + ".json"),
		"utf8",
	);
}
