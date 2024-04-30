import { plainToClass } from 'class-transformer';
import { cpf } from 'cpf-cnpj-validator';
import { 
    PipeTransform, 
    Injectable, 
    BadRequestException 
} from '@nestjs/common';
import { 
    validate, 
    IsString, 
    IsNotEmpty, 
    ValidationError 
} from 'class-validator';

class CpfValidation {
    @IsString()
    @IsNotEmpty({ message: 'The CPF must not be empty' })
    cpf: string;
}

@Injectable()
export class ValidateCpfPipe implements PipeTransform<string> {
    async transform(value: string): Promise<string> {
        const object = plainToClass(CpfValidation, { cpf: value });

        const errors: ValidationError[] = await validate(object);
        if (errors.length > 0) {
            throw new BadRequestException(
                'Validation failed: CPF must not be empty'
            );
        }

        if (!cpf.isValid(value)) {
            throw new BadRequestException(
                'The CPF must have exactly 11 digits'
            );
        }

        return value;
    }
}
