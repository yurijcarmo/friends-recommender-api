import { RelationshipService } from '../../../src/services/RelationshipService';
import { PersonService } from '../../../src/services';
import { RelationshipModel } from '../../../src/models';
import { 
    BadRequestException, 
    NotFoundException 
} from '@nestjs/common';
import { 
    Test, 
    TestingModule 
} from '@nestjs/testing';

const fixedDate = new Date('2024-04-12T14:18:24.828Z');
jest.useFakeTimers().setSystemTime(fixedDate);

describe('RelationshipService', () => {
    let service: RelationshipService;
    let personService: Partial<PersonService>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                RelationshipService,
                {
                    provide: PersonService,
                    useValue: {
                        getPerson: jest.fn(),
                        updatePersonFriends: jest.fn(),
                        createPerson: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<RelationshipService>(RelationshipService);
        personService = module.get<PersonService>(PersonService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should create a relationship and update friends mutually', () => {
        const cpf1 = '298.462.390-74';
        const cpf2 = '942.852.260-36';
        (personService.getPerson as jest.Mock).mockReturnValueOnce({
            cpf: cpf1,
            name: `Name for ${cpf1}`,
            friends: [],
            createdAt: fixedDate,
        });

        const rel1 = new RelationshipModel(cpf1, cpf2);

        expect(service.createRelationship(cpf1, cpf2))
        expect(service.getRelationships()).toEqual([rel1]);

        expect(personService.updatePersonFriends).toHaveBeenCalledWith(cpf1, cpf2);
        expect(personService.updatePersonFriends).toHaveBeenCalledWith(cpf2, cpf1);
    });

    it('should throw BadRequestException if the relationship already exists', () => {
        const rel1 = new RelationshipModel(
            '298.462.390-74', 
            '942.852.260-36'
        );
        service.setRelationships([rel1]);

        if (rel1 !== null) {
            expect(() => service.createRelationship(
                '298.462.390-74', 
                '942.852.260-36'
            )).toThrow(BadRequestException);

            expect(() => service.createRelationship(
                '942.852.260-36', 
                '298.462.390-74'
            )).toThrow(BadRequestException);
        }
    });

    it('should throw BadRequestException when attempting to create a relationship '
        + 'with the same CPFs', () => {
            const cpf = '298.462.390-74';
            expect(() => service.createRelationship(cpf, cpf))
                .toThrow(new BadRequestException(
                    'Cannot create a relationship with the same '
                    + 'CPFs'
                ));
        });

    it('should return all current relationships', () => {
        const rel1 = new RelationshipModel('298.462.390-74', '942.852.260-36');
        service.setRelationships([rel1]);
        expect(service.getRelationships()).toEqual([rel1]);
    });

    it('should clear all relationships when setRelationships is called with an '
        + 'empty array', () => {
            const rel1 = new RelationshipModel('298.462.390-74', '942.852.260-36');
            service.setRelationships([rel1]);
            service.setRelationships([]);
            expect(service.getRelationships()).toEqual([]);
        });

    it('should handle errors when a CPF does not exist', () => {
        (personService.getPerson as jest.Mock).mockImplementation(() => {
            throw new NotFoundException('Person not found');
        });
        expect(
            () => service.createRelationship('99999999999', '88888888888')
        ).toThrow(NotFoundException);
    });

    it('should return true if the relationship exists', () => {
        const rel1 = new RelationshipModel('298.462.390-74', '942.852.260-36');
        service.setRelationships([rel1]);

        expect(service.hasRelationship(
            '298.462.390-74', 
            '942.852.260-36')
        ).toBe(true);
    });

    it('should update friends mutually when creating a relationship', () => {
        const cpf1 = '816.596.840-92';
        const cpf2 = '851.885.140-49';
        (personService.getPerson as jest.Mock).mockReturnValueOnce({
            cpf: cpf1,
            name: `Name for ${cpf1}`,
            friends: [],
            createdAt: new Date(),
        });

        const rel1 = new RelationshipModel(cpf1, cpf2);
        service.createRelationship(cpf1, cpf2);

        expect(personService.updatePersonFriends).toHaveBeenCalledWith(cpf1, cpf2);
        expect(personService.updatePersonFriends).toHaveBeenCalledWith(cpf2, cpf1);
    });

    it('should return true if the relationship exists', () => {
        const cpf1 = '298.462.390-74';
        const cpf2 = '942.852.260-36';
        const rel1 = new RelationshipModel(cpf1, cpf2);
        service.setRelationships([rel1]);

        expect(service.hasRelationship(cpf1, cpf2)).toBe(true);
    });

    it('should return false if the relationship does not exist', () => {
        expect(service.hasRelationship(
            '942.852.260-36', 
            '298.462.390-74'
        )).toBe(false);
    });
});
