import { readdir } from "node:fs/promises";
import { basename, dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const sourceRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../src");
const errors = [];

async function inspect(directory) {
	const entries = await readdir(directory, { withFileTypes: true });
	const names = new Set(entries.map((entry) => entry.name));
	for (const entry of entries) {
		const path = join(directory, entry.name);
		if (entry.isDirectory()) {
			await inspect(path);
			continue;
		}
		const name = entry.name;
		const display = relative(sourceRoot, path).replaceAll("\\", "/");
		const componentFile = /^(components|features)\//.test(display);
		const fail = (reason) => errors.push(`${display}: ${reason}`);
		if (/[\s,]/.test(name)) fail("o nome contém espaço ou vírgula");
		if (componentFile) {
			if (name === "index.tsx")
				fail("use implementação nomeada e barrel index.ts");
			if (name === "types.tsx" || name.endsWith(".types.ts"))
				fail("use types.ts");
			if (/^styles(?:\.module)?\.scss$/.test(name))
				fail("use o nome do componente no estilo");
			if (
				name.endsWith(".module.scss") &&
				name !== `${basename(dirname(path))}.module.scss` &&
				!names.has(name.replace(".module.scss", ".tsx"))
			)
				fail("o módulo de estilo deve ter o nome do componente");
			if (
				/^index[.,]\.(spec|test)\./.test(name) ||
				/^index\.(spec|test)\.tsx$/.test(name)
			)
				fail("use <Componente>.spec.tsx");
			if (
				name.endsWith(".tsx") &&
				!name.endsWith(".spec.tsx") &&
				!/^[A-Z]/.test(name) &&
				name !== "renderJourneyElement.tsx"
			)
				fail("componentes usam PascalCase.tsx");
		}
		if (
			/validation\/(?:schemas|schemaValidation)\//.test(display) &&
			name.endsWith(".ts") &&
			name !== "index.ts" &&
			!/\.schemas?(?:\.spec)?\.ts$/.test(name)
		)
			fail("schemas usam .schema.ts ou .schemas.ts");
	}
}

await inspect(sourceRoot);
if (errors.length) {
	console.error(errors.join("\n"));
	process.exitCode = 1;
} else {
	console.log("Nomes e extensões dos arquivos estão no padrão.");
}
