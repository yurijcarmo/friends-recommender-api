import { cpf } from 'cpf-cnpj-validator';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'cpf', async: false })
export class CpfValidator implements ValidatorConstraintInterface {
  validate(value: string) {
    return cpf.isValid(value)
  }

  defaultMessage() {
    return 'The document number must be a valid CPF with 11 digits';
  }
}
