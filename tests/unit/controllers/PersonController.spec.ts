import { PersonController } from '../../../src/controllers';
import { PersonService } from '../../../src/services';
import { 
    Test, 
    TestingModule 
} from '@nestjs/testing';

describe('PersonController', () => {
    let controller: PersonController;
    let service: PersonService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [PersonController],
            providers: [
                {
                    provide: PersonService,
                    useValue: {
                        createPerson: jest.fn().mockImplementation(dto => dto),
                        getPerson: jest.fn().mockImplementation(
                            cpf => ({ cpf, name: 'Test Name' })
                        ),
                        cleanPersons: jest.fn().mockResolvedValue(undefined),
                        getPersons: jest.fn().mockReturnValue([])
                    },
                },
            ],
        }).compile();

        controller = module.get<PersonController>(PersonController);
        service = module.get<PersonService>(PersonService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('Operations', () => {
        it('should create a person and return that person', () => {
            const personDto = { cpf: '298.462.390-74', name: 'Test Name' };
            const result = controller.createPerson(personDto);
            expect(result).toEqual(personDto);
            expect(service.createPerson).toHaveBeenCalledWith(personDto);
        });

        it('should retrieve a person by cpf', () => {
            const cpf = '298.462.390-74';
            const result = controller.getPerson(cpf);
            expect(result).toEqual({ cpf, name: 'Test Name' });
            expect(service.getPerson).toHaveBeenCalledWith(cpf);
        });

        it('should clean persons', () => {
            controller.cleanPersons();
            expect(service.cleanPersons).toHaveBeenCalled();
        });

        it('should return all persons', () => {
            const result = controller.findByAll();
            expect(result).toEqual([]);
            expect(service.getPersons).toHaveBeenCalled();
        });
    });
});
