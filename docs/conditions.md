# Condições

`config.conditions` é uma lista combinada com AND. Cada condição informa `source` (`fields`, `formErrors`, `business` ou `services`), `path`, `operator` (`equals`, `notEquals`, `exists`, `notExists`) e, quando necessário, `value`. Sem condições, o elemento fica visível. O caminho é relativo à fonte.

Para a negativa de CPF: `source: formErrors`, `path: taxvat.type`, `operator: equals`, `value: server`.
