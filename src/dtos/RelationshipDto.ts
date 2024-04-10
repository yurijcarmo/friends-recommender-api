import { 
    IsNotEmpty, 
    IsString, 
    Length 
} from "class-validator";

export class RelationshipDto {

    @IsString()
    @IsNotEmpty()
    @Length(11, 11, {message: 'The CPF must have exactly 11 digits.'})
    cpf1: string;

    @IsString()
    @IsNotEmpty()
    @Length(11, 11, {message: 'The CPF must have exactly 11 digits.'})
    cpf2: string;
}