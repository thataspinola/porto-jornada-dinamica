/** biome-ignore-all lint/suspicious/noExplicitAny: <explanation> */

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

type Rule = { [key: string]: string }

export interface Element {
  id: string
  label?: string
  type?: string;
  layout?: {
    marginTop?: string;
    marginBottom?: string;
  };
  uiProps?: any;
  required?: boolean;
  placeholder?: string;
  options?: FieldOption[];
  dependsOn?: {
    field: string;
    value: string;
    operator: string;
  }
  rules?: Rule[];
  action?: Action;
}

export interface Seo {
  title?: string;
  description?: string;
  canonical?: string;
  keywords?: string;
  robots?: {
    index?: boolean;
    follow?: boolean;
  }
}

export interface Action {
  type?: string;
  service?: string;
  target?: string;
  trigger?: string;
  onSuccess?: {
    type: string;
    target: string;
  }
}
export interface Step {
  id: string,
  slug: string;
  kind?: string;
  seo?: Seo;
  layout?: {
    width?: string,
    header?: {
      goBackLink: string;
      hasShoppingCart: boolean;
    };
    progressbar?: {
      start?: number,
      end?: number,
    },
  },
  elements?: Element[];
  action?: Action;
}

export interface JourneyConfig {
  steps: Step
}

export interface FormStepProps {
  step: Step;
  journeySlug: string;
}

export interface JourneyProps {
  data: {
    step: Step
    position: number;
    isFirst: boolean;
    isLast: boolean;
    progress: number;
  };
  slug: string;
}
