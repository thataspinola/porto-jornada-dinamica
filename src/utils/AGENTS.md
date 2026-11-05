# Utilitários

Preservar o padrão de uma pasta por util, com `index.ts`, e as máscaras agrupadas em `mask/`. Preferir funções puras para transformações e tipos derivados dos contratos existentes. Specs ficam somente em `test/src/utils/`, com `.spec.ts`; nunca ao lado da implementação dentro de src.

Separar funções puras de adaptadores com efeitos: analytics usa window/dataLayer, cookies e metadados têm fronteiras próprias, e leitura de arquivos/headers é de servidor. Usar guardas apropriadas e manter `'use server'` nos adaptadores que o exigem. Não exportar funções que dependem de filesystem pelo barrel usado no cliente; importar esses módulos diretamente no servidor.

O barrel `utils/index.ts` oferece utilitários compartilháveis; imports diretos são aceitos para preservar cliente/servidor, evitar ciclos ou dependências desnecessárias. Não importar UI, hooks ou transporte nas funções puras. Tipos de schemas podem ser usados sem importar o runtime.

`buildRecommendedProductsPromotion` monta o payload da sugestão de CPF sem efeitos. Ele aceita apenas o wrapper e as jornadas REFF/FCDC previstos, percorre os containers existentes e envia os dois cards completos. O wrapper decide visibilidade e disparo único; `pushEvent` mantém a serialização nativa. Não acrescentar preços, moeda, valor, SKU ou campo URL fora do contrato aprovado.

Testar entradas válidas/limites e regressões reais; não espelhar apenas a implementação. Não excluir código de produção da cobertura nem reduzir limites. Manter mensagens e contratos fornecidos pela jornada, sem inventar dados.
