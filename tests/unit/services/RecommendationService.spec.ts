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
            '298.462.390-74',
            'Ana', 
            ['942.852.260-36']
        );
        const bruno = new PersonModel(
            '942.852.260-36',
            'Bruno', 
            ['298.462.390-74', '816.596.840-92', '851.885.140-49']
        );
        const carlos = new PersonModel(
            '816.596.840-92',
            'Carlos', 
            ['942.852.260-36']
        );
        const daniel = new PersonModel(
            '851.885.140-49',
            'Daniel', 
            ['942.852.260-36', '122.462.380-03']
        );
        const elisa = new PersonModel(
            '122.462.380-03',
            'Elisa', 
            ['851.885.140-49']
        );

        personService.getPerson.mockImplementation(cpf => {
            switch (cpf) {
                case '298.462.390-74': return ana;
                case '942.852.260-36': return bruno;
                case '816.596.840-92': return carlos;
                case '851.885.140-49': return daniel;
                case '122.462.380-03': return elisa;
                default: throw new NotFoundException(
                    `Person not found for CPF: ${cpf}`
                );
            }
        });
    }

    it('should provide recommendations based on friends of friends', () => {
        setupPersons();
        const recommendations = service.getRecommendations('298.462.390-74');
        expect(recommendations).toEqual(['816.596.840-92', '851.885.140-49']);
        expect(personService.getPerson).toHaveBeenCalledTimes(4);
    });

    it('should return an empty list when the person has no friends', () => {
        const lonelyPerson = new PersonModel('298.462.390-74', 'Ana', []);
        personService.getPerson.mockReturnValue(lonelyPerson);
        const recommendations = service.getRecommendations('298.462.390-74');
        expect(recommendations).toEqual([]);
    });

    it('should throw a NotFoundException when the person is not found', () => {
        personService.getPerson.mockImplementation(() => {
            throw new NotFoundException('Person not found');
        });
        expect(() => service.getRecommendations('298.462.390-74')).toThrow(
            new NotFoundException('Failed to get recommendations: Person not found')
        );
    });

    it('should sort recommendations by the number of common friends', () => {
        setupPersons();
        const recommendations = service.getRecommendations('298.462.390-74');
        expect(recommendations).toEqual(['816.596.840-92', '851.885.140-49']);
        expect(recommendations[0]).toBe('816.596.840-92');
    });

    it('should eliminate duplicate friends in recommendations from multiple '
    + 'layers of friends', () => {
        setupPersons();
        const recommendations = service.getRecommendations('298.462.390-74');
        expect(recommendations).toEqual(['816.596.840-92', '851.885.140-49']);
        expect(personService.getPerson).toHaveBeenCalledTimes(4);
    });

    it('should count zero common friends when there are no intersecting '
    + 'friendships', () => {
        const ana = new PersonModel(
            '298.462.390-74', 
            'Ana', 
            ['942.852.260-36', '816.596.840-92']
        );
        const bruno = new PersonModel(
            '942.852.260-36', 
            'Bruno', 
            ['298.462.390-74', '851.885.140-49']
        );
        const carlos = new PersonModel(
            '816.596.840-92', 
            'Carlos', 
            ['298.462.390-74', '122.462.380-03']
        );

        personService.getPerson.mockImplementation(cpf => {
            switch (cpf) {
                case '298.462.390-74': return ana;
                case '942.852.260-36': return bruno;
                case '816.596.840-92': return carlos;
                default: return new PersonModel(cpf, "Unknown", []);
            }
        });

        const recommendations = service.getRecommendations('816.596.840-92');

        expect(recommendations).toEqual(['942.852.260-36']);
        expect(personService.getPerson).toHaveBeenCalledTimes(4);
    });
});
