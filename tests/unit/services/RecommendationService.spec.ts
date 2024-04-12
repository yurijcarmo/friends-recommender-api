import { RecommendationService } from '../../../src/services/RecommendationService';
import { PersonService } from '../../../src/services/PersonService';
import { PersonModel } from '../../../src/models';
import { NotFoundException } from '@nestjs/common';
import { 
    Test, 
    TestingModule 
} from '@nestjs/testing';

describe('RecommendationService', () => {
    let service: RecommendationService;
    let personService: jest.Mocked<PersonService>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                RecommendationService,
                {
                    provide: PersonService,
                    useValue: {
                        getPerson: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<RecommendationService>(RecommendationService);
        personService = module.get(PersonService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    function setupPersons() {
        const ana = new PersonModel(
            '11111111111', 
            'Ana', 
            ['22222222222']
        );
        const bruno = new PersonModel(
            '22222222222', 
            'Bruno', 
            ['11111111111', '33333333333', '44444444444']
        );
        const carlos = new PersonModel(
            '33333333333', 
            'Carlos', 
            ['22222222222']
        );
        const daniel = new PersonModel(
            '44444444444', 
            'Daniel', 
            ['22222222222', '55555555555']
        );
        const elisa = new PersonModel(
            '55555555555', 
            'Elisa', 
            ['44444444444']
        );

        personService.getPerson.mockImplementation(cpf => {
            switch (cpf) {
                case '11111111111': return ana;
                case '22222222222': return bruno;
                case '33333333333': return carlos;
                case '44444444444': return daniel;
                case '55555555555': return elisa;
                default: throw new NotFoundException(
                    `Person not found for CPF: ${cpf}`
                );
            }
        });
    }

    it('should provide recommendations based on friends of friends', () => {
        setupPersons();
        const recommendations = service.getRecommendations('11111111111');
        expect(recommendations).toEqual(['33333333333', '44444444444']);
        expect(personService.getPerson).toHaveBeenCalledTimes(4);
    });

    it('should return an empty list when the person has no friends', () => {
        const lonelyPerson = new PersonModel('11111111111', 'Ana', []);
        personService.getPerson.mockReturnValue(lonelyPerson);
        const recommendations = service.getRecommendations('11111111111');
        expect(recommendations).toEqual([]);
    });

    it('should throw a NotFoundException when the person is not found', () => {
        personService.getPerson.mockImplementation(() => {
            throw new NotFoundException('Person not found');
        });
        expect(() => service.getRecommendations('11111111111')).toThrow(
            new NotFoundException('Failed to get recommendations: Person not found')
        );
    });

    it('should sort recommendations by the number of common friends', () => {
        setupPersons();
        const recommendations = service.getRecommendations('11111111111');
        expect(recommendations).toEqual(['33333333333', '44444444444']);
        expect(recommendations[0]).toBe('33333333333');
    });

    it('should eliminate duplicate friends in recommendations from multiple '
    + 'layers of friends', () => {
        setupPersons();
        const recommendations = service.getRecommendations('11111111111');
        expect(recommendations).toEqual(['33333333333', '44444444444']);
        expect(personService.getPerson).toHaveBeenCalledTimes(4);
    });

    it('should count zero common friends when there are no intersecting '
    + 'friendships', () => {
        const ana = new PersonModel(
            '11111111111', 
            'Ana', 
            ['22222222222', '33333333333']
        );
        const bruno = new PersonModel(
            '22222222222', 
            'Bruno', 
            ['11111111111', '44444444444']
        );
        const carlos = new PersonModel(
            '33333333333', 
            'Carlos', 
            ['11111111111', '55555555555']
        );

        personService.getPerson.mockImplementation(cpf => {
            switch (cpf) {
                case '11111111111': return ana;
                case '22222222222': return bruno;
                case '33333333333': return carlos;
                default: return new PersonModel(cpf, "Unknown", []);
            }
        });

        const recommendations = service.getRecommendations('33333333333');

        expect(recommendations).toEqual(['22222222222']);
        expect(personService.getPerson).toHaveBeenCalledTimes(4);
    });
});
