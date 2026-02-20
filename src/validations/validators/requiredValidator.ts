import type { Validator } from "../types/validator";

export class RequiredValidator implements Validator {
  constructor(private message: string) { }
  validate(value: any) {
    return !value || value === "" ? this.message || "Campo obrigatório" : null;
  }
}
