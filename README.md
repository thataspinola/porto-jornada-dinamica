# @porto/react-ssr-corp-hubv-dinamic-journey

Esse projeto foi gerando via [Tech Store](https://portostage.portoseguro.brasil/).

## Pré-requisitos

Para execução dos comandos `npm` é necessário a instalação das dependências do projeto Dynamic Journey.

```bash
npm install
```

Aplicação Next.js para **executar jonadas (flows) declaradas em JSON**, com:

- renderização dinâmica de elementos por `type`
- validação de formulário gerada automticamente a partir da jornada (Zod)
- navegação entre steps e chamadas de serviço (actions `NAVIGATION` e `SERVICE_CALL`)
- persistência de estado (Zustand)

## Stack

- Next.js (App Router): UI e runtime
- React Hook Form: controle de formulário
- Zod: validação estrutural (jornada) e validação do formulário (gerada dinamicamente)
- Zustand: store global do runner
- Vitest + Testing Library: testes
- Biome: lint/format
- Sass: estiles (`.scss`) dos componentes base

## Como rodar

```bash
npm install
npm run dev
```

Abra `https://localhost:3000`.

## Scripts

```bash
npm run dev       # dev server
npm run build     # build de produção
npm run start     # roda o build
npm run lint      # biome check
npm run format    # biome format
npm run test      # vitest (watch)
npm run test:run  # vitest run (CI)
```

Se o problema estiver no Turbopack (Next dev):

```bash
npm run dev:webpack
```

## Documentação

Guias específicos vivem em [`docs/`](./docs/):

- [Conditions em `SERVICE_CALL` e `NAVIGATION`](./docs/conditions.md) - bloquear chamadas/navegação com regras declarativas (AND/OR), aplicar `notify`, `fieldError` ou `redirect`.

Padrões de cada pasta do `src/` estão documentadas nos `AGENTS.md` locais (ver [AGENTS.md raiz](./AGENTS.md)).

## Development server

Rode `npm run dev` para executar o servidor local do projeto e acesse `http://localhost:3000/react-ssr-corp-hubv-dinamic-journey`.

## Build

Rode `npm run build` para executar o build do projeto. Os artefatos serão armazenados no diretório `dist/react-ssr-corp-hubv-dinamic-journey`.

## Unit tests

Rode `npm run test` para executar os testes unitários via [Jest](https://www.npmjs.com/package/jest). Os resultados serão armazenados no diretório `coverage`.
