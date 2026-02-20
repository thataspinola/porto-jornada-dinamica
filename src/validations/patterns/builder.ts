import type { Validator } from "../types/validator";
import { CPFValidator } from "../validators/cpfValidator";
import { RequiredValidator } from "../validators/requiredValidator";
import { ValidationComposite } from "./composite";

export class ValidationBuilder {
  private validators: Validator[] = [];

  static field() {
    return new ValidationBuilder();
  }

  required(message: string) {
    this.validators.push(new RequiredValidator(message));
    return this;
  }

  cpf(message: string) {
    this.validators.push(new CPFValidator(message));
    return this;
  }

  build(): Validator {
    return new ValidationComposite(this.validators);
  }

  static fromJson(rules: any[]): Validator {
    const builder = ValidationBuilder.field();
    rules.forEach((rule) => {
      if (rule.type === "required") builder.required(rule.message);
      if (rule.type === "cpf") builder.cpf(rule.message);
    });
    return builder.build();
  }
}
