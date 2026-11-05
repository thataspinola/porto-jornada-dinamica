# Changelog

## Não lançado

- Reaplicação dos padrões sobre a versão de produção: testes externos em test/, sufixo .spec e execução exclusivamente com Vitest, sem aprovação quando nenhum teste for encontrado.
- Evento view_promotion na exibição das sugestões da negativa de CPF em REFF/FCDC, com os dois produtos do JSON e bloqueio de reenvio por montagem.
- Correção de casing/imports, convenção do schema de CEP, declarações de testes externas e isolamento do QueryClient por provider.
- Verificações de estrutura/imports, documentação gerada, diário Git e Conventional Commits, preservando o fluxo GitLab/Jenkins existente.
- Copia de public/static no standalone e validação de tipos no build.
