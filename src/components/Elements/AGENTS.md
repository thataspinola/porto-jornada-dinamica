# Elements

Leia o AGENTS.md da raiz. Cada elemento liga seu schema ao formulário e ao componente visual original. Derive tipos da definição declarativa; não replique shapes incompatíveis ou adapte propriedades corporativas para APIs antigas de componentes simplificados.

Containers renderizam seus filhos e respeitam as condições. Regras específicas de analytics devem ficar em builders testáveis, mantendo o wrapper genérico. A promoção de CPF é restrita a `cpf-recommended-products-wrapper` em REFF/FCDC e enviada uma única vez quando visível.

Não calcule elegibilidade, preço ou condições comerciais na apresentação. Serviços usam o fluxo original de produto/módulo/ação e o tratamento de erros existente.

Specs ficam em `test/src/components/Elements`, incluindo estados do formulário, acessibilidade e prevenção de reenvio sob re-render e StrictMode.
