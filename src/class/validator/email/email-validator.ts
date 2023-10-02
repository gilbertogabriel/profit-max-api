import { InvalidParamError } from "src/class/error/invalid-param-error";
import { ValidationSignature } from "src/signatures/validator-signature";
import validator from 'validator';

export class EmailValidator implements ValidationSignature {
  constructor(private readonly field: string) { }
  validate(data: any): Error {
    if (!validator.isEmail(data[this.field]))
      return new InvalidParamError(this.field)
  }
}