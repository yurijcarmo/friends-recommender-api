import {
    BadRequestException
} from '@nestjs/common';
import {
    Injectable,
    Inject,
    forwardRef
} from '@nestjs/common';
import {
    PersonModel,
    SocialGraphModel
} from '../models';
import {
    PersonService,
    RelationshipService
} from '.';

@Injectable()
export class SocialGraphService {
    constructor(
        @Inject(forwardRef(() => RelationshipService))
        private readonly relationshipService: RelationshipService,
        private readonly personService: PersonService
    ) { }

    /*
    * 
    * The method below generates 10 people with unique CPFs and names, and 
    * establishes random relationships among them.
    * 
    * It was created with the intent to optimize data generation for testing 
    * purposes.
    * 
    * Although the data is stored in memory, it facilitates the development 
    * and validation of functionalities, without the need for external data 
    * persistence.
    * 
    */
    createRandomData(): SocialGraphModel {
        try {
            this.generateUniquePeople(10);
            this.generateRandomRelationships();
            return this.getSocialGraph();
        } catch (error) {
            throw new BadRequestException(
                `Failed to create random data: ${error.message}`
            );
        }
    }

    private generateUniquePeople(count: number): void {
        const uniqueCpfs = new Set<string>();
        while (uniqueCpfs.size < count) {
            const cpf = this.generateCpf();
            if (!uniqueCpfs.has(cpf)) {
                const name = `Person ${Math.random().toString(36).substring(2, 9)}`;
                this.personService.createPerson(new PersonModel(cpf, name));
                uniqueCpfs.add(cpf);
            }
        }
    }

    private generateCpf(): string {
        return (Math.floor(Math.random() * 10000000000) + 90000000000).toString();
    }

    private generateRandomRelationships(): void {
        const persons = this.personService.getPersons();
        persons.forEach(person => {
            const friendOptions = persons.filter(p => p.cpf !== person.cpf);
            while (person.friends.length < 3 && friendOptions.length > 0) {
                const friendIndex = Math.floor(Math.random() * friendOptions.length);
                const friend = friendOptions.splice(friendIndex, 1)[0];
                if (!this.relationshipService.hasRelationship(person.cpf, friend.cpf)) {
                    this.relationshipService.createRelationship(person.cpf, friend.cpf);
                }
            }
        });
    }

    private getSocialGraph(): SocialGraphModel {
        const persons = this.personService.getPersons();
        const relationships = this.relationshipService.getRelationships();
        return new SocialGraphModel({
            persons,
            relationships
        });
    }
}