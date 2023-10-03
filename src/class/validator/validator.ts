import { ValidationSignature } from "src/signatures/validator-signature";

export class ValidatorComposite implements ValidationSignature {
    constructor (private readonly validations: ValidationSignature[]) {}
    validate(data: any): any {
        for (const validation of this.validations) {
            const error = validation.validate(data)
            if (error) {
                return error
            }
        }
    }
}