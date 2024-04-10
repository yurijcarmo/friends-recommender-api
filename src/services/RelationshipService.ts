import { PersonService } from './PersonService';
import { RelationshipModel } from '../models';
import {
    BadRequestException,
    Inject,
    Injectable,
    forwardRef
} from '@nestjs/common';

@Injectable()
export class RelationshipService {
    private relationships: Set<string> = new Set();

    constructor(
        @Inject(forwardRef(() => PersonService))
        private readonly personService: PersonService
    ) { }

    createRelationship(cpf1: string, cpf2: string): RelationshipModel {
        if (cpf1 === cpf2) {
            throw new BadRequestException(
                'Cannot create a relationship with the same CPFs'
            );
        }

        this.checkIfUsersExist([cpf1, cpf2]);

        const relationshipKey = this.formatRelationshipKey(cpf1, cpf2);

        if (this.relationships.has(relationshipKey)) {
            throw new BadRequestException(
                `The relationship between ${cpf1} and ${cpf2} already exists.`
            );
        }

        this.relationships.add(relationshipKey);
        this.updateFriendsMutually(cpf1, cpf2);

        return new RelationshipModel(cpf1, cpf2);
    }

    getRelationships(): RelationshipModel[] {
        return Array.from(this.relationships).map(key => {
            const [cpf1, cpf2] = key.split('_');
            return new RelationshipModel(cpf1, cpf2);
        });
    }

    setRelationships(relationships: RelationshipModel[]): void {
        this.relationships = new Set<string>(relationships.map(
            rel => this.formatRelationshipKey(rel.cpf1, rel.cpf2)
        ));
    }

    hasRelationship(cpf1: string, cpf2: string): boolean {
        return this.relationships.has(this.formatRelationshipKey(cpf1, cpf2));
    }

    private formatRelationshipKey(cpf1: string, cpf2: string): string {
        const sortedCpfs = [cpf1, cpf2].sort();
        return sortedCpfs.join('_');
    }

    private updateFriendsMutually(cpfA: string, cpfB: string): void {
        this.personService.updatePersonFriends(cpfA, cpfB);
        this.personService.updatePersonFriends(cpfB, cpfA);
    }

    private checkIfUsersExist(cpfs: string[]): void {
        cpfs.forEach(cpf => {
            this.personService.getPerson(cpf);
        });
    }
}
