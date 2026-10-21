# Store

Leia o AGENTS.md da raiz. Zustand mantém dados de jornada, navegação e hidratação; não deve executar serviços nem conter regra visual.

Preserve os domínios existentes e seus métodos. Mesclas não descartam valores de outros domínios. Reset limpa dados da jornada; hidratação não deve apagar defaults necessários ao formulário. Não persista credenciais nem tokens adicionais.

Use seletores estáveis quando necessários e evite subscriptions sem limpeza. Tipos devem vir do contrato de estado, não de declarações globais fictícias.

Specs ficam em `test/src/store`; cubra merge, reset, persistência e hidratação.
