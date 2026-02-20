import type { Validator } from "../types/validator";

export class ValidationComposite implements Validator {
  constructor(private validators: Validator[]) { }

  validate(value: any): string | null {
    for (const validator of this.validators) {
      const error = validator.validate(value);
      if (error) return error;
    }
    return null;
  }
}
