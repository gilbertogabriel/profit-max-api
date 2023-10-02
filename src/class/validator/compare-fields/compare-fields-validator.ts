import { InvalidParamError } from "src/class/error/invalid-param-error";
import { ValidationSignature } from "src/signatures/validator-signature";

export class CompareFieldsValidation implements ValidationSignature {
    constructor (private readonly fieldName: string, private readonly fieldCompareName: string) {}

    validate (input: any): any {
        if (input[this.fieldName] !== input[this.fieldCompareName]) {
            return new InvalidParamError(`${this.fieldCompareName} doesn't match`)
        }
    }
}
