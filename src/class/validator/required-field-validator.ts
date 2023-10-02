import { ValidationSignature } from "src/signatures/validator-signature";
import { MissingParamError } from "../error/missing-param-error";

export class RequiredFieldValidator implements ValidationSignature {
    constructor (private readonly field: string) {}

    validate(data: Record<string, any>): Error {
        if (!data[this.field]) {
            return new MissingParamError(this.field)
        }
    }
}