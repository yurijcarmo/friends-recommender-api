import { SocialGraphService } from '../../../src/services/SocialGraphService';
import { PersonService } from '../../../src/services/PersonService';
import { RelationshipService } from '../../../src/services/RelationshipService';
import { BadRequestException } from '@nestjs/common';
import { 
    Test, 
    TestingModule 
} from '@nestjs/testing';
import { 
    PersonModel, 
    RelationshipModel, 
    SocialGraphModel 
} from '../../../src/models';

jest.mock('../../../src/services/PersonService');
jest.mock('../../../src/services/RelationshipService');

describe('SocialGraphService', () => {
    let service: SocialGraphService;
    let personService: jest.Mocked<PersonService>;
    let relationshipService: jest.Mocked<RelationshipService>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                SocialGraphService,
                PersonService,
                RelationshipService
            ],
        }).compile();

        service = module.get<SocialGraphService>(SocialGraphService);
        personService = module.get(PersonService);
        relationshipService = module.get(RelationshipService);

        personService.createPerson.mockImplementation((data) => {
            return { ...data, createdAt: new Date() };
        });

        personService.getPersons.mockReturnValue([
            new PersonModel('298.462.390-74', 'Ana'),
            new PersonModel('942.852.260-36', 'Carlos')
        ]);

        relationshipService.createRelationship.mockImplementation((cpf1, cpf2) => {
            return new RelationshipModel(cpf1, cpf2);
        });

        relationshipService.getRelationships.mockReturnValue([
            new RelationshipModel('298.462.390-74', '942.852.260-36')
        ]);
    });

    it('should create random social graph data and validate the generation process', 
    async () => {
        const result = service.createRandomData();

        expect(result).toBeInstanceOf(SocialGraphModel);
        expect(result.persons.length).toBeGreaterThanOrEqual(1);
        expect(result.relationships.length).toBeGreaterThanOrEqual(1);

        result.persons.forEach(person => {
            expect(person).toBeInstanceOf(PersonModel);
            expect(person.cpf).toBeDefined();
            expect(person.name).toBeDefined();
        });

        result.relationships.forEach(relationship => {
            expect(relationship).toBeInstanceOf(RelationshipModel);
            expect(relationship.cpf1).toBeDefined();
            expect(relationship.cpf2).toBeDefined();
            expect(relationship.cpf1).not.toBe(relationship.cpf2);
        });
    });

    it('should catch and handle exceptions during random data generation', () => {
        personService.getPersons.mockImplementationOnce(() => {
            throw new Error('Simulated random data generation error');
        });

        expect(() => service.createRandomData()).toThrow(BadRequestException);
    });
});
