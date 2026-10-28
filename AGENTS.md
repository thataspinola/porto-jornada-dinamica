# Jornada Dinâmica

Leia este arquivo e o AGENTS.md mais próximo antes de editar. Os componentes, serviços e contratos originais existentes são a referência de produção. Preserve seu estilo, organização, nomes, propriedades e integrações; corrija consumidores e erros de transcrição sem reconstruir versões simplificadas desses contratos.

## Organização

- `src/app`: rotas e composição da aplicação.
- `src/components/Core`: orquestração e renderização da jornada.
- `src/components/Elements`: integração entre schemas, formulário e componentes.
- `src/components/UI`: apresentação e composição do design system corporativo.
- `src/hooks`: estado e efeitos React, consultas e ações da jornada.
- `src/services`: adapters do backend e contratos de integração.
- `src/store`: estado da jornada, navegação e hidratação.
- `src/validation`: schemas, validadores de domínio, primitivos e montagem de formulário.
- `src/utils`: transformações e integrações auxiliares existentes.
- `test`: todos os specs e suporte; nunca criar testes dentro de `src`.

## Padrões

Use TypeScript, React, Next, Zod, React Hook Form, Zustand e TanStack Query conforme os módulos existentes. Mantenha Vitest como runner único e o preset Biome corporativo. Preserve componentes compostos, `index.tsx`, `styles.module.scss`, barrels e arquivos de tipos conforme a pasta de produção; não renomeie módulos apenas para impor uma convenção diferente.

Prefira `@/` entre domínios e imports relativos para composição interna da pasta. Separe dependências de servidor das de cliente: não exporte leitura de arquivos, segredos ou adapters de backend em barrels consumidos pelo navegador.

## Responsabilidades e qualidade

Aplique SOLID para resolver dependências concretas: UI não chama backend; Elements ligam contratos ao formulário; hooks coordenam efeitos; services adaptam o protocolo; schemas validam estruturas; utils transformam dados. Evite duplicação e componentes genéricos que substituam implementações de produção. Não introduza interfaces ou classes sem necessidade de substituição real.

Use tipos derivados dos contratos existentes. Prefira nomes claros, retornos explícitos e funções com uma responsabilidade. Não altere regra comercial, nomes de headers, cookies ou eventos sem evidência no contrato. Erros devem continuar como erros; não invente taxas, produtos, elegibilidade ou respostas de sucesso.

Não adicione configurações exclusivas de um ambiente de desenvolvimento, caminhos absolutos, aliases de pacotes corporativos para dublês, presets locais alternativos, shims de tipos ou endpoints simulados à aplicação. Não versionar credenciais, logs, relatórios de execução ou mensagens de conversa.

## Validação e entrega

Execute `npm run check:imports`, `npm run check:names`, `npm run check:empty`, `npm run type-check`, `npm run lint` e os testes relevantes. Execute `npm run test:coverage`; mantenha os quatro limites globais em 90% sem reduzir o conjunto de produção. E2E exige o ambiente descrito em `test/AGENTS.md`.

Use Conventional Commits e branches `fix/`, `feat/`, `refactor/` ou `chore/`. Preserve alterações do usuário. Não use force push ou desative verificações para concluir uma entrega. Dependências indisponíveis e verificações bloqueadas devem ser informadas com precisão.
