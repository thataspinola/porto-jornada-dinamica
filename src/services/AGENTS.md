# Services

Leia o AGENTS.md da raiz. Mantenha o protocolo original Carbon: produto, módulo, ação, payload, metadados, reCAPTCHA, cookies e trace. O endpoint é configurado no servidor, não escolhido pelo formulário.

Use contratos tipados e propague erros. Não retorne sucesso para configuração ausente, não recrie adapters por URL usados apenas em uma execução e não invente conteúdo comercial. Preserve códigos, headers e cookies conhecidos; qualquer correção exige teste do contrato.

Segredos e tokens não entram em fixtures, logs ou código cliente. Mantenha autorização e promoção de cookies no servidor. Sessão reiniciada deve continuar seguindo o fluxo original.

Specs ficam em `test/src/services`, com mocks pontuais do transporte e da interface de cookies. Integração real depende da infraestrutura configurada; não confunda mock de transporte com homologação.
