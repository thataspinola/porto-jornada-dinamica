# Testes

Todos os specs e arquivos de suporte ficam nesta pasta, fora de `src`. Espelhe o caminho do módulo em `test/src`; E2E ficam em `test/e2e`. Use `.spec.ts` ou `.spec.tsx`, com `.integration.spec` e `.functional.spec` quando aplicável.

Vitest é o runner. Use as dependências reais declaradas no projeto. Não substitua pacotes corporativos por aliases globais, implementações paralelas ou declarações de tipos fictícias. Mocks pontuais de rede, relógio e efeitos externos são permitidos em cada spec; não devem alterar o contrato do módulo testado.

Teste comportamento observável, incluindo caminhos negativos, limpeza de efeitos e prevenção de duplicidade. Para CPF negativo em REFF/FCDC, valide `formErrors.taxvat.type = server`, exibição dos dois produtos e apenas um `view_promotion`, inclusive sob re-render e StrictMode. Verifique ausência de campos monetários não informados.

Mantenha os quatro limites globais de cobertura em 90%, incluindo todo `src`. Não exclua módulos nem pule testes para obter a meta. Registre separadamente dependências indisponíveis e falhas reais; não anuncie como validada uma execução bloqueada.

E2E usa Chromium instalado pelo Playwright e `E2E_BASE_URL` apontando para a aplicação configurada no ambiente de testes, incluindo seu basePath. Não crie servidores de negócio, endpoints alternativos ou respostas de sucesso para fazer a aplicação funcionar apenas em um computador. Dados comerciais e credenciais nunca devem ser versionados nas fixtures.
