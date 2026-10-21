# Infraestrutura

Leia o AGENTS.md da raiz. Carbon usa a configuração corporativa original; não introduza clientes HTTP alternativos, URLs locais ou respostas de sucesso como fallback.

A factory do QueryClient preserva as políticas de cache e retry e fornece uma instância para cada provider. Não compartilhe dados de usuários entre renderizações de servidor. Evite dependências de providers React dentro da configuração do cache.

Separe código de servidor e cliente. Não exponha segredos por barrels consumidos no navegador. Specs de infraestrutura ficam em `test/src/lib`.
