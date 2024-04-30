import { CpfValidator } from "../validators";
import { 
    IsNotEmpty, 
    IsString, 
    Validate
} from "class-validator";

export class RelationshipDto {

    @IsString()
    @IsNotEmpty()
    @Validate(CpfValidator)
    cpf1: string;

    @IsString()
    @IsNotEmpty()
    @Validate(CpfValidator)
    cpf2: string;
}