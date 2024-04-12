import { SocialGraphController } from '../../../src/controllers/SocialGraphController';
import { SocialGraphService } from '../../../src/services/SocialGraphService';
import {
    SocialGraphModel,
    PersonModel,
    RelationshipModel
} from '../../../src/models';
import {
    Test,
    TestingModule
} from '@nestjs/testing';

describe('SocialGraphController', () => {
    let controller: SocialGraphController;
    let service: SocialGraphService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [SocialGraphController],
            providers: [
                {
                    provide: SocialGraphService,
                    useValue: {
                        createRandomData: jest.fn().mockResolvedValue(
                            new SocialGraphModel({
                                persons: [],
                                relationships: []
                            })
                        ),
                    },
                },
            ],
        }).compile();

        controller = module.get<SocialGraphController>(SocialGraphController);
        service = module.get<SocialGraphService>(SocialGraphService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('Operations', () => {
        it('should create random social graph data and return the model', async () => {
            const expectedModel = new SocialGraphModel({
                persons: [new PersonModel('123', 'Test Person')],
                relationships: [new RelationshipModel('123', '456')]
            });

            jest.spyOn(service, 'createRandomData').mockReturnValue(expectedModel);

            const result = await controller.createRandomData();

            expect(result).toBeInstanceOf(SocialGraphModel);
            expect(result).toEqual(expectedModel);
            expect(service.createRandomData).toHaveBeenCalled();
        });
    });
});
