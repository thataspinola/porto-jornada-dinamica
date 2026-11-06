# Changelog

## Não lançado

- Limpeza de declarações sem uso e remoção do serviço de cálculo mockado não referenciado; o fluxo FCDC continua no serviço nativo.
- Separação do estado do formulário, qualidade de dados e sequência de serviços, com regressões de falha, nova tentativa, payloads e navegação.
- Correção da origem do CPF no evento de lead, diagnóstico de falha de analytics sem dados pessoais e limpeza dos efeitos do toolkit Lexis sem eval.
- Verificação automatizada de compatibilidade entre tipos dos JSONs, schemas e renderer; TypeScript passa a verificar locais/parâmetros sem uso.

- Reaplicação dos padrões sobre a versão de produção: testes externos em test/, sufixo .spec e execução exclusivamente com Vitest, sem aprovação quando nenhum teste for encontrado.
- Evento view_promotion na exibição das sugestões da negativa de CPF em REFF/FCDC, com os dois produtos do JSON e bloqueio de reenvio por montagem.
- Correção de casing/imports, convenção do schema de CEP, declarações de testes externas e isolamento do QueryClient por provider.
- Verificações de estrutura/imports, documentação gerada, diário Git e Conventional Commits, preservando o fluxo GitLab/Jenkins existente.
- Copia de public/static no standalone e validação de tipos no build.
