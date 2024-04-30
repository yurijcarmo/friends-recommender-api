import { CpfValidator } from '../validators';
import {
    IsNotEmpty,
    IsString,
    Validate
} from 'class-validator';

export class PersonDto {

    @IsString()
    @IsNotEmpty()
    @Validate(CpfValidator)
    cpf: string;

    @IsString()
    @IsNotEmpty()
    name: string;
}
