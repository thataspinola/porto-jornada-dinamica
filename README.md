Desenho de Solução: Motor de Jornada Dinâmica

1. Caminho Síncrono (Endpoint Único / Orquestrador)
O usuário avança passo a passo, e cada transição depende de uma resposta imediata do servidor.

Prós:
Consistência de Dados: Garante que o usuário nunca avance com informações inválidas ou sem elegibilidade.

Simplicidade de Implementação: O motor de renderização é linear; ele apenas aguarda o "OK" para trocar de tela.

Lógica Centralizada: O Backend/CMS decide o próximo passo em tempo real (ex: se o CEP for de área de risco, já desvia para uma tela de aviso).

Contras:
Latência Percebida: O usuário sente cada "trava" de carregamento entre os passos.

Dependência de Performance: Se um serviço externo (ex: consulta FIPE) estiver lento, a jornada inteira parece travada para o cliente.

1. Caminho Assíncrono (Fluidez com Polling/Background)
O usuário preenche os dados continuamente, enquanto as validações pesadas ocorrem em "segundo plano".

Prós:
UX de Alta Performance: A jornada parece instantânea. O cliente não para de preencher enquanto o sistema "pensa" por trás.

Inteligência de Dados (Cross-Sell): Permite que o motor analise o perfil em tempo real e injete ofertas personalizadas (seguro residencial, vida) sem interromper o fluxo principal.

Resiliência: Se uma consulta externa demorar, o usuário continua preenchendo outros campos, e o resultado aparece apenas quando necessário (ex: no checkout).

Contras:
Complexidade de Estado: O motor precisa gerenciar "promessas" de dados. Se o usuário chegar ao fim e a elegibilidade der erro, o motor precisa saber como voltar e comunicar isso de forma amigável.

Desenvolvimento: Exige uma lógica de polling (consultas recorrentes) ou WebSockets no Frontend.
