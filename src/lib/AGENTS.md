# Infraestrutura

Preservar os clientes corporativos e seus contratos. O factory `createQueryClient` mantém a política de cache/retry e cria instâncias isoladas por provider; não introduzir cache global compartilhado entre usuários. Manter segredos, clientes de servidor e transporte fora de módulos cliente. Testes ficam em `test/src/lib/`.
