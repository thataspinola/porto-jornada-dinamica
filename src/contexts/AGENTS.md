# Contexts

Leia o AGENTS.md da raiz. Providers compõem as dependências originais e respeitam o ciclo de vida React. Mantenha uma instância de cache por provider e use o Notifier corporativo.

Não substitua pacotes por implementações locais nem crie estado global compartilhado para contornar dependências. Tipos de children e callbacks devem ser explícitos.

Specs ficam em `test/src/contexts`; valide isolamento de instâncias e disponibilidade dos contextos para seus consumidores.
