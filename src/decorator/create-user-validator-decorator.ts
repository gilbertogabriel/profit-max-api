import { CompareFieldsValidation } from "src/class/validator/compare-fields/compare-fields-validator";
import { EmailValidator } from "src/class/validator/email/email-validator";
import { RequiredFieldValidator } from "src/class/validator/required-field-validator";
import { ValidatorComposite } from "src/class/validator/validator";
import { ValidationSignature } from "src/signatures/validator-signature";

export const createUserValidatorDecorator = (): ValidationSignature => {
    const validation: ValidationSignature[] = []
    const requiredFields = ['nome', 'email', 'senha', 'confirmacaoSenha']
    for (const element of requiredFields) {
        validation.push(new RequiredFieldValidator(element))
    }
    validation.push(new EmailValidator('email'))
    validation.push(new CompareFieldsValidation('senha', 'confirmacaoSenha'))
    return new ValidatorComposite(validation)
}