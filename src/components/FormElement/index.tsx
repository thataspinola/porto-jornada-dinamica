import { asyncActionsRegistry } from "../../service/registry";
import { ButtonElement, TypographyElement } from "../Elements";
import { TextElement } from "../Elements/Text";

const ElementRegistry: Record<string, React.FC<any>> = {
  typography: TypographyElement,
  button: ButtonElement,
  text: TextElement, // Aqui entra o Input da Ocean
  cpf: TextElement,  // CPF também usa o TextElement, mas com máscara via uiProps
};

export const FormElement = ({ element, value, onChange }: FormElementProps) => {
  const Component = ElementRegistry[element.type];
  if (!Component) return null;

  // Função que lida com as ações do JSON (ex: Elegibilidade)
  const handleAsyncAction = async (currentValue: any) => {
    if (!element.asyncActions) return;

    for (const action of element.asyncActions) {
      try {
        const serviceFn = asyncActionsRegistry[action.service];
        if (serviceFn) {
          const result = await serviceFn(currentValue);
          console.log("Sucesso na ação:", action.service, result);
          // Aqui você pode disparar um callback para o FormStep mudar de tela
        }
      } catch (error) {
        console.error("Erro na ação dinâmica:", error);
      }
    }
  };

  return (
    <Component
      {...element.uiProps} // Passa label, placeholder, options, etc
      value={value}
      onChange={onChange}
      onBlur={() => handleAsyncAction(value)} // Dispara a consulta ao sair do campo
    />
  );
};
