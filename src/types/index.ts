
export interface FieldOption {
  label: string
  value: string
}

export interface FetchOptions {
  url: string
  method?: "GET" | "POST"
  labelKey?: string
  valueKey?: string
}

export interface ApiValidation {
  url: string;
  method: 'GET' | 'POST';
  invalidKey?: string;
  invalidValue: unknown;
}

export interface FieldValidation {
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  api?: ApiValidation;
  messages?: Record<string, string>
}

export interface Element {
  id: string
  label: string
  type:
  | 'text'
  | 'email'
  | 'phone'
  | 'cpf'
  | 'cnpj'
  | 'date'
  | 'number'
  | 'select'
  | 'radio'
  | 'checkbox'
  | 'textarea'
  | 'appointment'
  | 'spacing'
  | 'typography';

  required?: boolean
  placeholder?: string
  options?: FieldOption[]
  fetchOptions?: FetchOptions
  validate?: FieldValidation
  validators?: string[]
  rules?: Rule[]
}

export type RuleFunction =
  | { name: 'ageAtLeast'; args: { field: string; min: number } }
  | { name: 'cpfValid'; args: { field: string } }

export interface Rule {
  compare?: any;
  func: RuleFunction;
  message: string;
}

export interface Seo {
  title?: string;
  description?: string;
  canonical?: string;
  robots?: {
    index?: boolean;
    follow?: boolean;
  }
}

export interface Step {
  slug: string;
  title: string;
  subtitle?: string;
  kind: string;
  path: string;
  link: {
    next: string;
    back: string;
  }
  elements: Element[];
  rules?: Rule[];
  validators: string[];
  seo: Seo;
  layout?: {
    groups: Array<{ title?: string; description: string; fields: string[]; columns?: number }>
  }
}
export interface JourneyConfig {
  slug: string;
  title: string;
  steps: Step[];
  seo?: Seo;
}

export interface JourneyProps {
  config: JourneyConfig;
  slug: string;
  initialData?: Record<string, unknown>;
}
