
// Tipos de elementos suportados
export type ElementType =
  | "text"
  | "button"
  | "select"
  | "typography"
  | "cpf"
  | "phone";

// Definição das ações assíncronas
export interface AsyncAction {
  trigger: "onBlur" | "onChange";
  service: string;
  target?: string; // para onde ir após sucesso
}

// O Elemento Genérico
export interface BaseElement {
  id: string;
  type: ElementType;
  validation?: {
    required?: boolean;
    pattern?: string;
    message?: string;
  };
  asyncActions?: AsyncAction[];
  // Aqui usamos Record para aceitar as props de qualquer componente da Ocean
  uiProps: Record<string, any>;
}


export interface FormElementProps {
  element: BaseElement;
  value: any;
  error?: string;
  onChange: (value: any) => void;
  // Callback opcional caso uma ação assíncrona precise mudar o step
  onActionComplete?: (result: any, target?: string) => void;
}
