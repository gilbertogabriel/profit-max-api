import { EmailValidator } from "src/class/validator/email/email-validator";
import { RequiredFieldValidator } from "src/class/validator/required-field-validator";
import { ValidatorComposite } from "src/class/validator/validator";
import { ValidationSignature } from "src/signatures/validator-signature";

export const findUserByEmailValidatorDecorator = (): ValidationSignature => {
    const validation: ValidationSignature[] = []
    const requiredFields = ['email', 'senha']
    for (const element of requiredFields) {
        validation.push(new RequiredFieldValidator(element))
    }
    validation.push(new EmailValidator('email'))
    return new ValidatorComposite(validation)
}