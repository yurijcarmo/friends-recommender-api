import { PersonModel } from '../models';
import { RelationshipService } from './RelationshipService';
import { 
    BadRequestException, 
    NotFoundException 
} from '@nestjs/common';
import { 
    Injectable, 
    Inject, 
    forwardRef 
} from '@nestjs/common';

@Injectable()
export class PersonService {
    private personsMap: Map<string, PersonModel> = new Map();

    constructor(
        @Inject(forwardRef(() => RelationshipService))
        private readonly relationshipService: RelationshipService
    ) { }

    createPerson(data: PersonModel): PersonModel {
        if (this.personsMap.has(data.cpf)) {
            throw new BadRequestException(
                `The CPF: '${data.cpf}' is already registered.`
            );
        }
        this.personsMap.set(data.cpf, new PersonModel(data.cpf, data.name));
        return data;
    }

    getPerson(cpf: string): PersonModel {
        const person = this.personsMap.get(cpf);
        if (!person) {
            throw new NotFoundException(
                `The CPF: '${cpf}' was not found in our database.`
            );
        }
        return person;
    }

    cleanPersons(): string {
        this.personsMap.clear();
        this.relationshipService.setRelationships([]);
        return 'Data for persons and relationships successfully removed '
        + 'from memory.';
    }

    getPersons(): PersonModel[] {
        return Array.from(this.personsMap.values());
    }

    setPerson(person: PersonModel): PersonModel[] {
        this.personsMap.set(person.cpf, person);
        return this.getPersons();
    }

    updatePersonFriends(cpf: string, friend: string): PersonModel[] {
        const person = this.personsMap.get(cpf);
        if (!person) {
            throw new NotFoundException(
                `The CPF: '${cpf}' was not found in our database.`
            );
        }
        person.friends.push(friend);
        return this.getPersons();
    }

    hasRelationship(cpf1: string, cpf2: string): boolean {
        return this.relationshipService.hasRelationship(cpf1, cpf2);
    }
}
