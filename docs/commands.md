<!-- Gerado por npm run docs:generate. -->
# Comandos do projeto

Node: ^22.12.0 || ^24.0.0 || >=26.0.0.

| Comando | Execução |
| --- | --- |
| npm run build | next build |
| npm run changelog | node scripts/change-journal.mjs |
| npm run check:empty | node scripts/check-empty.mjs |
| npm run check:imports | node scripts/check-imports.mjs |
| npm run check:journeys | node scripts/check-journeys.mjs |
| npm run check:names | node scripts/check-file-names.mjs |
| npm run commits:check | node scripts/check-commits.mjs |
| npm run dev | next dev --turbopack |
| npm run dev:webpack | next dev --webpack |
| npm run docs:check | node scripts/generate-reference.mjs --check |
| npm run docs:generate | node scripts/generate-reference.mjs |
| npm run format | biome format --write ./src ./test |
| npm run format:check | biome format ./src ./test |
| npm run format:style | stylelint "src/**/*.scss" --fix |
| npm run lint | biome check ./src ./test |
| npm run lint:fix | biome check --write ./src ./test |
| npm run lint:style | stylelint "src/**/*.scss" |
| npm run postbuild | node scripts/copy-standalone.mjs |
| npm run start | node dist/react-ssr-corp-hubv-dinamic-journey/standalone/server.js |
| npm run test | vitest run |
| npm run test:all | npm run test:coverage && npm run test:e2e |
| npm run test:ci | vitest run --coverage |
| npm run test:coverage | vitest run --coverage |
| npm run test:e2e | vitest run --config vitest.e2e.config.mjs |
| npm run test:e2e:install | playwright install chromium |
| npm run test:functional | vitest run functional.spec |
| npm run test:integration | vitest run integration.spec |
| npm run test:run | vitest run |
| npm run test:ui | vitest --ui --coverage |
| npm run test:unit | vitest run --exclude "**/*.integration.spec.*" --exclude "**/*.functional.spec.*" |
| npm run test:watch | vitest |
| npm run type-check | tsc --noEmit |
| npm run verify | npm run check:imports && npm run check:empty && npm run check:names && npm run check:journeys && npm run docs:check && npm run format:check && npm run type-check && npm run lint && npm run lint:style && npm run test:coverage |
