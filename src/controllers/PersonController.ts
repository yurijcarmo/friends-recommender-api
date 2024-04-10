import { PersonModel } from '../models';
import { PersonDto } from '../dtos';
import { PersonService } from '../services';
import { ValidateCpfPipe } from '../pipes';
import {
    Controller,
    Get,
    Post,
    Delete,
    Body,
    Param,
    HttpCode
} from '@nestjs/common';

@Controller()
export class PersonController {

    constructor(
        private readonly personService: PersonService
    ) { }

    @Post('person')
    @HttpCode(200)
    createPerson(@Body() data: PersonDto): PersonModel {
        return this.personService.createPerson(data as PersonModel);
    }

    @Get('person/:cpf')
    getPerson(@Param('cpf', ValidateCpfPipe) cpf: string): PersonModel {
        return this.personService.getPerson(cpf);
    }

    @Delete('clean')
    cleanPersons(): string {
        return this.personService.cleanPersons();
    }

    @Get('persons')
    findByAll(): PersonModel[] {
        return this.personService.getPersons();
    }
}