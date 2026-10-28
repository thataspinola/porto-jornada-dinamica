# Core

Leia o AGENTS.md da raiz. Core compõe etapas, providers e renderers; não duplica a regra de serviço nem a implementação dos componentes do design system.

Use `useJourneyController` para reunir estado e formulário. Ações e carregamento ficam em `useJourneyActions`; navegação mantém `navigateTo`/`goBack`. Passe métodos reais do React Hook Form pelo FormProvider e preserve o contexto da variante da jornada.

Erros e skeletons devem refletir o estado real, sem respostas artificiais. Não acrescente fluxos de demonstração para contornar backend ou configuração ausentes. Preserve o conteúdo declarativo e as regras específicas de REFF/FCDC.

Specs ficam em `test/src/components/Core`. Cubra navegação, validação, falhas de serviço e impressão única da promoção. Não use aliases globais para substituir dependências de produção.
