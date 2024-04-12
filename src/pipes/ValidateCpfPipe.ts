import { plainToInstance } from 'class-transformer';
import {
    PipeTransform,
    Injectable,
    BadRequestException
} from '@nestjs/common';
import {
    validateOrReject,
    IsString,
    Length
} from 'class-validator';

class CpfValidation {
    @IsString()
    @Length(11, 11, { message: 'The CPF must have exactly 11 digits.' })
    cpf: string;
}

@Injectable()
export class ValidateCpfPipe implements PipeTransform<string> {
    async transform(value: string): Promise<string> {
        const object = plainToInstance(CpfValidation, { cpf: value });
        try {
            await validateOrReject(object);
            return value;
        } catch (errors) {
            if (Array.isArray(errors) && errors.length > 0) {
                const constraints = errors[0].constraints;
                if (constraints) {
                    const messages = Object.values(constraints);
                    if (messages.length > 0) {
                        throw new BadRequestException(messages[0]);
                    }
                }
            }
            throw new BadRequestException('Validation failed');
        }
    }
}
