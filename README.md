# @porto/react-ssr-corp-hubv-dinamic-journey

Esse projeto foi gerado via [Tech Store](https://portostage.portoseguro.brasil/).

## Pré-requisitos

Para execução dos comandos `npm` é necessário a instalação das dependências do projeto Dynamic Journey.

```bash
npm install
```

Aplicação Next.js para **executar jornadas (flows) declaradas em JSON**, com:

- renderização dinâmica de elementos por `type`
- validação de formulário gerada automaticamente a partir da jornada (Zod)
- navegação entre steps e chamadas de serviço (actions `NAVIGATION` e `SERVICE_CALL`)
- persistência de estado (Zustand)

## Stack

- Next.js (App Router): UI e runtime
- React Hook Form: controle de formulário
- Zod: validação estrutural (jornada) e validação do formulário (gerada dinamicamente)
- Zustand: store global do runner
- Jest + Testing Library: testes
- Biome: lint/format
- Sass: estilos (`.scss`) dos componentes base

## Como rodar

```bash
npm install
npm run dev
```

## Development server

Rode `npm run dev` para executar o servidor local do projeto e acesse `http://localhost:3000/react-ssr-corp-hubv-dinamic-journey`.

## Build

Rode `npm run build` para executar o build do projeto. Os artefatos serão armazenados no diretório `dist/react-ssr-corp-hubv-dinamic-journey`.

## Unit tests

Rode `npm run test` para executar os testes unitários via [Jest](https://www.npmjs.com/package/jest). Os resultados serão armazenados no diretório `coverage`.


## Verificações

Execute `npm run check:empty`, `npm run check:names`, `npm run format:check`, `npm run type-check`, `npm run lint` e `npm test -- --runInBand`. O runner oficial é Jest; a configuração Vitest é legada.

## Conteúdo e integração

As jornadas são lidas de `public/jsonContent`. Os JSONs recuperados de `src/mock` e as jornadas iniciais incluídas são exemplos de desenvolvimento; não substituem as definições comerciais homologadas. Os componentes exibem dados e opções declarados no JSON, sem calcular taxas ou aprovar propostas.

A elegibilidade exige a variável de ambiente **servidora** `ELIGIBILITY_URL`, com um endpoint que receba o contexto `{ serviceName, fields, business }` e retorne `{ eligible: boolean }` ou erro com `{ code: "NOT_ELIGIBLE", message?: string }`. Sem configuração, o fluxo retorna indisponibilidade e não aprova CPF. Esse contrato deve ser adaptado e validado com o BFF corporativo antes de uso real. Outros serviços precisam ser registrados em `src/services/serviceRegistry.ts`.

REFF e FCDC usam `taxvat` para CPF; a negativa exibe os dois produtos sugeridos e registra uma impressão conjunta. Scripts de terceiros são desabilitados por padrão e precisam ser habilitados pela integração responsável.

