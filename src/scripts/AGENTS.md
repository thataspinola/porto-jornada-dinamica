# Scripts

Leia o AGENTS.md da raiz. Preserve os identificadores e contratos das integrações originais. Não inclua valores de outra aplicação, caminhos de uma máquina, credenciais ou scripts de demonstração.

Evite inicialização duplicada quando o host já fornece a integração. Remova listeners e timers criados pelo módulo. Código cliente nunca deve ler segredos do servidor.

Specs ficam em `test/src/scripts`, com efeitos externos isolados no próprio spec. Não anuncie integração real como validada somente porque um script foi renderizado no teste.
