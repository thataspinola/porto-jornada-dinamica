import type { Validator } from "../types/validator";

export class CPFValidator implements Validator {
  constructor(private message: string) { }
  validate(value: any) {
    const cleanCpf = String(value || "").replace(/\D/g, "");
    return cleanCpf.length !== 11 ? this.message || "CPF inválido" : null;
  }
}
