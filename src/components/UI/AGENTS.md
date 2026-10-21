# UI

Leia o AGENTS.md da raiz. Mantenha as composições e propriedades dos pacotes corporativos originais. Componentes visuais não conhecem serviços, store de jornada ou regras de elegibilidade.

Preserve os padrões da pasta: componentes compostos, `index.tsx`, barrels, `styles.module.scss` ou estilos nomeados conforme o código existente. Corrija referências e erros de transcrição sem reconstruir versões locais do design system.

Prefira tipos derivados com ComponentProps e atributos HTML concretos. Mantenha semântica, teclado e foco acessíveis. Não substitua tokens por valores ad hoc para fazer um componente funcionar em outro ambiente.

Specs ficam em `test/src/components/UI`. A validação de componentes corporativos exige as dependências reais; não simule tipos nem configure substituições globais para fazê-la passar.
