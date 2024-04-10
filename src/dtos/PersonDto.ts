import {
    IsNotEmpty,
    IsString,
    Length
} from 'class-validator';

export class PersonDto {

    @IsString()
    @IsNotEmpty()
    @Length(11, 11, {message: 'The CPF must have exactly 11 digits.'})
    cpf: string;

    @IsString()
    @IsNotEmpty()
    name: string;
}
