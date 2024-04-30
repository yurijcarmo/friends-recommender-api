import { RelationshipController } from '../../../src/controllers';
import { RelationshipService } from '../../../src/services';
import { RelationshipModel } from '../../../src/models';
import {
    Test,
    TestingModule
} from '@nestjs/testing';

describe('RelationshipController', () => {
    let controller: RelationshipController;
    let service: RelationshipService;

    beforeEach(async () => {
        const fixedDate = new Date('2024-04-12T14:18:24.828Z');
        jest.useFakeTimers().setSystemTime(fixedDate);

        const module: TestingModule = await Test.createTestingModule({
            controllers: [RelationshipController],
            providers: [
                {
                    provide: RelationshipService,
                    useValue: {
                        createRelationship: jest.fn().mockImplementation(
                            (cpf1, cpf2) => {
                                return { cpf1, cpf2, createdAt: fixedDate };
                            }
                        ),
                        getRelationships: jest.fn().mockReturnValue([]),
                    },
                },
            ],
        }).compile();

        controller = module.get<RelationshipController>(RelationshipController);
        service = module.get<RelationshipService>(RelationshipService);
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('Operations', () => {
        it('should create a relationship and return that relationship', () => {
            const relationshipDto = { 
                cpf1: '298.462.390-74', 
                cpf2: '942.852.260-36' 
            };
            const result = controller.createRelationship(relationshipDto);
            expect(result).toEqual(new RelationshipModel(
                relationshipDto.cpf1,
                relationshipDto.cpf2
            ));
            expect(service.createRelationship).toHaveBeenCalledWith(
                relationshipDto.cpf1,
                relationshipDto.cpf2
            );
        });

        it('should return all relationships', () => {
            const result = controller.findByAll();
            expect(result).toEqual([]);
            expect(service.getRelationships).toHaveBeenCalled();
        });
    });
});
