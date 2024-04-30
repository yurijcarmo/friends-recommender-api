import { PersonService } from '../../../src/services/PersonService';
import { PersonModel } from '../../../src/models';
import { RelationshipService } from '../../../src/services/RelationshipService';
import {
    BadRequestException,
    NotFoundException
} from '@nestjs/common';
import {
    Test,
    TestingModule
} from '@nestjs/testing';

jest.mock('../../../src/services/RelationshipService', () => ({
    RelationshipService: jest.fn().mockImplementation(() => ({
        hasRelationship: jest.fn(),
        setRelationships: jest.fn(),
    })),
}));

describe('PersonService', () => {
    let service: PersonService;
    let relationshipService: RelationshipService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PersonService,
                RelationshipService,
            ],
        }).compile();

        service = module.get<PersonService>(PersonService);
        relationshipService = module.get<RelationshipService>(RelationshipService);
    });

    describe('createPerson', () => {
        it('should create a person if CPF does not exist', () => {
            const cpf = '123.456.789-09';
            const name = 'Name Test 1';
            const personData = new PersonModel(cpf, name);
            const createdPerson = service.createPerson(personData);
            expect(createdPerson).toEqual(expect.objectContaining({ cpf, name }));
            expect(service.getPersons()).toContainEqual(expect.objectContaining(
                { cpf, name }
            ));
        });

        it('should throw BadRequestException if the person with the same CPF is '
            + 'already registered', () => {
                const personData = new PersonModel('123.456.789-09', 'Name Test 1');
                service.createPerson(personData);
                expect(() => service.createPerson(personData)).toThrow(
                    BadRequestException
                );
                expect(() => service.createPerson(personData)).toThrow(
                    `The CPF: '${personData.cpf}' is already registered.`
                );
            });
    });

    describe('getPerson', () => {
        it('should return a person if CPF exists', () => {
            const personData = new PersonModel('123.456.789-09', 'Name Test 1');
            service.createPerson(personData);
            const person = service.getPerson('123.456.789-09');
            expect(person).toEqual(expect.objectContaining({
                cpf: '123.456.789-09', name: 'Name Test 1'
            }));
        });

        it('should throw NotFoundException if the person does not exist', () => {
            const cpf = '999.999.999-99';
            expect(() => service.getPerson(cpf)).toThrow(NotFoundException);
            expect(() => service.getPerson(cpf)).toThrow(
                `The CPF: '${cpf}' was not found in our database.`
            );
        });
    });

    describe('updatePersonFriends', () => {
        it('should add a friend to an existing person', () => {
            const personData = new PersonModel('123.456.789-09', 'Name Test 1');
            service.createPerson(personData);
            const updatedPersons = service.updatePersonFriends(
                '123.456.789-09', '987.654.321-09'
            );
            expect(updatedPersons[0].friends).toContain(
                '987.654.321-09'
            );
        });

        it('should throw NotFoundException if CPF does not exist for updating '
            + 'friends', () => {
                const cpf = '999.999.999-99';
                expect(() => service.updatePersonFriends(cpf, '987.654.321-09'))
                    .toThrow(NotFoundException);
                expect(() => service.updatePersonFriends(cpf, '987.654.321-09'))
                    .toThrow(`The CPF: '${cpf}' was not found in our database.`);
            });
    });

    describe('setPerson', () => {
        it('should add a person to the list and return the updated list', () => {
            const person1 = new PersonModel('123.456.789-09', 'Person One');
            const person2 = new PersonModel('987.654.321-09', 'Person Two');

            service.setPerson(person1);
            const result = service.setPerson(person2);

            expect(result).toContainEqual(person1);
            expect(result).toContainEqual(person2);
            expect(result.length).toEqual(2);
        });
    });

    describe('cleanPersons', () => {
        it('should clear all persons and relationships', () => {
            service.cleanPersons();
            expect(service.getPersons()).toEqual([]);
            expect(relationshipService.setRelationships).toHaveBeenCalledWith([]);
        });
    });

    describe('getPersons', () => {
        it('should return all persons', () => {
            const person1 = new PersonModel('123.456.789-09', 'Alice');
            const person2 = new PersonModel('987.654.321-09', 'Bob');
            service.setPerson(person1);
            service.setPerson(person2);

            const persons = service.getPersons();

            expect(persons.length).toEqual(2);
            expect(persons).toContainEqual(person1);
            expect(persons).toContainEqual(person2);
        });
    });

    describe('hasRelationship', () => {
        it('should return true if a relationship exists between two CPFs', () => {
            const mockHasRelationship = jest.spyOn(
                relationshipService, 
                'hasRelationship'
            );

            mockHasRelationship.mockReturnValue(true);
            
            const result = service.hasRelationship(
                '123.456.789-09', 
                '987.654.321-09'
            );
            expect(result).toBe(true);
        });

        it('should return false if no relationship exists between two CPFs', () => {
            const mockHasRelationship = jest.spyOn(
                relationshipService, 
                'hasRelationship'
            );
            mockHasRelationship.mockReturnValue(false);
            const result = service.hasRelationship(
                '123.456.789-09', 
                '987.654.321-09'
            );
            expect(result).toBe(false);
        });
    });
});
