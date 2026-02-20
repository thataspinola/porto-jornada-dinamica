
// Tipos de elementos suportados
/** biome-ignore-all lint/suspicious/noExplicitAny: <explanation> */
export type ElementType =
  | "number"
  | "text"
  | "button"
  | "select"
  | "typography"
  | "cpf"
  | "phone"
  | "textarea"
  | "email"
  | "cnpj"
  | "date"
  | "radio"
  | "checkbox"
  | "appointment"
  | "spacing";

// Definição das ações assíncronas
export interface Action {
  type?: string;
  service?: string;
  onSuccess?: {
    type: string;
    target: string;
  }
}

export interface BaseElement {
  id: string;
  type: ElementType;
  validation?: {
    required?: boolean;
    pattern?: string;
    message?: string;
  };
  action?: Action;
  uiProps: Record<string, any>;
  dependsOn?: {
    field: string;
    value: string;
    operator: string;
  }
}

export interface FormElementProps {
  journeySlug: string;
  element: BaseElement;
  onStepAction: () => void;
}
