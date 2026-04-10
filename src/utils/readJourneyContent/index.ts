"use server";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

export async function readJourneyContent(slug: string) {

  const __dirname = fileURLToPath(import.meta.url);
  const contentDirPath = '../../../mock/jsonContent';

  const folderPath = resolve(__dirname, contentDirPath);
  try {


    const file = await readFile(`${folderPath}/${slug}.json`, {
      encoding: 'utf-8'
    });

    return file;

  } catch (error) {
    console.error("Erro ao listar arquivos:", error);
    return await readFile(`${folderPath}/file-not-found.json`, {
      encoding: 'utf-8'
    });

  }
}
