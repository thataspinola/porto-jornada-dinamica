# Compatibilidade dos componentes

A versão de produção usa os schemas e o registro tipado em `JourneyRenderElements`. A conciliação preserva os componentes e contratos dessa versão, incorporando a promoção de CPF e os padrões de testes/validação. Não reaplica o renderizador genérico do protótipo sobre componentes nativos.

| Área anterior | Implementação atual |
| --- | --- |
| CPF | `TaxvatInputElement`, registrado como `TAXVAT_INPUT`, com formulário, máscara e erro de servidor |
| Placa de veículo | Elementos específicos REFF/FCDC registrados para cada jornada |
| ProgressBar | Componente UI usado pelo wrapper da jornada |
| Feedback de erro | `FullscreenErrorView`, com ações declarativas do tratamento de erro |
| ProductList | `ProductsListElement`, com o contrato `PRODUCTS_LIST` da produção |
| Drawer, Tabs, PriceSelector, ComposableCard | Implementações de produção registradas, com seus testes preservados |
| ConditionalWrapper | Implementação de produção com visibilidade via formulário; promoção restrita à negativa de CPF em REFF/FCDC |
| Controles visuais | Wrappers atuais de UI ou uso direto do design system conforme a base de produção |

Os nomes anteriores não são aliases automaticamente compatíveis de tipos JSON. A definição deve seguir o schema atual: por exemplo, não converter `CPF_INPUT` em `TAXVAT_INPUT` apenas trocando o texto sem conferir o config e o formulário.

`ChipsImageElement`, `MiniBannerHighlightElement` e `ProductCardConsorcioElement` da versão anterior eram adaptadores do `ConfiguredElement` genérico. Os tipos `CHIPS_IMAGE`, `MINI_BANNER_HIGHLIGHT` e `PRODUCT_CARD_CONSORCIO` não aparecem nos JSONs atuais nem integram o contrato de produção recebido. Esses protótipos não foram restaurados como componentes sem uso. Não se declara equivalência funcional com definições externas que ainda dependam desses tipos: elas exigem uma implementação e migração explícitas, com schema, formulário, renderer e testes.

`EntryCalculationService` continha parâmetros mockados e não tinha consumidores no app. Ele foi removido. O cálculo de entrada FCDC em uso permanece em `useEntryCalculation`, que chama `executeJourneyService` com `entry-calculation/product-domains`.

## Verificações

`npm run check:journeys` lê os registros de schema e renderer sem executar pacotes corporativos e verifica os tipos dos elementos nos JSONs versionados, incluindo os containers de grid. Falta de schema, de renderer, JSON inválido ou tipo não suportado fazem o comando falhar. Essa verificação estrutural não valida todos os campos do config.

O teste `journeys.integration.spec.ts` valida as definições completas com o Zod real. Sua execução depende das dependências corporativas usadas pelos schemas. Os testes de controller exercitam formulário e TanStack reais, isolando serviços, qualidade de dados e navegação em fronteiras explícitas; não substituem homologação. E2E continua exigindo aplicação e backend autorizados.

Cobertura configurada, teste isolado ou análise estática não comprovam funcionamento integral em produção. Registrar os resultados e bloqueios de type-check, lint, build, cobertura e E2E antes da integração.
